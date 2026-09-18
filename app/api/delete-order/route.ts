import { productionOrder } from '@/lib/repositories';
import { NextRequest, NextResponse } from 'next/server';

import { requirePermission } from '@/utils/requirePermissionHelper';
// Deletes orders matching resourceId AND startTime.
// We use deleteMany because resourceId+startTime is not a unique constraint.
export async function DELETE(req: NextRequest) {
  try {
    await requirePermission('delete');

    const params = req.nextUrl.searchParams;
    const orderId = params.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }
    const result = await productionOrder.remove(Number(orderId));

    if (!result) {
      return NextResponse.json({ message: 'No matching order found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete order failed', error);
    return NextResponse.json({ error: 'Unauthorized to delete' }, { status: 403 });
  }
}
