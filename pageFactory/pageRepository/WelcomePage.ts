
import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from "@lib/WebActions";
import { testConfig } from '../../testConfig';

let webActions: WebActions;

export class WelcomePage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly logOutLink: Locator;

    // Account Services links
    readonly openNewAccountLink: Locator;
    readonly accountsOverviewLink: Locator;
    readonly transferFundsLink: Locator;
    readonly billPayLink: Locator;
    readonly findTransactionsLink: Locator;
    readonly updateContactInfoLink: Locator;
    readonly requestLoanLink: Locator;
    readonly successMessage: Locator;
    readonly accountServicesTitle: Locator;


    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        webActions = new WebActions(this.page, this.context);
        this.logOutLink = page.locator('a[href="logout.htm"]:has-text("Log Out")');

        // Account Services links in leftPanel
        this.accountServicesTitle = page.locator('h2:has-text("Account Services")');
        this.openNewAccountLink = page.locator('#leftPanel a[href="openaccount.htm"]:has-text("Open New Account")');
        this.accountsOverviewLink = page.locator('#leftPanel a[href="overview.htm"]:has-text("Accounts Overview")');
        this.transferFundsLink = page.locator('#leftPanel a[href="transfer.htm"]:has-text("Transfer Funds")');
        this.billPayLink = page.locator('#leftPanel a[href="billpay.htm"]:has-text("Bill Pay")');
        this.findTransactionsLink = page.locator('#leftPanel a[href="findtrans.htm"]:has-text("Find Transactions")');
        this.updateContactInfoLink = page.locator('#leftPanel a[href="updateprofile.htm"]:has-text("Update Contact Info")');
        this.requestLoanLink = page.locator('#leftPanel a[href="requestloan.htm"]:has-text("Request Loan")');

        // Success message after registration
        this.successMessage = page.locator('p:has-text("Your account was created successfully. You are now logged in.")');
    }
    /**
     * Returns an array of Locators to be used by utilities for visibility checks.
     */
    get welcomePageLinks(): Locator[] {
        return [
            this.openNewAccountLink,
            this.accountsOverviewLink,
            this.transferFundsLink,
            this.billPayLink,
            this.findTransactionsLink,
            this.updateContactInfoLink,
            this.requestLoanLink
        ];
    }

    /**
     * Returns an array of link texts matching the order of welcomePageElementsList, for use with verifyAndClickLinks.
     */
    get welcomePageLinkTexts(): string[] {
        return [
            'Open New Account',
            'Accounts Overview',
            'Transfer Funds',
            'Bill Pay',
            'Find Transactions',
            'Update Contact Info',
            'Request Loan'
        ];
    }   
}