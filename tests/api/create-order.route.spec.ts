import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

import { POST } from '@/app/api/pending-order/route';

const makeRequest = (order: Record<string, unknown>) =>
  new Request('http://localhost/api/pending-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order }),
  });

describe('POST /api/pending-order schedule validation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    checkAuthMetaData.mockResolvedValue('Assign Admin');
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
        orderId: null,
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
        orderId: null,
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
