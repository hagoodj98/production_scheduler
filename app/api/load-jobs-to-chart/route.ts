import { selectedResource } from '@/lib/repositories';
import { NextResponse } from 'next/server';

export async function GET() {
  const ResourceProductionOrders = await selectedResource.findAllWithOrders();

  return NextResponse.json({ ResourceProductionOrders }, { status: 200 });
}
