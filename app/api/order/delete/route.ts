import { productionOrder } from '@/lib/repositories';
import { NextRequest, NextResponse } from 'next/server';
import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
import { orderLog } from '@/lib/repositories/orderLog';
import { handleError } from '@/utils/ErrorHandlingHelper';
import { PERMISSIONS } from '@/utils/GlobalVar';
// API route for deleting a production order by orderId.
export async function DELETE(req: NextRequest) {
  try {
    // Check if the user has the necessary permission to delete a production order
    const params = req.nextUrl.searchParams;
    const orderId = params.get('orderId');

    const { employeeId } = await checkAuthMetaData(
      PERMISSIONS.delete?.name,
      undefined,
      Number(orderId),
    );
    // Extract the orderId from the query parameters for further processing

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }
    // Attempt to delete the production order and create an order log simultaneously
    await productionOrder.softRemove(Number(orderId));
    await orderLog.createOrderLog(Number(orderId), employeeId, `Deleted order ${orderId}`);

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    // Handle any errors that occur during the deletion process
    return handleError(error);
  }
}
