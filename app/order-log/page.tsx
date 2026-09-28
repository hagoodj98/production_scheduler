import { orderLog } from '@/lib/repositories/orderLog';
const page = async () => {
  const logs = await orderLog.getAllOrderLogs();
  return (
    <div>
      <h1>Order Log</h1>
      <ul>
        {logs.map((log) => (
          <li
            key={log.id}
          >{`Order ID: ${log.orderId}, Created At: ${log.order.creationDate}, Employee: ${log.employee.name}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default page;
