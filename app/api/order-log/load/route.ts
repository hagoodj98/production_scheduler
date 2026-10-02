import { NextRequest, NextResponse } from 'next/server';
import { orderLog } from '@/lib/repositories/orderLog';
import { OrderLogData } from '@/app/components/types';
import { productionOrder } from '@/lib/repositories/productionOrder';
import { STATUSES } from '@/utils/GlobalVar';
export async function GET(req: NextRequest) {
  try {
    // Your logic to load the order log goes here
    const logs: OrderLogData[] = (await orderLog.getAllOrderLogs()).map((log) => {
      if (log.description.includes('Deleted') && log.order) {
        // Mark the resource status as 'Deleted' for this order
        log.order.resourceStatus = STATUSES.deleted;
      }
      return log;
    });

    // You can now use fetchProductionOrders to get the status of production orders if needed

    return NextResponse.json({ message: 'Order log loaded successfully', logs });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to load order log', error }, { status: 500 });
  }
}
