import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { CustomError } from '@/utils/CustomErrors';

const {
  checkAuthMetaDataMock,
  productionOrderCreateMock,
  productionOrderSoftRemoveMock,
  productionOrderUpdateMock,
  selectedResourceCreateMock,
  selectedResourceFindMock,
  orderLogCreateMock,
} = vi.hoisted(() => ({
  checkAuthMetaDataMock: vi.fn(),
  productionOrderCreateMock: vi.fn(),
  productionOrderSoftRemoveMock: vi.fn(),
  productionOrderUpdateMock: vi.fn(),
  selectedResourceCreateMock: vi.fn(),
  selectedResourceFindMock: vi.fn(),
  orderLogCreateMock: vi.fn(),
}));

vi.mock('@/utils/CheckAuthHelper', () => ({ checkAuthMetaData: checkAuthMetaDataMock }));
vi.mock('@/lib/repositories', () => ({
  productionOrder: {
    create: productionOrderCreateMock,
    softRemove: productionOrderSoftRemoveMock,
    update: productionOrderUpdateMock,
  },
  selectedResource: {
    create: selectedResourceCreateMock,
    findByNameOrThrow: selectedResourceFindMock,
  },
  orderLog: {
    createOrderLog: orderLogCreateMock,
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
vi.mock('@/lib/repositories/orderLog', () => ({
  orderLog: {
    createOrderLog: orderLogCreateMock,
  },
}));

import { DELETE } from '@/app/api/order/delete/route';
import { POST as addResource } from '@/app/api/resource/add/route';
import { POST as createPendingOrder } from '@/app/api/order/mark-pending/route';
import { PATCH as rescheduleOrder } from '@/app/api/order/reschedule/route';

describe('server-side permission guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAuthMetaDataMock.mockRejectedValue(new CustomError('Forbidden', 403));
  });

  it('blocks deletion before the repository is called', async () => {
    const request = new NextRequest('http://localhost/api/order/delete?orderId=11', {
      method: 'DELETE',
    });

    const response = await DELETE(request);

    expect(checkAuthMetaDataMock).toHaveBeenCalledWith('delete', undefined, '11');
    expect(response.status).toBe(403);
    expect(productionOrderSoftRemoveMock).not.toHaveBeenCalled();
  });

  it('blocks rescheduling before parsing or updating the order', async () => {
    const request = new NextRequest('http://localhost/api/order/reschedule', {
      method: 'PATCH',
      body: '{',
    });

    const response = await rescheduleOrder(request);

    expect(checkAuthMetaDataMock).toHaveBeenCalledWith('reschedule');
    expect(response.status).toBe(403);
    expect(productionOrderUpdateMock).not.toHaveBeenCalled();
  });

  it('blocks order assignment before creating an order', async () => {
    const request = new NextRequest('http://localhost/api/order/mark-pending', {
      method: 'POST',
      body: '{',
    });

    const response = await createPendingOrder(request);

    expect(checkAuthMetaDataMock).toHaveBeenCalledWith('assign', undefined, null);
    expect(response.status).toBe(403);
    expect(productionOrderCreateMock).not.toHaveBeenCalled();
  });

  it('blocks resource creation before writing to the repository', async () => {
    const request = new NextRequest('http://localhost/api/resource/add', {
      method: 'POST',
      body: '{',
    });

    const response = await addResource(request);

    expect(checkAuthMetaDataMock).toHaveBeenCalledWith('add');
    expect(response.status).toBe(403);
    expect(selectedResourceCreateMock).not.toHaveBeenCalled();
  });
});
