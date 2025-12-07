# Origin Energy Pricing Test Automation

Automated end-to-end testing suite for Origin Energy's pricing page using Playwright Test Framework with Page Object Model (POM) architecture.

## 📋 Project Overview

This project automates the complete user flow for browsing and selecting energy plans on the Origin Energy website:

1. Navigate to the pricing page
2. Search for a specific address
3. View all available plans (electricity + gas)
4. Filter to show only gas plans
5. Open plan details in a new tab
6. Download the plan PDF document
7. Verify PDF content

## 🛠️ Tech Stack

- **Framework**: Playwright Test (v1.57.0)
- **Language**: TypeScript
- **Test Runner**: Playwright
- **Architecture**: Page Object Model (POM)
- **Node.js**: Compatible with latest LTS versions

## 📁 Project Structure

```
PlaywrightTask/
├── pages/
│   └── originEnergyPage.ts       # Page Object Model class
├── tests/
│   └── interviewtask.spec.ts     # Test specifications
├── screenshots/                   # Test output screenshots
├── downloads/                     # Downloaded PDF files
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Dependencies & scripts
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Git (optional)

### Installation

1. **Clone or download the repository**
   ```bash
   cd PlaywrightTask
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers** (if not already installed)
   ```bash
   npx playwright install
   ```

## 📖 Usage

### Run All Tests

```bash
npm test
```

### Run Tests in Specific Browser

```bash
# Chromium only
npm run test:chromium

# Firefox only
npm run test:firefox

# WebKit (Safari) only
npm run test:webkit
```

### Run Tests in UI Mode (Interactive)

```bash
npm run test:ui
```

### Run Tests in Headed Mode (See Browser Window)

```bash
npx playwright test --headed
```

### Debug Tests

```bash
npm run test:debug
```

### View Test Report

```bash
npm run test:report
```

## 📝 Test Details

### Test: Complete Pricing and Plan Selection Flow

**File**: `tests/interviewtask.spec.ts`

**Test Steps**:

1. **Navigate to Pricing Page**
   - Opens the Origin Energy pricing page
   - Verifies page loads successfully

2. **Search for Address and Display Plans**
   - Enters address: "17 Bolinda Road, Balwyn North, VIC 3104"
   - Waits for address dropdown
   - Selects the matching address
   - Verifies plans table loads
   - Captures screenshot of all plans

3. **Filter to Gas Plans Only**
   - Unchecks the Electricity checkbox
   - Verifies only gas plans are displayed
   - Confirms all displayed plans contain "Natural gas"
   - Captures screenshot of filtered plans

4. **Open Plan Details in New Tab**
   - Clicks on the first plan link
   - Verifies PDF opens in a new tab
   - Validates PDF URL contains `.pdf`
   - Captures PDF screenshot

5. **Download PDF**
   - Downloads the PDF file to local system
   - Saves to `downloads/gasplan.pdf`
   - Creates downloads directory if it doesn't exist

6. **Verify PDF Content**
   - Confirms PDF URL structure
   - Validates file download success

## 🏗️ Page Object Model (POM)

### OriginEnergyPage Class

**File**: `pages/originEnergyPage.ts`

Encapsulates all interactions with the Origin Energy pricing page:

**Key Methods**:

| Method | Purpose |
|--------|---------|
| `navigateToPricingPage()` | Navigate to the pricing URL |
| `searchForAddress()` | Search and select an address |
| `verifyPlansDisplayed()` | Verify plans loaded in table |
| `filterGasPlansOnly()` | Uncheck electricity checkbox |
| `verifyOnlyGasPlansDisplayed()` | Verify only gas plans show |
| `openPlanInNewTab()` | Click plan link and handle new tab |
| `downloadPdf()` | Download PDF to local system |
| `takeScreenshot()` | Capture page screenshots |
| `verifyPdfUrl()` | Verify PDF URL validity |

## ⚙️ Configuration

### playwright.config.ts

Key configuration settings:

- **testDir**: `./tests` - Location of test files
- **fullyParallel**: `false` - Run tests sequentially (for external site stability)
- **retries**: `2` (CI only) - Retry failed tests
- **workers**: `1` - Single worker process
- **screenshot**: `only-on-failure` - Capture screenshots only on failures
- **video**: `retain-on-failure` - Record video only on failures
- **trace**: `on-first-retry` - Collect traces on retry

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npm run test:report
```

Reports include:
- Test execution timeline
- Step-by-step breakdown
- Screenshots and videos
- Error details and logs

## 🎯 Selectors Used

The test uses semantic selectors via Playwright's locator strategies:

| Element | Selector |
|---------|----------|
| Address Input | `getByRole('combobox', { name: 'Your address' })` |
| Electricity Checkbox | `locator('//span[@data-id="elc-checkbox-checkbox-base"]/input').first()` |
| Plans Table | `locator('//table[@data-id="table"]/tr')` |
| Plan Links | `getByRole('link', { name: 'Origin Basic' })` |
| Energy Type Column | `locator('//table[@data-id="table"]/tr/td[2]')` |

## 📁 Output Files

After test execution:

- **screenshots/**: Test screenshots
  - `01-all-plans.png` - All plans view
  - `02-gas-plans-only.png` - Filtered gas plans
  - `03-gas-plan-pdf.png` - PDF document
  
- **downloads/**: Downloaded files
  - `gasplan.pdf` - Downloaded plan document

- **playwright-report/**: HTML test report

## 🔧 Troubleshooting

### Tests timing out

Increase timeout values in `playwright.config.ts`:

```typescript
use: {
  navigationTimeout: 30000,
  actionTimeout: 10000,
}
```

### Element not found errors

- Verify the website structure hasn't changed
- Update selectors in `originEnergyPage.ts`
- Check element visibility with `.isVisible()` before interaction

### Browser crashes

Try running in headed mode to debug:

```bash
npx playwright test --headed --debug
```

## 🐛 Debugging

### Debug mode

```bash
npm run test:debug
```

This opens the Playwright Inspector allowing step-by-step execution.

### View network requests

```typescript
// In test file
const requests = await page.context().close();
```

### Log element info

```typescript
const element = page.getByRole('button');
console.log(await element.textContent());
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Test Framework](https://playwright.dev/docs/test-intro)
- [Page Object Model Guide](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)

## 📝 Script Commands

Available npm scripts in `package.json`:

```json
{
  "test": "playwright test",
  "test:ui": "playwright test --ui",
  "test:debug": "playwright test --debug",
  "test:headed": "playwright test --headed",
  "test:chromium": "playwright test --project=chromium",
  "test:firefox": "playwright test --project=firefox",
  "test:webkit": "playwright test --project=webkit",
  "test:report": "playwright show-report"
}
```

## 🤝 Contributing

When adding new tests:

1. Create methods in the page object for new interactions
2. Use descriptive test names
3. Organize tests with `test.describe()`
4. Capture screenshots for documentation
5. Add comments for complex logic

## ⚖️ License

This project is provided as-is for testing purposes.

## 📧 Support

For issues or questions:
1. Check the Playwright documentation
2. Review test output and error messages
3. Enable debug mode for detailed logs

---