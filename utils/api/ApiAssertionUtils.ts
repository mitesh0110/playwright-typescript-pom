import fs from 'fs';
import { APIResponse, expect } from '@playwright/test';
import { Logger } from '../../utils/Logger';

export class ApiAssertionUtils   {
    static async verify201StatusCode(response: APIResponse): Promise<void> {
        const actualStatus = response.status();
        const expectedStatus = 201;
        if (actualStatus !== expectedStatus) {
            throw new Error(`Expected status code 201 (Created) but got ${actualStatus} for URL: ${response.url()}`);
        }
        Logger.info(`Status code 201 (Created) verified for URL: ${response.url()}`);
    }

    static async verify204StatusCode(response: APIResponse): Promise<void> {
        const actualStatus = response.status();
        const expectedStatus = 204;
        if (actualStatus !== expectedStatus) {
            throw new Error(`Expected status code 204 (No Content) but got ${actualStatus} for URL: ${response.url()}`);
        }
        Logger.info(`Status code 204 (No Content) verified for URL: ${response.url()}`);
    }

    static async verify400StatusCode(response: APIResponse): Promise<void> {
        const actualStatus = response.status();
        const expectedStatus = 400;
        if (actualStatus !== expectedStatus) {
            throw new Error(`Expected status code 400 (Bad Request) but got ${actualStatus} for URL: ${response.url()}`);
        }
        Logger.info(`Status code 400 (Bad Request) verified for URL: ${response.url()}`);
    }

    static async verify401StatusCode(response: APIResponse): Promise<void> {
        const actualStatus = response.status();
        const expectedStatus = 401;
        if (actualStatus !== expectedStatus) {
            throw new Error(`Expected status code 401 (Unauthorized) but got ${actualStatus} for URL: ${response.url()}`);
        }
        Logger.info(`Status code 401 (Unauthorized) verified for URL: ${response.url()}`);
    }

    static async verify403StatusCode(response: APIResponse): Promise<void> {
        const actualStatus = response.status();
        const expectedStatus = 403;
        if (actualStatus !== expectedStatus) {
            throw new Error(`Expected status code 403 (Forbidden) but got ${actualStatus} for URL: ${response.url()}`);
        }
        Logger.info(`Status code 403 (Forbidden) verified for URL: ${response.url()}`);
    }

    static async verify404StatusCode(response: APIResponse): Promise<void> {
        const actualStatus = response.status();
        const expectedStatus = 404;
        if (actualStatus !== expectedStatus) {
            throw new Error(`Expected status code 404 (Not Found) but got ${actualStatus} for URL: ${response.url()}`);
        }
        Logger.info(`Status code 404 (Not Found) verified for URL: ${response.url()}`);
    }

    static async verify500StatusCode(response: APIResponse): Promise<void> {
        const actualStatus = response.status();
        const expectedStatus = 500;
        if (actualStatus !== expectedStatus) {
            throw new Error(`Expected status code 500 (Internal Server Error) but got ${actualStatus} for URL: ${response.url()}`);
        }
        Logger.info(`Status code 500 (Internal Server Error) verified for URL: ${response.url()}`);
    }

    static async verify200StatusCode(response: APIResponse): Promise<void> {
        const actualStatus = response.status();
        const expectedStatus = 200;
        if (actualStatus !== expectedStatus) {
            throw new Error(`Expected status code 200 (OK) but got ${actualStatus} for URL: ${response.url()}`);
        }
        Logger.info(`Status code 200 (OK) verified for URL: ${response.url()}`);
    }

    static async verifyResponseBody(expectedResponseBodyParams: string, responsePart: JSON, responseType: string): Promise<void> {
        let status = true;
        let fieldNames = `Parameter`;
        const headers = expectedResponseBodyParams.split("|");
        const responseToString = JSON.stringify(responsePart).trim();
        for (let headerKey of headers) {
            if (!(responseToString.includes(headerKey.trim()))) {
                status = false;
                fieldNames = fieldNames + `, ` + headerKey;
                break;
            }
        }
        expect(status, `${fieldNames} was not present in ${responseType}`).toBe(true);
        if (status) {
            Logger.info(`All expected response body parameters [${expectedResponseBodyParams}] found in ${responseType}`);
        }
    }

    static async verifyResponseHeader(expectedResponseHeaderParams: string, responsePart: Array<{ name: string, value: string }>, responseType: string): Promise<void> {
        let status = true;
        let fieldNames = `Parameter`;
        for (let responseKey of responsePart) {
            if (!(expectedResponseHeaderParams.includes(responseKey.name.trim()))) {
                status = false;
                fieldNames = fieldNames + ' ,' + responseKey.name;
                break;
            }
        }
        expect(status, `${fieldNames} was not present in ${responseType}`).toBe(true);
        if (status) {
            Logger.info(`All expected response headers [${expectedResponseHeaderParams}] found in ${responseType}`);
        }
    }

    static async readValuesFromTextFile(fileName: string): Promise<string> {
        const content = fs.readFileSync(`./utils/api/${fileName}.txt`, `utf8`);
        Logger.info(`Read values from text file: ${fileName}.txt`);
        return content;
    }

    /**
     * Verifies that the response array contains an object with the expected key-value pairs.
     * @param responseArray The array of objects from the API response
     * @param expectedFields An object with key-value pairs to match (all must match in at least one object)
     * @param description Optional description for error messages
     */
    static async verifyResponseContents(responseArray: any[], expectedFields: Record<string, any>, description: string = 'Response Contents'): Promise<void> {
        Logger.info(`${description}: Verify object with fields ${JSON.stringify(expectedFields)} in response`);
        expect(Array.isArray(responseArray)).toBeTruthy();
        expect(responseArray.length).toBeGreaterThan(0);
        const found = responseArray.some(obj =>
            Object.entries(expectedFields).every(([key, value]) => obj[key] == value)
        );
        if (!found) {
            throw new Error(`${description}: Expected object with fields ${JSON.stringify(expectedFields)} not found in response`);
        }
    }

    /**
     * Checks if the response (object, array, or string) contains the given keyword anywhere in its stringified form.
     * @param response The response object, array, or string
     * @param keyword The keyword to search for
     * @param description Optional description for error messages
     */
    static async verifyResponseContainsKeyword(response: any, keyword: string, description: string = 'Response'): Promise<void> {
        const str = typeof response === 'string' ? response : JSON.stringify(response);
        expect(str.includes(keyword), `${description} does not contain keyword: ${keyword}`).toBeTruthy();
        Logger.info(`${description}: Response contains keyword '${keyword}'`);
    }
}