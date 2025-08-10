// NOTE: If you want to run or debug this test using the VS Code UI buttons, change the import below to:
// import { test } from '@playwright/test';
// and adjust the test to use only standard Playwright fixtures.
// For custom fixtures (like BaseTest), run tests using the CLI: npx playwright test

import test from '@lib/BaseTest';
import { expect } from '@playwright/test';

import { generateRandomPayeeData, generateRandomRegistrationData } from '../../utils/functional/randomData';
import { testConfig } from '../../testConfig';
import { Logger } from '../../utils/Logger';


test(`Navigate to Para bank application and verify the details`, { tag: '@Smoke'}, async ({ homePage, registerPage, welcomePage, accountOverviewPage, 
    openNewAccountPage, transferFundsPage, billPayPage, apiActions, webActions, AssertionUtils, ApiAssertionUtils,
    request }) => {
    let createdUser;
    let originalBalance;
    let originalAccountNumber;
    let openedAccountNumber;
    let newAccountBalance;
    let minimumDeposit; // Minimum deposit amount for the new account
    const transferAmount = (Math.random() * 1000).toFixed(2);
    let billAmount;
    let payeeData;

    await test.step(`Navigate to Application`, async () => {
        await homePage.navigateToURL();
        // Assert Home page title
        await AssertionUtils.assertPageTitleAndUrl(homePage.page, 'Home');
        // Assert Home page elements are visible
        await AssertionUtils.assertElementsVisibleOnThePage(homePage.homePageElementsList);
    });

    await test.step('Create a new user from user registration page',  async () => {
        await homePage.registerLink.click();
        // Assert Register page title
        await AssertionUtils.assertPageTitleAndUrl(registerPage.page, 'Register');
        // Assert Register page elements are visible
        await AssertionUtils.assertElementsVisibleOnThePage(registerPage.registerPageElementsList);
        const randomData = generateRandomRegistrationData();
        await registerPage.fillRegistrationForm(randomData);
        createdUser = { username: randomData.username, password: randomData.password };
        await webActions.clickElement(registerPage.registerButton);
        // Assert the Welcome text is visible after registration for the created user
        await AssertionUtils.assertTextVisible(welcomePage.page, `Welcome ${randomData.username}`);
        // Assert Welcome page title and URL
        await AssertionUtils.assertPageTitleAndUrl(welcomePage.page, 'Welcome');
        // Assert Your account was created successfully after registration
        await AssertionUtils.assertElementVisible(welcomePage.successMessage);
        // Assert Welcome page links are visible
        await AssertionUtils.assertElementsVisibleOnThePage(welcomePage.welcomePageLinks);

        // Click on log out to login with the created user in the next step
        await webActions.clickElement(welcomePage.logOutLink);
    });

    await test.step('Login with the created user', async () => {
        await homePage.usernameInput.fill(createdUser.username);
        await homePage.passwordInput.fill(createdUser.password);
        await homePage.loginButton.click();
        // Assert Accounts Overview page title and URL
        await AssertionUtils.assertPageTitleAndUrl(accountOverviewPage.page, `Accounts Overview`);
        // Assert account table is visible
        await AssertionUtils.assertElementVisible(accountOverviewPage.accountTable);
        originalBalance = await webActions.getValueFromTableByColumn(accountOverviewPage.accountTable, 'Balance*');
        console.log(`Original balance: ${originalBalance}`);   
    });

    await test.step('Verify global navigation menu on Home page is working as expected', async () => {
        await homePage.verifyGlobalNavigationMenu();
        await webActions.verifyAndClickLinks(welcomePage.welcomePageLinks, welcomePage.welcomePageLinkTexts);
    });

    await test.step('Create a Savings account from “Open New Account Page” and capture the account number', async () => {
        await webActions.clickElement(welcomePage.openNewAccountLink);
        // Assert Open New Account page title
        await AssertionUtils.assertPageTitleAndUrl(openNewAccountPage.page, 'Open New Account');
        // Assert Open New Account title is visible
        await AssertionUtils.assertElementVisible(openNewAccountPage.openNewAccountTitle);

        await openNewAccountPage.accountTypeDropdown.waitFor({ state: 'visible' });
        await webActions.selectDropdown(openNewAccountPage.accountTypeDropdown, 1);
        originalAccountNumber = await webActions.getSelectedDropdownText(openNewAccountPage.accountNumberDropDown);
        minimumDeposit = parseFloat(await openNewAccountPage.getDepositAmount());
        Logger.info(`Selected account number: ${originalAccountNumber}`);
        await webActions.clickElement(openNewAccountPage.openNewAccountButton);
        // Assert 'Account Opened!' text is visible
        await AssertionUtils.assertTextVisible(accountOverviewPage.page, 'Account Opened!');
        // Assert Congratulations text on successful account opening
        await AssertionUtils.assertTextVisible(accountOverviewPage.page, 'Congratulations, your account is now open.');
        // Assert new account number is visible
        await AssertionUtils.assertElementVisible(openNewAccountPage.newAccountNumber);
        openedAccountNumber = await webActions.getText(openNewAccountPage.newAccountNumber);
        Logger.info(`New account number: ${openedAccountNumber}`);
    });

    await test.step('Validate if Accounts overview page is displaying the balance details as expected', async () => {
        // Get the balance for the newly created account using getValueFromTableByColumn
        await webActions.clickElement(welcomePage.accountsOverviewLink);
        // Assert Accounts Overview page title
        await AssertionUtils.assertPageTitleAndUrl(accountOverviewPage.page, 'Accounts Overview');
        // Assert account table is visible
        await AssertionUtils.assertElementVisible(accountOverviewPage.accountTable);     
        newAccountBalance = await webActions.getValueFromTableByColumn(accountOverviewPage.accountTable, 'Balance*', openedAccountNumber);
        console.log(`Balance for new account (${openedAccountNumber}): ${newAccountBalance}`);
        // Parse balances as numbers (remove $ and commas)
        const parseBalance = (balance: string) => parseFloat(balance.replace(/[^0-9.-]+/g, ''));
        const originalBalanceNum = parseBalance(originalBalance);
        newAccountBalance = parseBalance(newAccountBalance);
        // Assert new account balance equals minimum deposit
        expect(newAccountBalance).toBe(minimumDeposit);
        // Get the balance for the original account after transfer
        const updatedOriginalBalance = await webActions.getValueFromTableByColumn(accountOverviewPage.accountTable, 'Balance*', originalAccountNumber);
        const updatedOriginalBalanceNum = parseBalance(updatedOriginalBalance);
        // Assert original account balance is reduced by minimum deposit
        expect(updatedOriginalBalanceNum).toBe(originalBalanceNum - minimumDeposit);
    });

    await test.step('Transfer funds from account created in step 5 to another account', async () => {
        await webActions.clickElement(welcomePage.transferFundsLink);
        // Assert Transfer Funds page title
        await AssertionUtils.assertPageTitleAndUrl(transferFundsPage.page, 'Transfer Funds');
        // Assert Transfer Funds page elements are visible
        await AssertionUtils.assertElementsVisibleOnThePage(transferFundsPage.transferFundsPageElementsList);
        await webActions.fillText(transferFundsPage.amountInput, transferAmount.toString());
        await webActions.selectDropdown(transferFundsPage.fromAccountDropDown, openedAccountNumber);
        await webActions.selectDropdown(transferFundsPage.toAccountDropDown, originalAccountNumber);
        await webActions.clickElement(transferFundsPage.transferButton);
        // Assert transfer complete title is visible
        await AssertionUtils.assertElementVisible(transferFundsPage.transferCompleteTitle);
        // Assert transfer result message and values using locators from transferFundsPage
        const amountResult = await transferFundsPage.amountResult.innerText();
        const fromAccountIdResult = await transferFundsPage.fromAccountIdResult.innerText();
        const toAccountIdResult = await transferFundsPage.toAccountIdResult.innerText();
        // Remove $ if present and compare as fixed 2-decimal string
        const amountResultValue = amountResult.trim().replace('$', '');
        // Assert transfer amount matches expected value
        expect(amountResultValue).toBe(Number(transferAmount).toFixed(2));
        // Assert from account matches opened account
        expect(fromAccountIdResult.trim()).toBe(openedAccountNumber.trim());
        // Assert to account matches original account
        expect(toAccountIdResult.trim()).toBe(originalAccountNumber.trim());
    });

    await test.step('Pay the bill with account created in step 5', async () => {
        // Get the balance for the newly created account after transfer
        await webActions.clickElement(welcomePage.billPayLink);
        // Assert Bill Pay page title
        await AssertionUtils.assertPageTitleAndUrl(billPayPage.page, 'Bill Pay');
        // Assert Bill Pay service title is visible
        await AssertionUtils.assertElementVisible(billPayPage.billPayServiceTitle);
        payeeData = generateRandomPayeeData();
        billAmount = payeeData.amount;
        await billPayPage.fillBillPayForm({ ...payeeData, fromAccountNumber: openedAccountNumber });
        await webActions.clickElement(billPayPage.sendPaymentButton);
        console.log(`Bill payment amount used: ${billAmount}`);
        await billPayPage.billPaymentCompleteMessage.waitFor({ state: 'visible' })
        // Assert bill payment complete message is visible
        await AssertionUtils.assertElementVisible(billPayPage.billPaymentCompleteMessage);
        // Assert displayed payee name matches the payee data
        expect(await billPayPage.displayedPayeeName.innerText()).toBe(payeeData.payeeName);
        // Assert paid bill amount matches the expected amount
        expect(await billPayPage.paidBillAmount.innerText()).toBe(`$${billAmount}`);
        // Assert the from account number matches the opened account
        expect(await billPayPage.fromAccountIdResult.innerText()).toBe(openedAccountNumber.trim());
    });

    await test.step('Search the transactions using “Find transactions” API call by amount for the payment transactions made in Step 8.', async () => {
        const baseUrl = testConfig.qaApi; 
        const accountId = openedAccountNumber; 
        const amount = billAmount; 
        const timeout = 30000;
        const url = `${baseUrl}services_proxy/bank/accounts/${accountId}/transactions/amount/${amount}?timeout=${timeout}`;

        await test.step('Send API request and validate response', async () => {
            Logger.info(`Requesting: ${url}`);
            const response = await apiActions.sendGetRequest(request, url, {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${createdUser.username}:${createdUser.password}`).toString('base64')
                }
            });
            // Assert API response status is 200
            await ApiAssertionUtils.verify200StatusCode(response);
            Logger.info(`Response status: ${response.status()}`);
            const responseBody = await response.text();
            Logger.info('response body: ' + responseBody);
            const transactions = JSON.parse(responseBody);
            // Assert API response contains expected transaction details
            await ApiAssertionUtils.verifyResponseContents(
                transactions,
                {
                    accountId: openedAccountNumber,
                    amount: Number(billAmount),
                    type: 'Debit',
                    description: 'Bill Payment to ' + payeeData.payeeName,
                },
            );
            Logger.info('Validated Find transactions API response: ' + JSON.stringify(transactions));
        });
    });

});
