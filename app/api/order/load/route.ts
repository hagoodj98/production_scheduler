import { handleError } from '@/utils/ErrorHandlingHelper';
import { selectedResource } from '@/lib/repositories';
import { NextResponse } from 'next/server';

// API route for loading all selected resources along with their associated production orders.
export async function GET() {
  try {
    // Fetch all selected resources along with their associated production orders from the repository
    const ResourceProductionOrders = await selectedResource.findAllWithOrders();
    return NextResponse.json({ ResourceProductionOrders }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
