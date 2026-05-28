import { expect, test, type Page } from '@playwright/test';

const mockLoadJobs = async (page: Page) => {
  await page.route('**/api/load-jobs-to-chart', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ResourceProductionOrders: [
          {
            id: 1,
            resource_name: 'Mixer A',
            productionOrders: [],
          },
        ],
      }),
    });
  });
};

const freezeClientClock = async (page: Page) => {
  await page.addInitScript(() => {
    const fixedNow = new Date('2026-05-28T12:00:00.000Z');
    const NativeDate = Date;

    class MockDate extends NativeDate {
      constructor(...args: (string | number | Date)[]) {
        if (args.length === 0) {
          super(fixedNow);
          return;
        }
        super(args[0]);
      }

      static now() {
        return fixedNow.getTime();
      }
    }

    // Keep browser-side validation deterministic for date-sensitive schedules.
    // @ts-expect-error - replacing Date for the test page only
    Date = MockDate;
  });
};

const fillSchedule = async (
  page: Page,
  values: {
    date: string;
    startTime: string;
    endTime: string;
  },
) => {
  await page.getByRole('combobox', { name: 'Resource' }).click();
  await expect(page.getByText('Mixer A', { exact: true })).toBeVisible();
  await page.getByText('Mixer A', { exact: true }).click();

  const [month, day, year] = values.date.split('/');
  const [startHour, startMinuteWithMeridiem] = values.startTime.split(':');
  const [startMinute, startMeridiem] = startMinuteWithMeridiem.split(' ');
  const [endHour, endMinuteWithMeridiem] = values.endTime.split(':');
  const [endMinute, endMeridiem] = endMinuteWithMeridiem.split(' ');

  const dateGroup = page.getByRole('group', { name: 'Pick Date' });
  await dateGroup.getByRole('spinbutton', { name: 'Month' }).fill(month);
  await dateGroup.getByRole('spinbutton', { name: 'Day' }).fill(day);
  await dateGroup.getByRole('spinbutton', { name: 'Year' }).fill(year);

  const startGroup = page.getByRole('group', { name: 'Start time' });
  await startGroup.getByRole('spinbutton', { name: 'Hours' }).fill(startHour);
  await startGroup.getByRole('spinbutton', { name: 'Minutes' }).fill(startMinute);
  await startGroup.getByRole('spinbutton', { name: 'Meridiem' }).fill(startMeridiem);

  const endGroup = page.getByRole('group', { name: 'End time' });
  await endGroup.getByRole('spinbutton', { name: 'Hours' }).fill(endHour);
  await endGroup.getByRole('spinbutton', { name: 'Minutes' }).fill(endMinute);
  await endGroup.getByRole('spinbutton', { name: 'Meridiem' }).fill(endMeridiem);
};

const fillResourceAndDate = async (page: Page, date: string) => {
  await page.getByRole('combobox', { name: 'Resource' }).click();
  await expect(page.getByText('Mixer A', { exact: true })).toBeVisible();
  await page.getByText('Mixer A', { exact: true }).click();

  const [month, day, year] = date.split('/');
  const dateGroup = page.getByRole('group', { name: 'Pick Date' });
  await dateGroup.getByRole('spinbutton', { name: 'Month' }).fill(month);
  await dateGroup.getByRole('spinbutton', { name: 'Day' }).fill(day);
  await dateGroup.getByRole('spinbutton', { name: 'Year' }).fill(year);
};

test.describe('assign resource scheduling validation', () => {
  test('shows an error when the start time is in the past', async ({ page }) => {
    await freezeClientClock(page);
    await mockLoadJobs(page);

    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/load-jobs-to-chart')),
      page.goto('/'),
    ]);

    await page.getByRole('link', { name: 'Navigate to Create Order' }).click();

    await fillSchedule(page, {
      date: '05/27/2026',
      startTime: '09:00 AM',
      endTime: '11:00 AM',
    });

    await page.getByRole('button', { name: 'Create Order' }).click();

    await expect(page.getByText('Start time must be in the future')).toBeVisible();
  });

  test('shows an error when the end time is before the start time', async ({ page }) => {
    await freezeClientClock(page);
    await mockLoadJobs(page);

    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/load-jobs-to-chart')),
      page.goto('/'),
    ]);

    await page.getByRole('link', { name: 'Navigate to Create Order' }).click();

    await fillSchedule(page, {
      date: '06/01/2026',
      startTime: '10:00 AM',
      endTime: '09:30 AM',
    });

    await page.getByRole('button', { name: 'Create Order' }).click();

    await expect(page.getByText('End time must be after start time')).toBeVisible();
  });

  test('shows zod errors when time fields are left unselected', async ({ page }) => {
    await freezeClientClock(page);
    await mockLoadJobs(page);

    await Promise.all([
      page.waitForResponse((response) => response.url().includes('/api/load-jobs-to-chart')),
      page.goto('/'),
    ]);

    await page.getByRole('link', { name: 'Navigate to Create Order' }).click();

    await fillResourceAndDate(page, '06/01/2026');

    await page.getByRole('button', { name: 'Create Order' }).click();

    const form = page.locator('form');
    await expect(form.getByText('please select start time hour')).toBeVisible();
    await expect(form.getByText('please select start time minute')).toBeVisible();
    await expect(form.getByText('please select end time hour')).toBeVisible();
    await expect(form.getByText('please select end time minute')).toBeVisible();
  });
});
