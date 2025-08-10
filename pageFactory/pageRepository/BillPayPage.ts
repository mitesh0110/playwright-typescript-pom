
import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from "@lib/WebActions";
import { testConfig } from '../../testConfig';

let webActions: WebActions;

export class BillPayPage {

    
    readonly billPayServiceTitle: Locator;
    readonly payeeNameInput: Locator;
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly page: Page;
    readonly context: BrowserContext;
    readonly stateInput: Locator;

    // Account Services links
    readonly zipCodeInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly accountNumberInput: Locator;
    readonly verifyAccountNumberInput: Locator;
    readonly amountInput: Locator;
    readonly fromAccountDropDown: Locator;
    readonly sendPaymentButton: Locator;

    // Elements in Bill Pay success message
    readonly billPaymentCompleteMessage: Locator;
    readonly displayedPayeeName: Locator;
    readonly paidBillAmount: Locator;
    readonly fromAccountIdResult: Locator;


    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        webActions = new WebActions(this.page, this.context);
        // Bill Pay form fields
        this.billPayServiceTitle = page.locator('h1.title:has-text("Bill Payment Service")');
        this.payeeNameInput = page.locator('input[name="payee.name"]');
        this.addressInput = page.locator('input[name="payee.address.street"]');
        this.cityInput = page.locator('input[name="payee.address.city"]');
        this.stateInput = page.locator('input[name="payee.address.state"]');
        this.zipCodeInput = page.locator('input[name="payee.address.zipCode"]');
        this.phoneNumberInput = page.locator('input[name="payee.phoneNumber"]');
        this.accountNumberInput = page.locator('input[name="payee.accountNumber"]');
        this.verifyAccountNumberInput = page.locator('input[name="verifyAccount"]');
        this.amountInput = page.locator('input[name="amount"]');
        this.fromAccountDropDown = page.locator('select[name="fromAccountId"]');
        this.sendPaymentButton = page.locator('input[type="button"][value="Send Payment"]');
        // Elements in Bill Pay success message
        this.billPaymentCompleteMessage = page.locator('h1.title:has-text("Bill Payment Complete")');
        this.displayedPayeeName = page.locator('span[id="payeeName"]');
        this.paidBillAmount = page.locator('span[id="amount"]');
        this.fromAccountIdResult = page.locator('span[id="fromAccountId"]');
    }
    /**
     * Fills the Bill Pay form with the provided data object.
     * @param data An object with keys matching the bill pay fields
     */
    async fillBillPayForm(data: {
        payeeName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        phoneNumber: string;
        accountNumber: string;
        verifyAccountNumber: string;
        amount: string;
        fromAccountNumber?: string;
    }) {
        await this.payeeNameInput.fill(data.payeeName);
        await this.addressInput.fill(data.address);
        await this.cityInput.fill(data.city);
        await this.stateInput.fill(data.state);
        await this.zipCodeInput.fill(data.zipCode);
        await this.phoneNumberInput.fill(data.phoneNumber);
        await this.accountNumberInput.fill(data.accountNumber);
        await this.verifyAccountNumberInput.fill(data.verifyAccountNumber);
        await this.amountInput.fill(data.amount);
        if (data.fromAccountNumber) {
            await this.fromAccountDropDown.selectOption({ label: data.fromAccountNumber });
        }
    }
   
}