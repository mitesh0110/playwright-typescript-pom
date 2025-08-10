import { TestInfo, test as baseTest } from '@playwright/test';
import { HomePage } from '@pages/HomePage';
import { RegisterPage } from '@pages/RegisterPage';
import { WelcomePage } from '@pages/WelcomePage';
import { AccountOverviewPage } from '@pages/AccountOverviewPage';
import { OpenNewAccountPage } from '@pages/OpenNewAccountPage';
import { TransferFundsPage } from '@pages/TransferFundsPage';
import { BillPayPage } from '@pages/BillPayPage';
import { WebActions } from '@lib/WebActions';
import { APIActions } from './APIActions';
import { AssertionUtils } from 'utils/functional/AssertionUtils';
import AxeBuilder from '@axe-core/playwright';
import { ApiAssertionUtils } from 'utils/api/ApiAssertionUtils';

const test = baseTest.extend<{
    webActions: WebActions;
    apiActions: APIActions;
    homePage: HomePage;
    registerPage: RegisterPage;
    welcomePage: WelcomePage;
    accountOverviewPage: AccountOverviewPage;
    openNewAccountPage: OpenNewAccountPage;
    transferFundsPage: TransferFundsPage;
    billPayPage: BillPayPage;
    AssertionUtils: typeof AssertionUtils;
    ApiAssertionUtils: typeof ApiAssertionUtils;

}>({
    webActions: async ({ page, context }, use) => {
        await use(new WebActions(page, context));
    },
    apiActions: async ({ page, context }, use) => {
        await use(new APIActions());
    },
    homePage: async ({ page, context }, use) => {
        await use(new HomePage(page, context));
    },
    registerPage: async ({ page, context }, use) => {
        await use(new RegisterPage(page, context));
    },
    welcomePage: async ({ page, context }, use) => {
        await use(new WelcomePage(page, context));
    },
    accountOverviewPage: async ({ page, context }, use) => {
        await use(new AccountOverviewPage(page, context));
    },
    openNewAccountPage: async ({ page, context }, use) => {
        await use(new OpenNewAccountPage(page, context));
    },
    transferFundsPage: async ({ page, context }, use) => {
        await use(new TransferFundsPage(page, context));
    },
    billPayPage: async ({ page, context }, use) => {
        await use(new BillPayPage(page, context));
    },
    AssertionUtils: async ({}, use) => {
        await use(AssertionUtils);
    },
    ApiAssertionUtils: async ({}, use) => {
        await use(ApiAssertionUtils);
    }
})

export default test;