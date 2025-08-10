import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from "@lib/WebActions";
import { testConfig } from '../../testConfig';

let webActions: WebActions;

export class TransferFundsPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly transferFundsTitle: Locator;
    readonly amountInput: Locator;
    readonly fromAccountDropDown: Locator;
    readonly toAccountDropDown: Locator;
    readonly transferButton: Locator;
    readonly transferCompleteTitle: Locator;
    readonly amountResult: Locator;
    readonly fromAccountIdResult: Locator;
    readonly toAccountIdResult: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        webActions = new WebActions(this.page, this.context);
        // Elements on the left side of the page
        this.amountInput = page.locator('#amount');
        this.fromAccountDropDown = page.locator('select[id="fromAccountId"]');
        this.toAccountDropDown = page.locator('select[id="toAccountId"]');
        this.transferButton = page.locator('input[type="submit"][value="Transfer"]');
        this.transferFundsTitle = page.locator('h1.title:has-text("Transfer Funds")');
        // Transfer result locators
        this.transferCompleteTitle = page.locator('h1.title:has-text("Transfer Complete!")');
        this.amountResult = page.locator('#amountResult');
        this.fromAccountIdResult = page.locator('#fromAccountIdResult');
        this.toAccountIdResult = page.locator('#toAccountIdResult');
    }

    /**
     * Returns an array of Locators to be used by utilities for visibility checks.
     */
    get transferFundsPageElementsList(): Locator[] {
        return [
            this.transferFundsTitle,
            this.amountInput,
            this.fromAccountDropDown,
            this.toAccountDropDown,
            this.transferButton
        ];
    }  
}