import { expect, test, type Page } from '@playwright/test';
import { gotoCreateOrderAndWaitForJobs, mockLoadJobs } from './helpers';

const freezeClientClock = async (page: Page) => {
  await page.addInitScript(() => {
    const fixedNow = new Date('2026-05-28T12:00:00.000Z');
    const NativeDate = Date;

    class MockDate extends NativeDate {
      constructor(...args: unknown[]) {
        if (args.length === 0) {
          super(fixedNow);
          return;
        }

        // Preserve native Date constructor behavior for all supported overloads.
        if (args.length === 1) {
          super(args[0] as string | number | Date);
          return;
        }
        if (args.length === 2) {
          super(args[0] as number, args[1] as number);
          return;
        }
        if (args.length === 3) {
          super(args[0] as number, args[1] as number, args[2] as number);
          return;
        }
        if (args.length === 4) {
          super(args[0] as number, args[1] as number, args[2] as number, args[3] as number);
          return;
        }
        if (args.length === 5) {
          super(
            args[0] as number,
            args[1] as number,
            args[2] as number,
            args[3] as number,
            args[4] as number,
          );
          return;
        }
        if (args.length === 6) {
          super(
            args[0] as number,
            args[1] as number,
            args[2] as number,
            args[3] as number,
            args[4] as number,
            args[5] as number,
          );
          return;
        }

        super(
          args[0] as number,
          args[1] as number,
          args[2] as number,
          args[3] as number,
          args[4] as number,
          args[5] as number,
          args[6] as number,
        );
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
    await mockLoadJobs(page, [
      {
        id: 1,
        resource_name: 'Mixer A',
        productionOrders: [],
      },
    ]);
    await gotoCreateOrderAndWaitForJobs(page);

    await fillSchedule(page, {
      date: '01/01/2020',
      startTime: '09:00 AM',
      endTime: '11:00 AM',
    });

    await page.getByRole('button', { name: 'Create Order' }).click();

    await expect(page.getByText('Start time must be in the future')).toBeVisible();
  });

  test('shows an error when the end time is before the start time', async ({ page }) => {
    await freezeClientClock(page);
    await mockLoadJobs(page, [
      {
        id: 1,
        resource_name: 'Mixer A',
        productionOrders: [],
      },
    ]);
    await gotoCreateOrderAndWaitForJobs(page);

    await fillSchedule(page, {
      date: '12/31/2099',
      startTime: '10:00 AM',
      endTime: '09:30 AM',
    });

    await page.getByRole('button', { name: 'Create Order' }).click();

    await expect(page.getByText('End time must be after start time')).toBeVisible();
  });

  test('shows zod errors when time fields are left unselected', async ({ page }) => {
    await freezeClientClock(page);
    await mockLoadJobs(page, [
      {
        id: 1,
        resource_name: 'Mixer A',
        productionOrders: [],
      },
    ]);
    await gotoCreateOrderAndWaitForJobs(page);

    await fillResourceAndDate(page, '06/01/2026');

    await page.getByRole('button', { name: 'Create Order' }).click();

    const form = page.locator('form');
    await expect(form.getByText('please select start time hour')).toBeVisible();
    await expect(form.getByText('please select start time minute')).toBeVisible();
    await expect(form.getByText('please select end time hour')).toBeVisible();
    await expect(form.getByText('please select end time minute')).toBeVisible();
  });
});
