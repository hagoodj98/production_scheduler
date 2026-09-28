import { orderLog } from '@/lib/repositories/orderLog';
const page = async () => {
  const logs = await orderLog.getAllOrderLogs();
  return (
    <div>
      <h1>Order Log</h1>
      <ul>
        {logs.map((log) => {
          const time = new Date(log.order.creationDate).toLocaleString();
          return (
            <li
              key={log.id}
            >{`Order ID: ${log.orderId}, Created At: ${time}, Employee: ${log.employee.name}`}</li>
          );
        })}
      </ul>
    </div>
  );
};

export default page;
