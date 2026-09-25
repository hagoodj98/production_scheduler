import { beforeEach, describe, expect, it, vi } from 'vitest';

const { selectedResource, checkAuthMetaData, validateSession } = vi.hoisted(() => ({
  selectedResource: {
    create: vi.fn(),
  },
  checkAuthMetaData: vi.fn(),
  validateSession: vi.fn(),
}));

vi.mock('@/lib/repositories', () => ({
  selectedResource,
}));
vi.mock('@/utils/CheckAuthHelper', () => ({ checkAuthMetaData }));
vi.mock('@/lib/session', () => ({ validateSession }));

import { POST } from '@/app/api/search-resource/add-resource/route';

describe('POST /api/search-resource/add-resource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAuthMetaData.mockResolvedValue('Resource Admin');
    validateSession.mockResolvedValue('session-token');
  });

  it('creates a selected resource and returns 200', async () => {
    selectedResource.create.mockResolvedValue({
      id: 1,
      resource_name: 'CNC Machine 99',
    });

    const req = new Request('http://localhost/api/add-resource', {
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

    const req = new Request('http://localhost/api/add-resource', {
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
