import { beforeEach, describe, expect, it, vi } from 'vitest';

const { cookiesMock, decryptMock, productionOrderMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
  decryptMock: vi.fn(),
  productionOrderMock: {
    findByIdOrThrow: vi.fn(),
  },
}));

vi.mock('next/headers', () => ({ cookies: cookiesMock }));
vi.mock('@/lib/session', () => ({ decrypt: decryptMock }));
vi.mock('@/lib/repositories', () => ({ productionOrder: productionOrderMock }));

import { checkAuthMetaData } from '@/utils/CheckAuthHelper';

describe('checkAuthMetaData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: 'session-token' }),
    });
  });

  it('rejects requests without a session cookie', async () => {
    cookiesMock.mockResolvedValueOnce({ get: vi.fn().mockReturnValue(undefined) });

    await expect(checkAuthMetaData('delete')).rejects.toMatchObject({
      message: 'You are unauthenticated',
      statusCode: 401,
    });
    expect(decryptMock).not.toHaveBeenCalled();
  });

  it('rejects worker sessions even when checking access without a specific permission', async () => {
    decryptMock.mockResolvedValueOnce({ name: 'Worker', permissions: ['view'] });

    await expect(checkAuthMetaData()).rejects.toMatchObject({
      message: 'Unauthorized access for worker role',
      statusCode: 403,
    });
  });

  it('allows a user with the requested permission', async () => {
    decryptMock.mockResolvedValueOnce({ name: 'Delete Admin', permissions: ['delete'] });

    await expect(checkAuthMetaData('delete')).resolves.toMatchObject({ adminName: 'Delete Admin' });
  });

  it('does not let a delete-only user reschedule orders', async () => {
    decryptMock.mockResolvedValueOnce({ name: 'Delete Admin', permissions: ['delete'] });

    await expect(checkAuthMetaData('reschedule')).rejects.toMatchObject({
      message: 'You are unauthorized to reschedule this resource',
      statusCode: 403,
    });
  });

  it('allows an all-access user to perform any permission-gated action', async () => {
    decryptMock.mockResolvedValueOnce({ name: 'All Access Admin', permissions: ['all_access'] });

    await expect(checkAuthMetaData('add')).resolves.toMatchObject({
      adminName: 'All Access Admin',
    });
  });

  it('does not treat a nonnumeric path segment as an order ID', async () => {
    decryptMock.mockResolvedValueOnce({
      name: 'All Access Admin',
      permissions: ['all_access'],
      employee_id: 'EMP-1',
    });

    await expect(checkAuthMetaData('add', '/add-resource', 'add-resource')).resolves.toMatchObject({
      adminName: 'All Access Admin',
    });
    expect(productionOrderMock.findByIdOrThrow).not.toHaveBeenCalled();
  });
});
