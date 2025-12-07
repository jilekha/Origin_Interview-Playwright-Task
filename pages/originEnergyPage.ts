import { Page, expect, Locator } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class OriginEnergyPage {
  readonly page: Page;
  readonly addressInput: Locator;
  readonly electricityCheckbox: Locator;
  readonly tableLocator: Locator;
  readonly planLinkLocator: Locator;
  readonly energyTypeColumn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addressInput = page.getByRole('combobox', { name: 'Your address' });
    this.electricityCheckbox = page.locator('//span[@data-id="elc-checkbox-checkbox-base"]/input').first();
    this.tableLocator = page.locator('//table[@data-id="table"]/tr');
    this.planLinkLocator = page.getByRole('link', { name: 'Origin Basic' }).first();
    this.energyTypeColumn = page.locator('//table[@data-id="table"]/tr/td[2]');
  }

  /**
   * Navigate to the Origin Energy pricing page
   */
  async navigateToPricingPage(): Promise<void> {
    await this.page.goto('https://www.originenergy.com.au/pricing.html');
    await expect(this.page).toHaveURL(/pricing/);
  }

  /**
   * Search for an address and wait for plans to load
   * @param address - The address to search for
   * @param expectedAddressDisplay - The expected address display pattern
   */
  async searchForAddress(address: string, expectedAddressDisplay: RegExp): Promise<void> {
    await this.addressInput.click();
    await this.addressInput.fill(address);
    
    // Wait for address dropdown to appear
    await expect(this.page.getByRole('option', { name: expectedAddressDisplay })).toBeVisible({ timeout: 5000 });
    
    // Select address from list
    await this.page.getByRole('option', { name: expectedAddressDisplay }).click();
    
    // Wait for plans to load
    await this.page.waitForTimeout(5000);
  }

  /**
   * Verify that plans are displayed in the table
   */
  async verifyPlansDisplayed(): Promise<number> {
    const rowCount = await this.tableLocator.count();
    expect(rowCount).toBeGreaterThan(0);
    return rowCount;
  }

  /**
   * Take a screenshot of all plans
   * @param fileName - The name of the screenshot file
   */
  async takeScreenshot(fileName: string): Promise<void> {
    await this.page.screenshot({ 
      path: `screenshots/${fileName}`, 
      fullPage: true 
    });
  }

  /**
   * Uncheck the electricity checkbox to filter for gas plans only
   */
  async filterGasPlansOnly(): Promise<void> {
    await this.electricityCheckbox.uncheck();
    
    // Wait for table to update
    await this.page.waitForTimeout(2000);
  }

  /**
   * Verify that only gas plans are displayed
   */
  async verifyOnlyGasPlansDisplayed(): Promise<number> {
    const gasPlans = this.tableLocator;
    const gasPlansCount = await gasPlans.count();
    expect(gasPlansCount).toBeGreaterThan(0);
    
    // Verify all displayed plans are gas plans
    const gasPlansText = await this.energyTypeColumn.allTextContents();
    const allAreGas = gasPlansText.every(text => text.includes('Natural gas'));
    expect(allAreGas).toBeTruthy();
    
    return gasPlansCount;
  }

  /**
   * Click on the first plan link and open it in a new tab
   */
  async openPlanInNewTab(): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.planLinkLocator.click()
    ]);
    
    // Verify PDF opened in new tab
    await newPage.waitForLoadState('load');
    const pdfUrl = newPage.url();
    expect(pdfUrl).toContain('.pdf');
    
    return newPage;
  }

  /**
   * Download PDF from the given URL
   * @param pdfUrl - The URL of the PDF to download
   * @param fileName - The name to save the PDF as
   */
  async downloadPdf(pdfUrl: string, fileName: string): Promise<void> {
    // Fetch the PDF using Playwright's request API
    const response = await this.page.request.get(pdfUrl);

    // Ensure the response is OK
    if (response.ok()) {
      // Get the PDF buffer
      const buffer = await response.body();

      // Define the 'downloads' folder path inside your project folder
      const downloadsFolder = path.join(__dirname, '..', 'downloads');
      
      // Check if 'downloads' folder exists, if not, create it
      if (!fs.existsSync(downloadsFolder)) {
        fs.mkdirSync(downloadsFolder, { recursive: true });
      }

      // Define the file name and path to save the PDF
      const savePath = path.join(downloadsFolder, fileName);

      // Write the buffer to a file
      fs.writeFileSync(savePath, buffer);
      console.log(`PDF downloaded successfully and saved to ${savePath}`);
    } else {
      console.log(`Failed to download the PDF. Status code: ${response.status()}`);
    }
  }

  /**
   * Verify that the PDF URL contains .pdf extension
   * @param pdfUrl - The URL to verify
   */
  async verifyPdfUrl(pdfUrl: string): Promise<void> {
    expect(pdfUrl).toContain('.pdf');
  }
}
