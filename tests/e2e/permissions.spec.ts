import 'dotenv/config';
import { expect, test, type Page } from '@playwright/test';

type AdminAccount = {
  employeeId: string;
  password: string;
  adminKey: string;
  name: string;
};

const addAssignAdmin: AdminAccount = {
  employeeId: 'EMP002',
  password: process.env.JANE_ADMIN_PASSWORD || 'password456',
  adminKey: process.env.CREATE_ASSIGN_ADMIN_ACCESS_KEY || 'create_assign_admin_access_key',
  name: 'Jane Smith',
};

const rescheduleDeleteAdmin: AdminAccount = {
  employeeId: 'EMP004',
  password: process.env.EMILY_ADMIN_PASSWORD || 'password101',
  adminKey: process.env.RESCHEDULE_TASK_ADMIN_ACCESS_KEY || 'reschedule_task_admin_access_key',
  name: 'Emily Davis',
};

const allAccessAdmin: AdminAccount = {
  employeeId: 'EMP003',
  password: process.env.MICHAEL_ADMIN_PASSWORD || 'password789',
  adminKey: process.env.ALL_ACCESS_ADMIN_ACCESS_KEY || 'all_access_admin_access_key',
  name: 'Michael Johnson',
};

const loginAs = async (page: Page, account: AdminAccount) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByLabel('Employee ID').fill(account.employeeId);
  await page.getByLabel('Password').fill(account.password);
  await page.getByLabel('Admin Key').fill(account.adminKey);
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('heading', { name: `Hello, ${account.name}` })).toBeVisible();
};

const callJsonApi = async (page: Page, path: string, method: string, body?: unknown) => {
  const response = await page.context().request.fetch(new URL(path, page.url()).toString(), {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body === undefined ? {} : { data: body }),
  });
  return { status: response.status(), body: await response.json() };
};

const expectRedirectedHome = async (page: Page) => {
  await expect.poll(() => new URL(page.url()).pathname).toBe('/');
  await expect(page.getByRole('heading', { name: 'Production Scheduler' })).toBeVisible();
};

test.describe('permission-based access', () => {
  test('redirects unauthenticated users from protected pages and denies direct API calls', async ({
    page,
  }) => {
    await page.goto('/add-resource');
    await expectRedirectedHome(page);

    const response = await callJsonApi(page, '/api/order/delete?orderId=1', 'DELETE');
    expect(response.status).toBe(401);
  });

  test('add-and-assign admins can use those pages but cannot reschedule or delete', async ({
    page,
  }) => {
    await loginAs(page, addAssignAdmin);

    await page.goto('/add-resource');
    await expect(page).toHaveURL(/\/add-resource$/);
    await expect(page.getByRole('heading', { name: 'Add a Resource' })).toBeVisible();

    await page.goto('/assign-order');
    await expect(page).toHaveURL(/\/assign-order$/);

    expect((await callJsonApi(page, '/api/resource/add', 'POST', {})).status).toBe(400);
    expect((await callJsonApi(page, '/api/order/mark-pending', 'POST', {})).status).toBe(400);
    expect((await callJsonApi(page, '/api/order/reschedule', 'PATCH', {})).status).toBe(403);
    expect((await callJsonApi(page, '/api/order/delete?orderId=1', 'DELETE')).status).toBe(403);
  });

  test('reschedule admins can reassign existing orders but cannot create new ones', async ({
    page,
  }) => {
    await loginAs(page, allAccessAdmin);

    const resourceName = `Permission test ${Date.now()}`;
    const addResourceResponse = await callJsonApi(page, '/api/resource/add', 'POST', {
      resource_name: resourceName,
    });
    expect(addResourceResponse.status).toBe(200);

    const order = {
      dayMonthYear: { month: 12, day: 31, year: 2099 },
      timeRange: {
        startTimeSlot: { hour: 9, minute: 0 },
        endTimeSlot: { hour: 10, minute: 0 },
      },
      resource: { resource_name: resourceName },
      orderId: 0,
      assignedEmployeeId: 'EMP005',
    };
    const createPendingResponse = await callJsonApi(
      page,
      '/api/order/mark-pending',
      'POST',
      { order },
    );
    expect(createPendingResponse.status).toBe(200);
    const existingOrderId = createPendingResponse.body.orderId as number;

    await page.context().clearCookies();
    await loginAs(page, rescheduleDeleteAdmin);

    await page.goto('/add-resource');
    await expectRedirectedHome(page);

    await page.goto('/assign-order');
    await expectRedirectedHome(page);

    expect((await callJsonApi(page, '/api/order/reschedule', 'PATCH', {})).status).toBe(400);
    expect((await callJsonApi(page, '/api/order/delete', 'DELETE')).status).toBe(400);
    expect(
      (
        await callJsonApi(page, '/api/order/mark-pending', 'POST', {
          order,
        })
      ).status,
    ).toBe(403);

    await page.goto(`/assign-order/${existingOrderId}`);
    await expect(page).toHaveURL(new RegExp(`/assign-order/${existingOrderId}$`));
    await expect(page.getByRole('heading', { name: 'Update production order' })).toBeVisible();
    expect(
      (
        await callJsonApi(page, `/api/order/mark-pending?orderId=${existingOrderId}`, 'POST', {
          order: { ...order, orderId: existingOrderId },
          existingOrder: true,
        })
      ).status,
    ).toBe(200);
  });

  test('all-access admins can enter both protected pages and pass each API permission check', async ({
    page,
  }) => {
    await loginAs(page, allAccessAdmin);

    await page.goto('/add-resource');
    await expect(page).toHaveURL(/\/add-resource$/);
    await expect(page.getByRole('heading', { name: 'Add a Resource' })).toBeVisible();

    await page.goto('/assign-order');
    await expect(page).toHaveURL(/\/assign-order$/);

    expect((await callJsonApi(page, '/api/resource/add', 'POST', {})).status).toBe(400);
    expect((await callJsonApi(page, '/api/order/mark-pending', 'POST', {})).status).toBe(400);
    expect((await callJsonApi(page, '/api/order/reschedule', 'PATCH', {})).status).toBe(400);
    expect((await callJsonApi(page, '/api/order/delete', 'DELETE')).status).toBe(400);
  });
});
