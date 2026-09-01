import { productionOrder } from '@/lib/repositories';
import { NextResponse } from 'next/server';

export async function GET() {
  const resources = await productionOrder.findAll();

  return NextResponse.json({ resources });
}
