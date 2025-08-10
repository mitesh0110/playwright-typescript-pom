import { Logger } from '../../utils/Logger';

import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
const pageInfo = require('../../testdata/urls.json');

export class AssertionUtils {
    /**
     * Asserts that the given text is visible on the page.
     */
    static async assertTextVisible(page: Page, text: string): Promise<void> {
        try {
            await expect(page.getByText(text)).toBeVisible();
        } catch (error) {
            Logger.error(`Assertion failed: Text '${text}' is not visible on the page.`);
            throw new Error(`Assertion failed: Text '${text}' is not visible on the page.`);
        }
    }
    /**
     * Asserts that the given locator is visible on the page.
     */
    static async assertElementVisible(locator: Locator): Promise<void> {
        try {
            await expect(locator).toBeVisible();
        } catch (error) {
            Logger.error(`Assertion failed: Element is not visible on the page.`);
            throw new Error(`Assertion failed: Element is not visible on the page.`);
        }
    }

    /**
     * Asserts that the current page title and URL match the expected values from urls.json for the given pageKey.
     */
    static async assertPageTitleAndUrl(page: Page, pageKey: string): Promise<void> {
        const data = pageInfo[pageKey];
        const baseURL = pageInfo.baseURL;
        if (!data) {
            throw new Error(`No data found for page key: ${pageKey}`);
        }
        if (!data.title) {
            throw new Error(`No title found for page key: ${pageKey}`);
        }
        if (!data.path) {
            throw new Error(`No path found for page key: ${pageKey}`);
        }
        const expectedUrl = baseURL + data.path;
        try {
            await expect(page).toHaveTitle(data.title);
        } catch (error) {
            Logger.error(`Assertion failed: Page title does not match expected title '${data.title}' for pageKey '${pageKey}'.`);
            throw new Error(`Assertion failed: Page title does not match expected title '${data.title}' for pageKey '${pageKey}'.`);
        }
        try {
            await expect(page).toHaveURL(new RegExp(expectedUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        } catch (error) {
            Logger.error(`Assertion failed: Page URL does not match expected URL '${expectedUrl}' for pageKey '${pageKey}'.`);
            throw new Error(`Assertion failed: Page URL does not match expected URL '${expectedUrl}' for pageKey '${pageKey}'.`);
        }
    }

    /**
     * Asserts that the given text is not visible on the page.
     */
    static async assertTextNotVisible(page: Page, text: string): Promise<void> {
        try {
            await expect(page.getByText(text)).not.toBeVisible();
        } catch (error) {
            Logger.error(`Assertion failed: Text '${text}' is visible on the page, but it should not be.`);
            throw new Error(`Assertion failed: Text '${text}' is visible on the page, but it should not be.`);
        }
    }
    /**
     * Asserts that all Locators in the provided list are visible on the given page.
     * @param page Playwright Page instance
     * @param elements Array of Locator objects (e.g., from a page object's getter)
     */
    static async assertElementsVisibleOnThePage(elements: Locator[]): Promise<void> {
        for (let i = 0; i < elements.length; i++) {
            try {
                await expect(elements[i], `Element at index ${i} should be visible`).toBeVisible();
            } catch (error) {
                Logger.error(`Assertion failed: Element at index ${i} is not visible on the page.`);
                throw new Error(`Assertion failed: Element at index ${i} is not visible on the page.`);
            }
        }
    }
}
