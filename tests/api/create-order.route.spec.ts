import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { selectedResource, productionOrder, checkAuthMetaData } = vi.hoisted(() => ({
  selectedResource: {
    findByNameOrThrow: vi.fn(),
  },
  productionOrder: {
    create: vi.fn(),
    update: vi.fn(),
  },
  checkAuthMetaData: vi.fn(),
}));

vi.mock('@/lib/repositories', () => ({
  selectedResource,
  productionOrder,
}));
vi.mock('@/utils/CheckAuthHelper', () => ({ checkAuthMetaData }));

import { POST } from '@/app/api/order/mark-pending/route';

const makeRequest = (order: Record<string, unknown>) =>
  new NextRequest('http://localhost/api/order/mark-pending', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order }),
  });

describe('POST /api/order/mark-pending schedule validation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    checkAuthMetaData.mockResolvedValue({ employeeId: 'emp-1' });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a 400 error when the start time is in the past', async () => {
    vi.setSystemTime(new Date(2026, 2, 8, 10, 30));

    const res = await POST(
      makeRequest({
        dayMonthYear: { month: 3, day: 8, year: 2026 },
        timeRange: {
          startTimeSlot: { hour: 9, minute: 0 },
          endTimeSlot: { hour: 11, minute: 0 },
        },
        resource: { resource_name: 'Mixer A' },
        assignedEmployeeId: 'EMP-1',
        orderId: 0,
      }) as never,
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body).toEqual({ error: 'Start time must be in the future' });
    expect(selectedResource.findByNameOrThrow).not.toHaveBeenCalled();
    expect(productionOrder.create).not.toHaveBeenCalled();
    expect(productionOrder.update).not.toHaveBeenCalled();
  });

  it('returns a 400 error when end time is before start time', async () => {
    vi.setSystemTime(new Date(2026, 2, 8, 8, 0));

    const res = await POST(
      makeRequest({
        dayMonthYear: { month: 3, day: 8, year: 2026 },
        timeRange: {
          startTimeSlot: { hour: 10, minute: 0 },
          endTimeSlot: { hour: 9, minute: 30 },
        },
        resource: { resource_name: 'Mixer A' },
        assignedEmployeeId: 'EMP-1',
        orderId: 0,
      }) as never,
    );
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body).toEqual({ error: 'End time must be after start time' });
    expect(selectedResource.findByNameOrThrow).not.toHaveBeenCalled();
    expect(productionOrder.create).not.toHaveBeenCalled();
    expect(productionOrder.update).not.toHaveBeenCalled();
  });
});
