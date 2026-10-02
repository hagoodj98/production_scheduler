import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { productionOrder, orderLog, checkAuthMetaData } = vi.hoisted(() => ({
  productionOrder: {
    softRemove: vi.fn(),
  },
  orderLog: {
    createOrderLog: vi.fn(),
  },
  checkAuthMetaData: vi.fn(),
}));

vi.mock('@/lib/repositories', () => ({
  productionOrder,
}));
vi.mock('@/lib/repositories/orderLog', () => ({
  orderLog,
}));
vi.mock('@/utils/CheckAuthHelper', () => ({ checkAuthMetaData }));

import { DELETE } from '@/app/api/order/delete/route';

describe('DELETE /api/order/delete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAuthMetaData.mockResolvedValue({ employeeId: 'emp-1' });
    orderLog.createOrderLog.mockResolvedValue({ id: 1 });
  });

  it('returns 400 when orderId is missing', async () => {
    const req = new NextRequest('http://localhost/api/order/delete', { method: 'DELETE' });

    const res = await DELETE(req as never);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body).toEqual({ error: 'orderId is required' });
    expect(productionOrder.softRemove).not.toHaveBeenCalled();
  });

  it('deletes an order and returns 200', async () => {
    productionOrder.softRemove.mockResolvedValueOnce({ id: 11 });

    const req = new NextRequest('http://localhost/api/order/delete?orderId=11', {
      method: 'DELETE',
    });

    const res = await DELETE(req as never);
    const body = await res.json();

    expect(productionOrder.softRemove).toHaveBeenCalledWith(11);
    expect(res.status).toBe(200);
    expect(body).toEqual({ message: 'Order deleted successfully' });
  });

  it('returns 500 when repository softRemove throws', async () => {
    productionOrder.softRemove.mockRejectedValueOnce(new Error('delete failed'));

    const req = new NextRequest('http://localhost/api/order/delete?orderId=11', {
      method: 'DELETE',
    });

    const res = await DELETE(req as never);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({ error: 'delete failed' });
  });
});
