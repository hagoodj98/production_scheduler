import { NextResponse, NextRequest } from 'next/server';
import { requirePermission } from '@/utils/requirePermissionHelper';

export async function GET(req: NextRequest) {
  try {
    await requirePermission('reschedule');
    const params = req.nextUrl.searchParams;
    const orderId = params.get('orderId');
    console.log('Order ID:', orderId);

    // Perform your rescheduling logic here, e.g., update the order in the database

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error editing order:', error);
    return NextResponse.json(
      { success: false, error: 'Unauthorized to reschedule' },
      { status: 403 },
    );
  }

  // Perform your update logic here, e.g., update the order in the database
}
