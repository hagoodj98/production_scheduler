import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import 'dotenv/config';

type ProductionOrder = {
  id: number;
  dayMonthYear: string;
  startTime: string;
  endTime: string;
  resourceStatus: string;
  resourceId: number;
};

type ResourceProductionOrder = {
  id: number;
  resource_name: string;
  productionOrders: ProductionOrder[];
};

export const mockLoadJobs = async (
  page: Page,
  resourceProductionOrders: ResourceProductionOrder[],
) => {
  await page.route('**/api/load-jobs-to-chart', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ResourceProductionOrders: resourceProductionOrders,
      }),
    });
  });
};

export const loginAsAllAccess = async (page: Page) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByLabel('Employee ID').fill('EMP003');
  await page.getByLabel('Password').fill(process.env.MICHAEL_ADMIN_PASSWORD || 'password789');
  await page
    .getByLabel('Admin Key')
    .fill(process.env.ALL_ACCESS_ADMIN_ACCESS_KEY || 'all_access_admin_access_key');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: 'Hello, Michael Johnson' })).toBeVisible();
};

export const gotoHomeAndWaitForJobs = async (page: Page) => {
  await loginAsAllAccess(page);
  await Promise.all([
    page.waitForResponse((response) => response.url().includes('/api/load-jobs-to-chart')),
    page.goto('/'),
  ]);
};

export const gotoCreateOrderAndWaitForJobs = async (page: Page) => {
  await gotoHomeAndWaitForJobs(page);
  await page.getByRole('link', { name: 'Navigate to Create Order' }).click();
};
