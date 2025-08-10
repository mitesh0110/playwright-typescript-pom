import fs from 'fs';
import { APIResponse, expect } from '@playwright/test';
import { Logger } from '../utils/Logger';

export class APIActions {

    /**
     * Sends a GET request and logs an error if the request fails.
     * @param request Playwright APIRequestContext
     * @param url The URL to send the GET request to
     * @param options Optional request options
     */
    async sendGetRequest(request: any, url: string, options?: any) {
        try {
            const response = await request.get(url, options);
            if (!response.ok()) {
                Logger.error(`GET request failed: ${url} - Status: ${response.status()} - ${await response.text()}`);
            }
            return response;
        } catch (error) {
            Logger.error(`GET request error: ${url} - ${error}`);
            throw error;
        }
    }

    /**
     * Sends a POST request and logs an error if the request fails.
     * @param request Playwright APIRequestContext
     * @param url The URL to send the POST request to
     * @param data The data to send in the POST body
     * @param options Optional request options
     */
    async sendPostRequest(request: any, url: string, data?: any, options?: any) {
        try {
            const response = await request.post(url, { data, ...options });
            if (!response.ok()) {
                Logger.error(`POST request failed: ${url} - Status: ${response.status()} - ${await response.text()}`);
            }
            return response;
        } catch (error) {
            Logger.error(`POST request error: ${url} - ${error}`);
            throw error;
        }
    }

    /**
     * Sends a PUT request and logs an error if the request fails.
     * @param request Playwright APIRequestContext
     * @param url The URL to send the PUT request to
     * @param data The data to send in the PUT body
     * @param options Optional request options
     */
    async sendPutRequest(request: any, url: string, data?: any, options?: any) {
        try {
            const response = await request.put(url, { data, ...options });
            if (!response.ok()) {
                Logger.error(`PUT request failed: ${url} - Status: ${response.status()} - ${await response.text()}`);
            }
            return response;
        } catch (error) {
            Logger.error(`PUT request error: ${url} - ${error}`);
            throw error;
        }
    }
    
}