import { productionOrder } from '@/lib/repositories';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '../../../lib/session';
import { PayloadSession } from '@/app/components/types';
// Deletes orders matching resourceId AND startTime.
// We use deleteMany because resourceId+startTime is not a unique constraint.
export async function DELETE(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const orderId = params.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'No session cookie found' },
        { status: 401 },
      );
    }
    const payloadSession = (await decrypt(sessionCookie)) as PayloadSession;
    if (!payloadSession.permissions.includes('delete')) {
      return NextResponse.json(
        { success: false, error: 'You are unauthorized to delete this order' },
        { status: 403 },
      );
    }

    const result = await productionOrder.remove(Number(orderId));

    if (!result) {
      return NextResponse.json({ message: 'No matching order found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete order failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
