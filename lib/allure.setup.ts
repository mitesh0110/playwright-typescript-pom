import { test as base } from '@playwright/test';
import { allure } from 'allure-playwright';

export const test = base;

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshot = await page.screenshot();
    allure.attachment('Screenshot', screenshot, 'image/png');
  }
});
