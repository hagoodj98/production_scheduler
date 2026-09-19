import { handleError } from '@/utils/ErrorHandlingHelper';
import { productionOrder } from '@/lib/repositories';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const resources = await productionOrder.findAll();
    return NextResponse.json({ resources });
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}
