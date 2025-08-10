import rimraf from "rimraf";
// This file is used to clean up the allure results directory before running tests
// It ensures that previous test results do not interfere with the current test run

async function globalSetup(): Promise<void> {
    await new Promise(resolve => {
        rimraf(`./allure-results`, resolve);
    });
}
export default globalSetup;