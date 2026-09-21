import { NextResponse, NextRequest } from 'next/server';
import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
import { handleError } from '@/utils/ErrorHandlingHelper';

export async function PATCH(req: NextRequest) {
  try {
    // Check if the user has the required permission to reschedule orders
    await checkAuthMetaData('reschedule');
    const params = req.nextUrl.searchParams;
    const orderId = params.get('orderId');
    console.log('Order ID:', orderId);

    // Perform your rescheduling logic here, e.g., update the order in the database

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }

  // Perform your update logic here, e.g., update the order in the database
}
