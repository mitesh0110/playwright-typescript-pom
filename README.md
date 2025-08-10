## Playwright TypeScript Framework

This project is an end-to-end testing framework using [Playwright](https://playwright.dev/) with TypeScript, Allure reporting, and multi-browser support.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or above recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Setup Instructions

1. **Clone the repository**
	```powershell
	git clone <repository-url>
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

- `tests/` - Test cases
- `lib/` - Common interactions for Web elements and API
- `pageFactory/` - Page Object Model classes
- `utils` - Commons assertions and verification libraries for Web and API
- `testdata/` - Test data files
- `allure-report/`, `html-report/` - Test reports


### Troubleshooting

- If you encounter browser-related errors, re-run `npx playwright install`.
- For Allure reporting, ensure Allure CLI is installed globally:
  ```powershell
  npm install -g allure-commandline --save-dev
  ```

---
For more details, refer to the Playwright [documentation](https://playwright.dev/).
