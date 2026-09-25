import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { productionOrder, checkAuthMetaData } = vi.hoisted(() => ({
  productionOrder: {
    remove: vi.fn(),
  },
  checkAuthMetaData: vi.fn(),
}));

vi.mock('@/lib/repositories', () => ({
  productionOrder,
}));
vi.mock('@/utils/CheckAuthHelper', () => ({ checkAuthMetaData }));

import { DELETE } from '@/app/api/delete-order/route';

describe('DELETE /api/delete-order', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkAuthMetaData.mockResolvedValue('Delete Admin');
  });

  it('returns 400 when orderId is missing', async () => {
    const req = new NextRequest('http://localhost/api/delete-order', { method: 'DELETE' });

    const res = await DELETE(req as never);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body).toEqual({ error: 'orderId is required' });
    expect(productionOrder.remove).not.toHaveBeenCalled();
  });

  it('deletes an order and returns 200', async () => {
    productionOrder.remove.mockResolvedValueOnce({ id: 11 });

    const req = new NextRequest('http://localhost/api/delete-order?orderId=11', {
      method: 'DELETE',
    });

    const res = await DELETE(req as never);
    const body = await res.json();

    expect(productionOrder.remove).toHaveBeenCalledWith(11);
    expect(res.status).toBe(200);
    expect(body).toEqual({ message: 'Order deleted successfully' });
  });

  it('returns 500 when repository remove throws', async () => {
    productionOrder.remove.mockRejectedValueOnce(new Error('delete failed'));

    const req = new NextRequest('http://localhost/api/delete-order?orderId=11', {
      method: 'DELETE',
    });

    const res = await DELETE(req as never);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({ error: 'delete failed' });
  });
});
