import { beforeEach, describe, expect, it, vi } from 'vitest';

const { resource, checkAuthMetaData } = vi.hoisted(() => ({
  resource: {
    findByNamePrefix: vi.fn(),
  },
  checkAuthMetaData: vi.fn(),
}));

vi.mock('@/lib/repositories', () => ({
  resource,
}));
vi.mock('@/utils/CheckAuthHelper', () => ({ checkAuthMetaData }));

import { GET } from '@/app/api/search-resource/route';

describe('GET /api/search-resource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAuthMetaData.mockResolvedValue('Resource Admin');
  });

  it('queries repository by name prefix and returns resources', async () => {
    const resources = [
      { id: 1, resource_name: 'Press 1' },
      { id: 2, resource_name: 'Press 2' },
    ];
    resource.findByNamePrefix.mockResolvedValueOnce(resources);

    const req = new Request('http://localhost/api/search-resource?name=Pr', {
      method: 'GET',
    });

    const res = await GET(req as never);
    const body = await res.json();

    expect(resource.findByNamePrefix).toHaveBeenCalledWith('Pr');
    expect(res.status).toBe(200);
    expect(body).toEqual({ resources });
  });
});
