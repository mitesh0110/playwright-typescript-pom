
import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from "@lib/WebActions";
import { testConfig } from '../../testConfig';

let webActions: WebActions;

export class OpenNewAccountPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly logOutLink: Locator;

    // Account Services links
    readonly openNewAccountTitle: Locator;
    readonly accountTypeDropdown: Locator;
    readonly accountNumberDropDown: Locator;
    readonly openNewAccountButton: Locator;
    readonly newAccountNumber: Locator;
    readonly depositMessage: Locator;


    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        webActions = new WebActions(this.page, this.context);
        // Elements on the left side of the page
        this.logOutLink = page.locator('a[href="logout.htm"]:has-text("Log Out")');

        // Page title
        this.openNewAccountTitle = page.locator('h1.title:has-text("Open New Account")');
        // Account type dropdown
        this.accountTypeDropdown = page.locator('select#type.input');

        // Account number dropdown
        this.accountNumberDropDown = page.locator('select#fromAccountId.input');

        // Open New Account button
        this.openNewAccountButton = page.locator('input.button[type="button"][value="Open New Account"]');

        this.newAccountNumber = page.locator('a#newAccountId');

        this.depositMessage = page.locator('#openAccountForm b', { hasText: /\$\d{1,3}(,\d{3})*\.\d{2}/ })


    }

    /**
     * Returns the minimum deposit amount from the deposit message when selecting a new account.
     */
    async getDepositAmount(): Promise<string> {
        const messageText: string | null = await this.depositMessage.textContent();

        if (messageText) {
            const amountMatch = messageText.match(/\$([\d,]+\.\d{2})/);
            if (amountMatch && amountMatch[1]) {
                return amountMatch[1]; // "100.00"
            }
        }
        throw new Error('Deposit amount not found');
    }

   
}