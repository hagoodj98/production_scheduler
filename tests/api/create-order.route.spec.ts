import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { selectedResourceRepository, productionOrderRepository } = vi.hoisted(() => ({
  selectedResourceRepository: {
    findByNameOrThrow: vi.fn(),
  },
  productionOrderRepository: {
    create: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('@/lib/repositories', () => ({
  selectedResourceRepository,
  productionOrderRepository,
}));

import { POST } from '@/app/api/create-order/route';

const makeRequest = (productionOrder: Record<string, unknown>) =>
  new Request('http://localhost/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productionOrder }),
  });

describe('POST /api/create-order', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
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
    expect(selectedResourceRepository.findByNameOrThrow).not.toHaveBeenCalled();
    expect(productionOrderRepository.create).not.toHaveBeenCalled();
    expect(productionOrderRepository.update).not.toHaveBeenCalled();
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
    expect(selectedResourceRepository.findByNameOrThrow).not.toHaveBeenCalled();
    expect(productionOrderRepository.create).not.toHaveBeenCalled();
    expect(productionOrderRepository.update).not.toHaveBeenCalled();
  });
});