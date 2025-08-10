
import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from "@lib/WebActions";
import { testConfig } from '../../testConfig';

let webActions: WebActions;

export class AccountOverviewPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly logOutLink: Locator;

    // Account Services links
    readonly accountsOverviewTitle: Locator;
    readonly accountTable: Locator;
    readonly transferFundsLink: Locator;
    readonly billPayLink: Locator;
    readonly findTransactionsLink: Locator;
    readonly updateContactInfoLink: Locator;
    readonly requestLoanLink: Locator;


    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        webActions = new WebActions(this.page, this.context);
        // Elements on the left side of the page
        this.logOutLink = page.locator('a[href="logout.htm"]:has-text("Log Out")');

        // Page title
        this.accountsOverviewTitle = page.locator('h1.title:has-text("Accounts Overview")');
        // Account table
        this.accountTable = page.locator('table#accountTable');



    }

   
}