import { NextResponse } from 'next/server';
import { productionOrder } from '@/lib/repositories';
import { loopThroughScheduledJobs } from '@/task/schedulerTask';
import { handleError } from '@/utils/ErrorHandlingHelper';

export async function POST() {
  try {
    const getAllRequestedJobs = await productionOrder.findAllForStatusCheck();
    loopThroughScheduledJobs(getAllRequestedJobs);
    return NextResponse.json({ message: 'updated orders' });
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
}
