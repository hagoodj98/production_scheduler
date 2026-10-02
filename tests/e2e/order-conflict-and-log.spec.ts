import { expect, test } from '@playwright/test';
import { loginAsAllAccess } from './helpers';

test.describe('scheduling time conflicts', () => {
  test('shows the time conflict error returned by mark-pending', async ({ page }) => {
    await loginAsAllAccess(page);

    // The resource dropdown reads from SelectedResource, which is empty on a fresh DB.
    await page.route('**/api/resource/load', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ Resources: [{ resource_name: 'CNC Machine 1' }] }),
      });
    });

    // Force the automatic mark-pending check to reject with a time conflict.
    await page.route('**/api/order/mark-pending', async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error:
            'Time slot conflicts with an existing order for this resource and employee. Select a different time slot or worker.',
        }),
      });
    });

    await page.goto('/assign-order');

    await page.getByRole('combobox', { name: 'Resource' }).click();
    await expect(page.getByText('CNC Machine 1', { exact: true })).toBeVisible();
    await page.getByText('CNC Machine 1', { exact: true }).click();

    await page.getByRole('combobox', { name: 'Assign employee' }).click();
    await expect(page.getByText('William Brown', { exact: true })).toBeVisible();
    await page.getByText('William Brown', { exact: true }).click();

    const dateGroup = page.getByRole('group', { name: 'Production date' });
    await dateGroup.getByRole('spinbutton', { name: 'Month' }).fill('12');
    await dateGroup.getByRole('spinbutton', { name: 'Day' }).fill('31');
    await dateGroup.getByRole('spinbutton', { name: 'Year' }).fill('2099');

    const startGroup = page.getByRole('group', { name: 'Start time' });
    await startGroup.getByRole('spinbutton', { name: 'Hours' }).fill('09');
    await startGroup.getByRole('spinbutton', { name: 'Minutes' }).fill('00');
    await startGroup.getByRole('spinbutton', { name: 'Meridiem' }).fill('AM');

    const endGroup = page.getByRole('group', { name: 'End time' });
    await endGroup.getByRole('spinbutton', { name: 'Hours' }).fill('10');
    await endGroup.getByRole('spinbutton', { name: 'Minutes' }).fill('00');
    await endGroup.getByRole('spinbutton', { name: 'Meridiem' }).fill('AM');

    // Completing the form triggers the automatic mark-pending request, no submit click needed.
    await expect(
      page.getByText(
        'Time slot conflicts with an existing order for this resource and employee. Select a different time slot or worker.',
      ),
    ).toBeVisible();
  });
});

test.describe('order log table', () => {
  test('renders fetched rows with status color coding', async ({ page }) => {
    await page.route('**/api/order-log/load', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Order log loaded successfully',
          logs: [
            {
              id: 1,
              orderId: 101,
              creationDate: '2026-03-08 at 09:00AM',
              employeeId: 'EMP003',
              employee: { employeeId: 'EMP003', name: 'Michael Johnson', role: 'admin' },
              description: 'Created order',
              order: {
                employee: { name: 'Jane Smith', role: 'admin' },
                resourceStatus: 'Completed',
                resource: { resource_name: 'CNC Machine 1' },
              },
            },
            {
              id: 2,
              orderId: 102,
              creationDate: '2026-03-08 at 10:00AM',
              employeeId: 'EMP003',
              employee: { employeeId: 'EMP003', name: 'Michael Johnson', role: 'admin' },
              description: 'Deleted order',
              order: {
                employee: { name: 'Emily Davis', role: 'admin' },
                resourceStatus: 'Deleted',
                resource: { resource_name: 'Mixer A' },
              },
            },
          ],
        }),
      });
    });

    await loginAsAllAccess(page);
    await page.goto('/order-log');

    await expect(page.getByText('Log#')).toBeVisible();
    await expect(page.getByText('Assigned Employee')).toBeVisible();

    await expect(page.getByText('101')).toBeVisible();
    await expect(page.getByText('Jane Smith')).toBeVisible();
    await expect(page.getByText('CNC Machine 1')).toBeVisible();

    await expect(page.getByText('102')).toBeVisible();
    await expect(page.getByText('Emily Davis')).toBeVisible();
    await expect(page.getByText('Mixer A')).toBeVisible();

    const completedRow = page.locator('tr', { has: page.getByText('CNC Machine 1') });
    await expect(completedRow).toHaveClass(/bg-\(--status-completed\)/);

    const deletedRow = page.locator('tr', { has: page.getByText('Mixer A') });
    await expect(deletedRow).toHaveClass(/bg-\(--status-deleted\)/);
  });
});
