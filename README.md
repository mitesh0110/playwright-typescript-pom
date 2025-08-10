## Playwright TypeScript Framework

This project is an end-to-end testing framework using [Playwright](https://playwright.dev/) with TypeScript, Allure reporting, and multi-browser support for Parasoft Banking application website.

## Framework Overview
This framework follows best practices such as:

Page Object Model (POM): Organizes UI tests with maintainable page classes under pageFactory/.

Reusable Libraries: Common utilities for web and API interactions reside in lib/ and utils/, enabling code reuse and reducing duplication.

Multi-Browser Testing: Supports testing on Chromium, Firefox, WebKit, and Edge using Playwright’s multi-project configuration.

Comprehensive Reporting: Supports Playwright’s built-in HTML reports as well as Allure reports for rich test execution insights.

Configurable Environments: Supports environment-based test execution with config switching (e.g., QA, Dev).

CI/CD testing: Supports execution of CI/CD pipeline via Jenkins and GitHub Webhooks. 

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or above recommended)
- Java (8 or above - for allure reports)
- Playwright browsers installed (npx playwright install)
- Allure Commandline CLI installed globally for reporting:
```powershell
npm install -g allure-commandline --save-dev
```

### Setup Instructions

1. **Clone the repository**
	```powershell
	git clone https://github.com/mitesh0110/playwright-typescript-fabric.git
	cd playwright-typescript-framework
	```

2. **Install dependencies**
	```powershell
	npm install
	```

3. **Install Playwright browsers**
	```powershell
	npx playwright install
	```

### Running Tests

**Run all tests:**
```powershell
npx playwright test
```

**Run a specific test file:**
```powershell
npx playwright test tests/functional/E2ETestScenario.test.ts
```

**Run tests for a specific project (browser):**
```powershell
npx playwright test --project=Edge
```

### Test Reports

- **HTML Report:**
  ```powershell
  npx playwright show-report
  ```
  The report will open in your browser. Output is in the `html-report/` folder.

- **Allure Report:**
  1. Generate Allure results (after running tests):
	  ```powershell
	  npx allure generate allure-results --clean -o allure-report
	  ```
  2. Open the Allure report:
	  ```powershell
	  npx allure open allure-report
	  ```

### Environment Configuration

You can specify the environment (e.g., `qa`, `dev`, etc.) using npm config:
```powershell
npx playwright test --ENV=qa
```
Default is `qa` if not specified.

### Project Structure

- tests/               ------------ # Test cases organized by feature
- lib/                 ------------ # Reusable common libraries for UI & API interactions
- pageFactory/         ------------ # Page Object Model classes
- utils/               ------------ # Common assertions and verification utilities
- testdata/            ------------ # Test data files
- allure-report/       ------------ # Generated Allure report output folder
- playwright-report/   ------------ # Playwright built-in HTML report folder
- package.json
- playwright.config.ts ------------ # Playwright configuration file
- Jenkinsfile          ------------ # To run tests using CI/CD pipeline via Jenkins 

### Troubleshooting

- If you encounter browser-related errors, re-run `npx playwright install`.
- For Allure reporting, ensure Allure CLI is installed globally:
  ```powershell
  npm install -g allure-commandline --save-dev
  ```
- Clear and reinstall node modules if dependencies fail:
```powershell
rm -rf node_modules package-lock.json
npm install
```
