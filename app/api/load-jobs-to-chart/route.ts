import { handleError } from '@/utils/ErrorHandlingHelper';
import { selectedResource } from '@/lib/repositories';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const ResourceProductionOrders = await selectedResource.findAllWithOrders();
    return NextResponse.json({ ResourceProductionOrders }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
