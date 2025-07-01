 Nordic Properties Testing Challenge

This project contains end-to-end automated tests written with [Playwright](https://playwright.dev/) for the Zoopla property platform.

## Project Structure

property-tests/
├── tests/
│ ├── pages/ # Page Object Model classes
│ ├── specs/ # Test files
│ └── fixtures/ # testData.json with inputs
├── playwright.config.ts # Playwright config
├── .github/workflows/ # GitHub Actions CI workflow
└── README.md



## What Is Covered

- **Property search** (by location, price, and property type)
- **Search results validation**
- **Property details page validation**
- **Contact form** fill and validation
- **Input error handling**

## 🚫 CAPTCHA Note

As part of this technical challenge, automated testing was required. However, **Zoopla uses CAPTCHA** protection when users interact via UI (e.g., clicking search or contact buttons).  
In **real-world testing environments**, CAPTCHA is **disabled or bypassed** in coordination with developers to allow for automation.

To work around CAPTCHA:
- I navigated directly to results or property pages using pre-built URLs.
- I avoided click-based flows that would trigger CAPTCHA.

Despite this, some tests may still **fail in CI** because CAPTCHA protection is active even on direct URLs.

How this is handled in production setups:

In real test environments (e.g., staging or testing environments), CAPTCHA is usually disabled for test users or test IP ranges, 
allowing automation scripts to interact with the app without interruption. This is typically done by developers or DevOps engineers.

##  Run Tests Locally

```bash
npm install
npx playwright test
To view the test report:
npx playwright show-report

 CI/CD with GitHub Actions

This project uses GitHub Actions to run tests automatically on:

Push to master

Pull requests to master

The CI workflow is located at .github/workflows/playwright.yml.
The HTML report is uploaded as an artifact after each run.

 Test Data
Test input values are managed in a central testData.json file for easy updates and reuse.

 Browsers
Tests run on:

Chromium (Chrome)

Firefox

WebKit (Safari)

Playwright handles all necessary browser installs.

👩‍💻 Author
Darija Čokić
QA Automation Engineer
