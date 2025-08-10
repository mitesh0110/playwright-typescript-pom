import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from "@lib/WebActions";
import { testConfig } from '../../testConfig';

let webActions: WebActions;

export class HomePage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly registerLink: Locator;
    readonly forgotLoginLink: Locator;
    readonly solutionsLink: Locator;
    readonly aboutUsLink: Locator;
    readonly servicesLink: Locator;
    readonly productsLink: Locator;
    readonly locationsLink: Locator;
    readonly adminPageLink: Locator;
    readonly contactUsNavigationButton: Locator;
    readonly aboutUsNavigationButton: Locator;
    readonly homeNavigationButton: Locator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        webActions = new WebActions(this.page, this.context);
        // Elements on the left side of the page
        this.usernameInput = page.locator('input.input[name="username"]');
        this.passwordInput = page.locator('input.input[name="password"]');
        this.loginButton = page.locator('input.button[type="submit"][value="Log In"]');
        this.forgotLoginLink = page.getByRole('link', { name: 'Forgot login info?' })
        this.registerLink = page.getByRole('link', { name: 'Register' })
        // Elements on the top-left navigation bar
        this.solutionsLink = page.locator('#headerPanel li.Solutions');
        this.aboutUsLink = page.locator('#headerPanel a[href="about.htm"]:has-text("About Us")');
        this.servicesLink = page.locator('#headerPanel a[href="services.htm"]');
        this.productsLink = page.locator('#headerPanel a[href="http://www.parasoft.com/jsp/products.jsp"]');
        this.locationsLink = page.locator('#headerPanel a[href="http://www.parasoft.com/jsp/pr/contacts.jsp"]');
        this.adminPageLink = page.locator('#headerPanel a[href="admin.htm"]');
        // Elements on the top-right navigation bar
        this.contactUsNavigationButton = page.locator('#headerPanel a[href="contact.htm"]:has-text("contact")');
        this.aboutUsNavigationButton = page.locator('#headerPanel a[href="about.htm"]:has-text("About Us")');
        this.homeNavigationButton = page.locator('#headerPanel a[href="index.htm"]:has-text("Home")');
    }

    async navigateToURL(): Promise<void> {
        await this.page.goto("/");
    }

    /**
     * Verifies that all global navigation menu links are visible and enabled on the home page.
     */
    async verifyGlobalNavigationMenu(): Promise<void> {
    const navLinks = [
        this.solutionsLink,
        this.aboutUsLink,
        this.servicesLink,
        this.productsLink,
        this.locationsLink,
        this.adminPageLink,
        this.contactUsNavigationButton,
        this.aboutUsNavigationButton,
        this.homeNavigationButton
    ];
    for (const link of navLinks) {
        await expect(link).toBeVisible();
        await expect(link).toBeEnabled();
    }

    }
    /**
     * Returns an array of Locators to be used by utilities for visibility checks.
     */
    get homePageElementsList(): Locator[] {
        return [
            this.usernameInput,
            this.passwordInput,
            this.loginButton,
            this.registerLink,
            this.forgotLoginLink,
            this.solutionsLink,
            this.aboutUsLink,
            this.servicesLink,
            this.productsLink,
            this.locationsLink,
            this.adminPageLink,
            this.contactUsNavigationButton,
            this.aboutUsNavigationButton,
            this.homeNavigationButton
        ];
    }
}