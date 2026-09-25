import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { CustomError } from '@/utils/CustomErrors';

const { checkAuthMetaDataMock } = vi.hoisted(() => ({
  checkAuthMetaDataMock: vi.fn(),
}));

vi.mock('@/utils/CheckAuthHelper', () => ({
  checkAuthMetaData: checkAuthMetaDataMock,
}));

import { GET } from '@/app/api/authorize-permission/route';

describe('GET /api/authorize-permission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks add permission for add-resource paths', async () => {
    const request = new NextRequest(
      'http://localhost/api/authorize-permission?path=%2Fadd-resource',
    );

    const response = await GET(request);

    expect(checkAuthMetaDataMock).toHaveBeenCalledWith('add', '/add-resource');
    expect(response.status).toBe(200);
  });

  it('checks assign permission for the assign-order page', async () => {
    const request = new NextRequest(
      'http://localhost/api/authorize-permission?path=%2Fassign-order',
    );

    const response = await GET(request);

    expect(checkAuthMetaDataMock).toHaveBeenCalledWith('assign', '/assign-order');
    expect(response.status).toBe(200);
  });

  it('checks reschedule permission for an existing order path', async () => {
    const request = new NextRequest(
      'http://localhost/api/authorize-permission?path=%2Fassign-order%2F123',
    );

    const response = await GET(request);

    expect(checkAuthMetaDataMock).toHaveBeenCalledWith('reschedule', '/assign-order/123');
    expect(response.status).toBe(200);
  });

  it('returns forbidden when the session lacks the path permission', async () => {
    checkAuthMetaDataMock.mockRejectedValueOnce(
      new CustomError('You are unauthorized to reschedule this resource', 403),
    );
    const request = new NextRequest(
      'http://localhost/api/authorize-permission?path=%2Fassign-order%2F123',
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body).toEqual({ error: 'You are unauthorized to reschedule this resource' });
  });
});
