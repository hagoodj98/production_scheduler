import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import dayjs from 'dayjs';

const { productionOrder } = vi.hoisted(() => ({
  productionOrder: {
    findAll: vi.fn(),
  },
}));

vi.mock('@/lib/repositories', () => ({ productionOrder }));

import { checkTimeConflict } from '@/app/validation/timeConflictHelper';

const time = (value: string) => dayjs(value, 'YYYY-M-D HH:mm:ss');

const makeExistingOrder = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  dayMonthYear: dayjs('2026-03-08').toDate(),
  startTime: dayjs('2026-03-08 09:00:00', 'YYYY-M-D HH:mm:ss').toDate(),
  endTime: dayjs('2026-03-08 10:00:00', 'YYYY-M-D HH:mm:ss').toDate(),
  resourceId: 1,
  resourceStatus: 'Scheduled',
  employeeAssigneeID: 'emp-1',
  deletedAt: null,
  ...overrides,
});

describe('checkTimeConflict', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws when the same employee is already booked on the same resource during an overlapping window', async () => {
    productionOrder.findAll.mockResolvedValue([makeExistingOrder()]);

    await expect(
      checkTimeConflict(
        1,
        dayjs('2026-03-08'),
        time('2026-03-08 09:30:00'),
        time('2026-03-08 10:30:00'),
        'emp-1',
      ),
    ).rejects.toMatchObject({
      message:
        'Time slot conflicts with an existing order for this resource and employee. Select a different time slot or worker.',
      statusCode: 403,
    });
  });

  it('does not throw when a different employee requests the overlapping window', async () => {
    productionOrder.findAll.mockResolvedValue([makeExistingOrder()]);

    await expect(
      checkTimeConflict(
        1,
        dayjs('2026-03-08'),
        time('2026-03-08 09:30:00'),
        time('2026-03-08 10:30:00'),
        'emp-2',
      ),
    ).resolves.toBeUndefined();
  });

  it('does not throw when the same employee requests a non-overlapping window on the same resource', async () => {
    productionOrder.findAll.mockResolvedValue([makeExistingOrder()]);

    await expect(
      checkTimeConflict(
        1,
        dayjs('2026-03-08'),
        time('2026-03-08 11:00:00'),
        time('2026-03-08 12:00:00'),
        'emp-1',
      ),
    ).resolves.toBeUndefined();
  });

  it('does not throw when the overlapping order is for a different resource', async () => {
    productionOrder.findAll.mockResolvedValue([makeExistingOrder({ resourceId: 2 })]);

    await expect(
      checkTimeConflict(
        1,
        dayjs('2026-03-08'),
        time('2026-03-08 09:30:00'),
        time('2026-03-08 10:30:00'),
        'emp-1',
      ),
    ).resolves.toBeUndefined();
  });

  it('ignores deleted orders when checking for conflicts', async () => {
    productionOrder.findAll.mockResolvedValue([
      makeExistingOrder({ deletedAt: new Date('2026-03-01T00:00:00.000Z') }),
    ]);

    await expect(
      checkTimeConflict(
        1,
        dayjs('2026-03-08'),
        time('2026-03-08 09:30:00'),
        time('2026-03-08 10:30:00'),
        'emp-1',
      ),
    ).resolves.toBeUndefined();
  });

  it('ignores pending orders when checking for conflicts', async () => {
    productionOrder.findAll.mockResolvedValue([makeExistingOrder({ resourceStatus: 'Pending' })]);

    await expect(
      checkTimeConflict(
        1,
        dayjs('2026-03-08'),
        time('2026-03-08 09:30:00'),
        time('2026-03-08 10:30:00'),
        'emp-1',
      ),
    ).resolves.toBeUndefined();
  });
});
