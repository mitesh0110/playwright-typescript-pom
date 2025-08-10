

import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from "@lib/WebActions";
import { testConfig } from '../../testConfig';

let webActions: WebActions;

export class RegisterPage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipCodeInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly SSNInput: Locator;
    readonly UsernameInput: Locator;
    readonly PasswordInput: Locator;
    readonly ConfirmPasswordInput: Locator;
    readonly registerButton: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        webActions = new WebActions(this.page, this.context);
        // Elements on the left side of the page
        this.firstNameInput = page.locator('[name="customer.firstName"]');
        this.lastNameInput = page.locator('[name="customer.lastName"]');
        this.addressInput = page.locator('[name="customer.address.street"]');
        this.cityInput = page.locator('[name="customer.address.city"]');
        this.stateInput = page.locator('[name="customer.address.state"]');
        this.zipCodeInput = page.locator('[name="customer.address.zipCode"]');
        // Elements on the top-left navigation bar
        this.phoneNumberInput = page.locator('[name="customer.phoneNumber"]');
        this.SSNInput = page.locator('[name="customer.ssn"]');
        this.UsernameInput = page.locator('[name="customer.username"]');
        this.PasswordInput = page.locator('[name="customer.password"]');
        this.ConfirmPasswordInput = page.locator('[name="repeatedPassword"]');
        this.registerButton = page.locator('input[type="submit"][value="Register"]');

    }

    /**
     * Fills the registration form with the provided data.
     */
    async fillRegistrationForm(data: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        phoneNumber: string;
        ssn: string;
        username: string;
        password: string;
        confirmPassword: string;
    }): Promise<void> {
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.addressInput.fill(data.address);
        await this.cityInput.fill(data.city);
        await this.stateInput.fill(data.state);
        await this.zipCodeInput.fill(data.zipCode);
        await this.phoneNumberInput.fill(data.phoneNumber);
        await this.SSNInput.fill(data.ssn);
        await this.UsernameInput.fill(data.username);
        await this.PasswordInput.fill(data.password);
        await this.ConfirmPasswordInput.fill(data.confirmPassword);
    }

    /**
     * Clicks the register button, with JS fallback if normal click fails.
     */
    async clickRegisterButton(): Promise<void> {
        try {
            await this.registerButton.click();
        } catch (e) {
            console.warn('Normal click failed, trying JS click:', e);
            await this.page.evaluate(el => (el as HTMLElement).click(), await this.registerButton.elementHandle());
        }
    }
    
    /**
     * Returns an array of Locators to be used by utilities for visibility checks.
     */
    get registerPageElementsList(): Locator[] {
        return [
            this.firstNameInput,
            this.lastNameInput,
            this.addressInput,
            this.cityInput,
            this.stateInput,
            this.zipCodeInput,
            this.phoneNumberInput,
            this.SSNInput,
            this.UsernameInput,
            this.PasswordInput,
            this.ConfirmPasswordInput,
            this.registerButton
        ];
    }


}