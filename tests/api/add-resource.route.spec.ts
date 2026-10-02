import { beforeEach, describe, expect, it, vi } from 'vitest';

const { selectedResource, orderLog, checkAuthMetaData } = vi.hoisted(() => ({
  selectedResource: {
    create: vi.fn(),
  },
  orderLog: {
    createOrderLog: vi.fn(),
  },
  checkAuthMetaData: vi.fn(),
}));

vi.mock('@/lib/repositories', () => ({
  selectedResource,
  orderLog,
}));
vi.mock('@/utils/CheckAuthHelper', () => ({ checkAuthMetaData }));

import { POST } from '@/app/api/resource/add/route';

describe('POST /api/resource/add', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAuthMetaData.mockResolvedValue({ employeeId: 'emp-1' });
    orderLog.createOrderLog.mockResolvedValue({ id: 1 });
  });

  it('creates a selected resource and returns 200', async () => {
    selectedResource.create.mockResolvedValue({
      id: 1,
      resource_name: 'CNC Machine 99',
    });

    const req = new Request('http://localhost/api/resource/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource_name: 'CNC Machine 99' }),
    });

    const res = await POST(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ message: 'Successfully added resource CNC Machine 99' });
    expect(selectedResource.create).toHaveBeenCalledWith('CNC Machine 99');
  });

  it('returns 500 when repository create fails', async () => {
    selectedResource.create.mockRejectedValueOnce(new Error('db write failed'));

    const req = new Request('http://localhost/api/resource/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource_name: 'CNC Machine 99' }),
    });

    const res = await POST(req as never);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({ error: 'db write failed' });
  });
});
