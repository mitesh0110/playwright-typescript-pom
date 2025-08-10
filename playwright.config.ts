import { PlaywrightTestConfig, devices } from '@playwright/test';
import { testConfig } from './testConfig';

const ENV = process.env.npm_config_ENV || "qa";

const config: PlaywrightTestConfig = {
  workers: 3,

  //Global Setup to run before all tests
  globalSetup: `./global-setup`,

  //sets timeout for each test case
  timeout: 30000,

  //number of retries if test case fails
  retries: 0,

  //Reporters
  reporter: [ [`allure-playwright`], [`html`, { outputFolder: 'html-report', open: 'never' }]],

  projects: [
    {
      name: `Edge`,
      use: {
        browserName: `chromium`,
        channel: `msedge`,
        baseURL: testConfig[ENV],
        headless: false,
        viewport: null,
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
        screenshot: `only-on-failure`,
        video: `retain-on-failure`,
        trace: `retain-on-failure`,
        launchOptions: {
          args: ['--start-maximized'],
          slowMo: 0
        }
      },
    },
    /*{
      name: `Chromium`,
      use: {
        browserName: `chromium`,
        baseURL: testConfig[ENV],
        headless: false,
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
        screenshot: `only-on-failure`,
        video: `retain-on-failure`,
        trace: `retain-on-failure`,
        launchOptions: {
          slowMo: 0
        }
      },
    },
    {
      name: `Mozilla`,
      use: {
        browserName: `firefox`,
        baseURL: testConfig[ENV],
        headless: false,
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
        screenshot: `only-on-failure`,
        video: `retain-on-failure`,
        trace: `retain-on-failure`,
        launchOptions: {
          slowMo: 0
        }
      },
    }*/
   /*{
      name: `API`,
      use: {
        baseURL: testConfig[ENV]
      }
    }*/
  ],
};
export default config;