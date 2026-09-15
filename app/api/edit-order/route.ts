import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import type { PayloadSession } from '@/app/components/types';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'No session cookie found' },
        { status: 401 },
      );
    }
    const payloadSession = (await decrypt(sessionCookie)) as PayloadSession;

    console.log(payloadSession);

    if (!payloadSession.permissions.includes('edit')) {
      return NextResponse.json(
        { success: false, error: 'You are unauthorized to edit this order' },
        { status: 403 },
      );
    }

    const params = req.nextUrl.searchParams;
    const orderId = params.get('orderId');
    console.log('Order ID:', orderId);

    // Perform your update logic here, e.g., update the order in the database

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error editing order:', error);
    return NextResponse.json({ success: false, error: 'Error editing order' }, { status: 500 });
  }

  // Perform your update logic here, e.g., update the order in the database
}
