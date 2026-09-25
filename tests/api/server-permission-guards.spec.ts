import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { CustomError } from '@/utils/CustomErrors';

const {
  checkAuthMetaDataMock,
  productionOrderCreateMock,
  productionOrderRemoveMock,
  productionOrderUpdateMock,
  selectedResourceCreateMock,
  selectedResourceFindMock,
  validateSessionMock,
} = vi.hoisted(() => ({
  checkAuthMetaDataMock: vi.fn(),
  productionOrderCreateMock: vi.fn(),
  productionOrderRemoveMock: vi.fn(),
  productionOrderUpdateMock: vi.fn(),
  selectedResourceCreateMock: vi.fn(),
  selectedResourceFindMock: vi.fn(),
  validateSessionMock: vi.fn(),
}));

vi.mock('@/utils/CheckAuthHelper', () => ({ checkAuthMetaData: checkAuthMetaDataMock }));
vi.mock('@/lib/session', () => ({ validateSession: validateSessionMock }));
vi.mock('@/lib/repositories', () => ({
  productionOrder: {
    create: productionOrderCreateMock,
    remove: productionOrderRemoveMock,
    update: productionOrderUpdateMock,
  },
  selectedResource: {
    create: selectedResourceCreateMock,
    findByNameOrThrow: selectedResourceFindMock,
  },
}));
vi.mock('@/lib/repositories/productionOrder', () => ({
  productionOrder: {
    update: productionOrderUpdateMock,
  },
}));
vi.mock('@/lib/repositories/selectedResource', () => ({
  selectedResource: {
    findByNameOrThrow: selectedResourceFindMock,
  },
}));

import { DELETE } from '@/app/api/delete-order/route';
import { POST as addResource } from '@/app/api/search-resource/add-resource/route';
import { POST as createPendingOrder } from '@/app/api/pending-order/route';
import { PATCH as rescheduleOrder } from '@/app/api/reschedule-order/route';

describe('server-side permission guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAuthMetaDataMock.mockRejectedValue(new CustomError('Forbidden', 403));
  });

  it('blocks deletion before the repository is called', async () => {
    const request = new NextRequest('http://localhost/api/delete-order?orderId=11', {
      method: 'DELETE',
    });

    const response = await DELETE(request);

    expect(checkAuthMetaDataMock).toHaveBeenCalledWith('delete');
    expect(response.status).toBe(403);
    expect(productionOrderRemoveMock).not.toHaveBeenCalled();
  });

  it('blocks rescheduling before parsing or updating the order', async () => {
    const request = new NextRequest('http://localhost/api/reschedule-order', {
      method: 'PATCH',
      body: '{',
    });

    const response = await rescheduleOrder(request);

    expect(checkAuthMetaDataMock).toHaveBeenCalledWith('reschedule');
    expect(response.status).toBe(403);
    expect(productionOrderUpdateMock).not.toHaveBeenCalled();
  });

  it('blocks order assignment before creating an order', async () => {
    const request = new NextRequest('http://localhost/api/pending-order', {
      method: 'POST',
      body: '{',
    });

    const response = await createPendingOrder(request);

    expect(checkAuthMetaDataMock).toHaveBeenCalledWith('assign');
    expect(response.status).toBe(403);
    expect(productionOrderCreateMock).not.toHaveBeenCalled();
  });

  it('blocks resource creation before writing to the repository', async () => {
    const request = new NextRequest('http://localhost/api/search-resource/add-resource', {
      method: 'POST',
      body: '{',
    });

    const response = await addResource(request);

    expect(checkAuthMetaDataMock).toHaveBeenCalledWith('add');
    expect(response.status).toBe(403);
    expect(selectedResourceCreateMock).not.toHaveBeenCalled();
  });
});
