import { handleError } from '@/utils/ErrorHandlingHelper';
import { selectedResource } from '@/lib/repositories';
import { NextResponse } from 'next/server';

// API route for loading all selected resources along with their associated production orders.
export async function GET() {
  try {
    // Fetch all selected resources along with their associated production orders from the repository
    const productionOrders = await selectedResource.findAllWithOrders();
    // Filter out resources that have no active production orders (i.e., orders that are not marked deleted)
    const jobs = productionOrders.filter((resource) => {
      return (
        resource.productionOrders.length > 0 &&
        resource.productionOrders.some((order) => !order.deletedAt)
      );
    });
    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
