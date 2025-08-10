
import fs from 'fs';
import * as CryptoJS from 'crypto-js';
import type { Page } from '@playwright/test';
import { BrowserContext, expect, Locator } from '@playwright/test';
import { Workbook } from 'exceljs';
import { testConfig } from '../testConfig';
import * as pdfjslib from 'pdfjs-dist-es5';
import pageInfo from '../testdata/urls.json';


import { Logger } from '../utils/Logger';

export class WebActions {

    /**
     * Checks a list of Locators (from a page object) and a list of page keys (link texts), clicks each, and asserts the URL.
     * @param locators Array of Playwright Locator objects (in the same order as link texts)
     * @param linkTexts Array of link texts (must match keys in urls.json, same order as locators)
     */
    async verifyAndClickLinks(locators: Locator[], linkTexts: string[]): Promise<void> {
        const baseURL = pageInfo.baseURL;
        if (locators.length !== linkTexts.length) {
            Logger.error('Locators and linkTexts arrays must be the same length');
            throw new Error('Locators and linkTexts arrays must be the same length');
        }
        for (let i = 0; i < locators.length; i++) {
            const locator = locators[i];
            const text = linkTexts[i];
            try {
                Logger.info(`Clicking on link: '${text}'`);
                await expect(locator).toBeVisible();
                await expect(locator).toBeEnabled();
                await locator.click();
                const pageData = pageInfo[text];
                if (!pageData || !pageData.path) {
                    Logger.error('Assertion failed: No path found in urls.json for pageKey.');
                    throw new Error('Assertion failed: No path found in urls.json for pageKey.');
                }
                const expectedUrl = baseURL + pageData.path;
                await expect(this.page).toHaveURL(new RegExp(expectedUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
            } catch (error: any) {
                Logger.error('Assertion failed: Could not click and verify link.');
                throw new Error('Assertion failed: Could not click and verify link.');
            }
        }
    }

    /**
     * Fills text into an input field (by Locator or string selector).
     * @param element Locator or string selector for the input field
     * @param text The text to fill
     */
    async fillText(element: Locator | string, text: string): Promise<void> {
        let locator: Locator;
        if (typeof element === 'string') {
            locator = this.page.locator(element);
        } else {
            locator = element;
        }
        try {
            Logger.info(`Entering text '${text}' into element`);
            await locator.fill(text);
        } catch (error: any) {
            Logger.error('Assertion failed: Could not fill text into element.');
            throw new Error('Assertion failed: Could not fill text into element.');
        }
    }

    /**
     * Gets the value from a table for a given column name and (optionally) account number.
     * @param table Locator or string selector for the table
     * @param columnName The column header text (e.g., 'Balance*')
     * @param accountNumber (Optional) The account number to match in the first column
     * @returns The value from the specified column in the row matching the account number, or first row if not provided
     */
    async getValueFromTableByColumn(table: Locator | string, columnName: string, accountNumber?: string): Promise<string> {
        let locator: Locator;
        if (typeof table === 'string') {
            locator = this.page.locator(table);
        } else {
            locator = table;
        }
        try {
            Logger.info(`Getting value from table for column '${columnName}'${accountNumber ? ` and account '${accountNumber}'` : ''}`);
            await locator.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 5000 });
            const headers = await locator.locator('thead tr th').allInnerTexts();
            const colIndex = headers.findIndex(h => h.trim() === columnName.trim());
            if (colIndex === -1) throw new Error('Assertion failed: Column not found in table headers.');
            const rows = await locator.locator('tbody tr').all();
            if (!rows.length) throw new Error('Assertion failed: No rows found in table.');
            let targetRow = rows[0];
            if (accountNumber) {
                const found = await Promise.all(rows.map(async row => {
                    const firstCell = await row.locator('td').first().innerText();
                    return firstCell.includes(accountNumber);
                }));
                const idx = found.findIndex(Boolean);
                if (idx === -1) throw new Error('Assertion failed: Account number not found in table.');
                targetRow = rows[idx];
            }
            const cellLocator = targetRow.locator('td').nth(colIndex);
            await cellLocator.waitFor({ state: 'visible', timeout: 5000 });
            return cellLocator.innerText();
        } catch (error: any) {
            Logger.error('Assertion failed: Could not get value from table.');
            throw new Error('Assertion failed: Could not get value from table.');
        }
    }

    /**
     * Gets the text content from an element (by Locator or string selector).
     * @param element Locator or string selector
     * @returns The text content of the element
     */
    async getText(element: Locator | string): Promise<string> {
        let locator: Locator;
        if (typeof element === 'string') {
            locator = this.page.locator(element);
        } else {
            locator = element;
        }
        try {
            Logger.info('Getting text from element');
            return await locator.innerText();
        } catch (error: any) {
            Logger.error('Assertion failed: Could not get text from element.');
            throw new Error('Assertion failed: Could not get text from element.');
        }
    }

    /**
     * Gets the selected option's text from a dropdown (by Locator or string selector).
     * @param dropdown Locator or string selector for the dropdown
     * @returns The text of the selected option
     */
    async getSelectedDropdownText(dropdown: Locator | string): Promise<string> {
        let locator: Locator;
        if (typeof dropdown === 'string') {
            locator = this.page.locator(dropdown);
        } else {
            locator = dropdown;
        }
        try {
            Logger.info('Getting selected dropdown text');
            return await locator.locator('option:checked').innerText();
        } catch (error: any) {
            Logger.error('Assertion failed: Could not get selected dropdown text.');
            throw new Error('Assertion failed: Could not get selected dropdown text.');
        }
    }

    

    /**
     * Gets the selected value of a dropdown (by Locator or string selector).
     * @param dropdown Locator or string selector for the dropdown
     * @returns The value of the selected option
     */
    async getSelectedDropdownValue(dropdown: Locator | string): Promise<string | null> {
        let locator: Locator;
        if (typeof dropdown === 'string') {
            locator = this.page.locator(dropdown);
        } else {
            locator = dropdown;
        }
        try {
            Logger.info('Getting selected dropdown value');
            return await locator.inputValue();
        } catch (error: any) {
            Logger.error('Assertion failed: Could not get selected dropdown value.');
            throw new Error('Assertion failed: Could not get selected dropdown value.');
        }
    }

    /**
     * Selects a value from a dropdown (by visible text, value, or index).
     * @param dropdown Locator or string selector for the dropdown
     * @param option Option to select (string for value/text, or number for index)
     */
    async selectDropdown(dropdown: Locator | string, option: string | number): Promise<void> {
        let locator: Locator;
        if (typeof dropdown === 'string') {
            locator = this.page.locator(dropdown);
        } else {
            locator = dropdown;
        }
        try {
            Logger.info(`Selecting option '${option}' from dropdown`);
            if (typeof option === 'number') {
                const options = await locator.locator('option').all();
                if (option < 0 || option >= options.length) throw new Error('Dropdown index out of range');
                const value = await options[option].getAttribute('value');
                await locator.selectOption(value!);
            } else {
                // Try by value first, then by label/text
                await locator.selectOption({ value: option }).catch(async () => {
                    await locator.selectOption({ label: option });
                });
            }
        } catch (error: any) {
            Logger.error('Assertion failed: Could not select option from dropdown.');
            throw new Error('Assertion failed: Could not select option from dropdown.');
        }
    }

    /**
     * Clicks an element by Playwright Locator or string selector.
     * @param element Locator or string selector
     */
    async clickElement(element: Locator | string): Promise<void> {
        try {
            Logger.info('Clicking on element');
            if (typeof element === 'string') {
                await this.page.locator(element).click();
            } else {
                await element.click();
            }
        } catch (error: any) {
            Logger.error('Assertion failed: Could not click on element.');
            throw new Error('Assertion failed: Could not click on element.');
        }
    }
    readonly page: Page;
    readonly context: BrowserContext;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
    }


    /**
     * Delays execution for a specified time in milliseconds.
     * @param time Time in milliseconds
     */
    async delay(time: number): Promise<void> {
        try {
            await new Promise(function (resolve) {
                setTimeout(resolve, time);
            });
        } catch (error: any) {
            Logger.error('Assertion failed: Could not delay execution.');
            throw new Error('Assertion failed: Could not delay execution.');
        }
    }

    /**
     * Clicks an element by its exact text content.
     * @param text The exact text of the element to click
     */
    async clickByText(text: string): Promise<void> {
        try {
            Logger.info(`Clicking on element with text '${text}'`);
            await this.page.getByText(text, { exact: true }).click();
        } catch (error: any) {
            Logger.error('Assertion failed: Could not click on element by text.');
            throw new Error('Assertion failed: Could not click on element by text.');
        }
    }

    /**
     * Asserts the page title and URL for a given page key from urls.json.
     * @param pageKey The key in urls.json for the page
     */
    async assertPageTitleAndUrl(pageKey: string) {
        try {
            Logger.info(`Asserting page title and URL for pageKey '${pageKey}'`);
            const data = pageInfo[pageKey];
            if (!data) {
                Logger.error('Assertion failed: No data found for page key.');
                throw new Error('Assertion failed: No data found for page key.');
            }
            if (!data.title) {
                Logger.error('Assertion failed: No title found for page key.');
                throw new Error('Assertion failed: No title found for page key.');
            }
            if (!data.url) {
                Logger.error('Assertion failed: No URL found for page key.');
                throw new Error('Assertion failed: No URL found for page key.');
            }
            await expect(this.page).toHaveTitle(data.title);
            await expect(this.page).toHaveURL(new RegExp(data.url));
        } catch (error: any) {
            Logger.error('Assertion failed: Could not assert page title and URL.');
            throw new Error('Assertion failed: Could not assert page title and URL.');
        }
    }

    /**
     * Clicks an element using JavaScript by selector string.
     * @param locator The selector string for the element
     */
    async clickElementJS(locator: string): Promise<void> {
        try {
            Logger.info(`Clicking on element using JS: '${locator}'`);
            await this.page.$eval(locator, (element: HTMLElement) => element.click());
        } catch (error: any) {
            Logger.error('Assertion failed: Could not click on element using JS.');
            throw new Error('Assertion failed: Could not click on element using JS.');
        }
    }

    /**
     * Reads data from an Excel file at the specified sheet, row, and cell.
     * @param fileName Name of the Excel file
     * @param sheetName Name of the sheet
     * @param rowNum Row number
     * @param cellNum Cell number
     * @returns The cell value as a string
     */
    async readDataFromExcel(fileName: string, sheetName: string, rowNum: number, cellNum: number): Promise<string> {
        try {
            const workbook = new Workbook();
            await workbook.xlsx.readFile(`./Downloads/${fileName}`);
            const sheet = workbook.getWorksheet(sheetName);
            return sheet.getRow(rowNum).getCell(cellNum).toString();
        } catch (error: any) {
            Logger.error('Assertion failed: Could not read data from Excel file.');
            throw new Error('Assertion failed: Could not read data from Excel file.');
        }
    }

    /**
     * Reads all values from a text file.
     * @param filePath Path to the text file
     * @returns The file contents as a string
     */
    async readValuesFromTextFile(filePath: string): Promise<string> {
        try {
            return fs.readFileSync(`${filePath}`, `utf-8`);
        } catch (error: any) {
            Logger.error('Assertion failed: Could not read values from text file.');
            throw new Error('Assertion failed: Could not read values from text file.');
        }
    }

    /**
     * Writes data into a text file.
     * @param filePath Path to the text file
     * @param data Data to write
     */
    async writeDataIntoTextFile(filePath: number | fs.PathLike, data: string | NodeJS.ArrayBufferView): Promise<void> {
        try {
            fs.writeFile(filePath, data, (error) => {
                if (error) {
                    Logger.error('Assertion failed: Could not write data into text file.');
                    throw new Error('Assertion failed: Could not write data into text file.');
                }
            });
        } catch (error: any) {
            Logger.error('Assertion failed: Could not write data into text file.');
            throw new Error('Assertion failed: Could not write data into text file.');
        }
    }

    /**
     * Gets the text content from a specific page of a PDF document.
     * @param pdf The PDF document object
     * @param pageNo The page number to extract text from
     * @returns The text content of the page
     */
    async getPdfPageText(pdf: any, pageNo: number) {
        try {
            const page = await pdf.getPage(pageNo);
            const tokenizedText = await page.getTextContent();
            const pageText = tokenizedText.items.map((token: any) => token.str).join('');
            return pageText;
        } catch (error: any) {
            Logger.error('Assertion failed: Could not get PDF page text.');
            throw new Error('Assertion failed: Could not get PDF page text.');
        }
    }

    /**
     * Gets the combined text content from all pages of a PDF document.
     * @param filePath Path to the PDF file
     * @returns The combined text content of the PDF
     */
    async getPDFText(filePath: any): Promise<string> {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const pdf = await pdfjslib.getDocument(dataBuffer).promise;
            const maxPages = pdf.numPages;
            const pageTextPromises = [];
            for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
                pageTextPromises.push(this.getPdfPageText(pdf, pageNo));
            }
            const pageTexts = await Promise.all(pageTextPromises);
            return pageTexts.join(' ');
        } catch (error: any) {
            Logger.error('Assertion failed: Could not get PDF text.');
            throw new Error('Assertion failed: Could not get PDF text.');
        }
    }
}