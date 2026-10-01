import { orderLog } from '@/lib/repositories/orderLog';
import { OrderLogData } from '@/app/components/types';
import Table from '../components/OrderLogTable';
const page = async () => {
  const logs: OrderLogData[] = await orderLog.getAllOrderLogs();

  return (
    <div>
      <h1>Order Log</h1>
      <Table data={logs} />
    </div>
  );
};

export default page;
