import { test, expect } from '@playwright/test';
import { OriginEnergyPage } from '../pages/originEnergyPage.js';

test.describe('Origin Energy Pricing - Complete User Flow', () => {
  const ADDRESS = '17 Bolinda Road, Balwyn North, VIC 3104';
  const EXPECTED_ADDRESS_DISPLAY = /17 Bolinda Road, BALWYN NORTH VIC 3104/i;
  let originEnergyPage;

  test.beforeEach(async ({ page }) => {
    originEnergyPage = new OriginEnergyPage(page);
  });

  test('should complete entire pricing and plan selection flow', async ({ page }) => {
    // Step 1: Navigate to Origin Energy pricing page
    await test.step('Navigate to pricing page', async () => {
      await originEnergyPage.navigateToPricingPage();
    });

    // Step 2: Search for address and display all plans
    await test.step('Search for address and display all plans', async () => {
      await originEnergyPage.searchForAddress(ADDRESS, EXPECTED_ADDRESS_DISPLAY);
      await originEnergyPage.verifyPlansDisplayed();
      await originEnergyPage.takeScreenshot('01-all-plans.png');
    });

    // Step 3: Filter to show only gas plans
    await test.step('Filter to show only gas plans', async () => {
      await originEnergyPage.filterGasPlansOnly();
      await originEnergyPage.verifyOnlyGasPlansDisplayed();
      await originEnergyPage.takeScreenshot('02-gas-plans-only.png');
    });

    // Step 4: Click on first gas plan and open in new tab
    await test.step('Open plan details in new tab', async () => {
      const newPage = await originEnergyPage.openPlanInNewTab();
      const pdfUrl = newPage.url();
      
      // Take screenshot of PDF
      await newPage.waitForTimeout(10000);
      await newPage.screenshot({ 
        path: 'screenshots/03-gas-plan-pdf.png',
        fullPage: true
      });

      // Step 5: Download PDF to Local system
      await test.step('Download PDF from plan details', async () => {
        await originEnergyPage.downloadPdf(pdfUrl, 'gasplan.pdf');
      });

      // Step 6: Verify PDF content confirms gas plan
      await test.step('Verify PDF contains gas plan information', async () => {
        await originEnergyPage.verifyPdfUrl(pdfUrl);
      });
    });
  });
});
