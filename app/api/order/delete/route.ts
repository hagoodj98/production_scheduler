import { productionOrder } from '@/lib/repositories';
import { NextRequest, NextResponse } from 'next/server';
import { checkAuthMetaData } from '@/utils/CheckAuthHelper';
import { handleError } from '@/utils/ErrorHandlingHelper';
import PERMISSIONS from '@/utils/Permissions';
// API route for deleting a production order by orderId.
export async function DELETE(req: NextRequest) {
  try {
    // Check if the user has the necessary permission to delete a production order
    await checkAuthMetaData(PERMISSIONS.delete?.name);
    // Extract the orderId from the query parameters for further processing
    const params = req.nextUrl.searchParams;
    const orderId = params.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }
    // Attempt to delete the production order with the specified orderId
    const result = await productionOrder.remove(Number(orderId));

    if (!result) {
      return NextResponse.json({ message: 'No matching order found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    // Handle any errors that occur during the deletion process
    return handleError(error);
  }
}
