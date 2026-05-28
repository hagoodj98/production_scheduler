import type { Page } from '@playwright/test';

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

export const gotoHomeAndWaitForJobs = async (page: Page) => {
  await Promise.all([
    page.waitForResponse((response) => response.url().includes('/api/load-jobs-to-chart')),
    page.goto('/'),
  ]);
};

export const gotoCreateOrderAndWaitForJobs = async (page: Page) => {
  await gotoHomeAndWaitForJobs(page);
  await page.getByRole('link', { name: 'Navigate to Create Order' }).click();
};