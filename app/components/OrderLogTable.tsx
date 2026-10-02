'use client';

import useSWR from 'swr';
import { createColumnHelper, tableFeatures, useTable } from '@tanstack/react-table';
import { OrderLogData } from '@/app/components/types';
import NavButton from './NavButton';
import fetcher from '@/utils/fetcher';
import { API_ENDPOINTS } from '../config/api';
import { STATUSES } from '@/utils/GlobalVar';
const features = tableFeatures({});

const columnHelper = createColumnHelper<typeof features, OrderLogData>();

const columns = columnHelper.columns([
  columnHelper.accessor('id', {
    header: 'Log#',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('orderId', {
    header: 'Order ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('creationDate', {
    header: 'Created At',
  }),
  columnHelper.accessor('employee.name', {
    header: 'Initiator',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('employee.role', {
    header: 'Init Role',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('order.employee.name', {
    header: 'Assigned Employee',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('order.employee.role', {
    header: 'Role',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('order.resource.resource_name', {
    header: 'Job',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('order.resourceStatus', {
    header: 'Current Status',
    cell: (info) => info.getValue(),
  }),
]);
const OrderLogTable = () => {
  const { data: fetchedData } = useSWR(API_ENDPOINTS.LOAD_ORDER_LOGS, fetcher, {
    refreshInterval: 5000, // poll every 5 seconds
  });

  const table = useTable({
    //key: 'user-table',
    data: (fetchedData as { logs: OrderLogData[] })?.logs ?? [],
    columns,
    features,
  });

  return (
    <div>
      <table className="container mx-auto border-collapse border border-gray-200">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className="px-4 py-2 border" key={header.id}>
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={`${
                row.getAllCells().some((cell) => cell.getValue() === STATUSES.completed)
                  ? 'bg-(--status-completed) text-white'
                  : row.getAllCells().some((cell) => cell.getValue() === STATUSES.busy)
                    ? 'bg-(--status-busy) text-white'
                    : row.getAllCells().some((cell) => cell.getValue() === STATUSES.deleted)
                      ? 'bg-(--status-deleted) text-white'
                      : row.getAllCells().some((cell) => cell.getValue() === STATUSES.scheduled)
                        ? 'bg-(--status-scheduled) text-white'
                        : row.getAllCells().some((cell) => cell.getValue() === STATUSES.pending)
                          ? 'bg-(--status-pending) text-white'
                          : row
                                .getAllCells()
                                .some((cell) => cell.getValue() === STATUSES.processing)
                            ? 'bg-(--status-processing) text-white'
                            : ''
              }`}
            >
              {row.getAllCells().map((cell) => (
                <td className={`p-2 border text-center `} key={cell.id}>
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="my-4 flex justify-center ">
        <NavButton pageNav="/" resourceLabel="Back To Dashboard" />
      </div>
    </div>
  );
};

export default OrderLogTable;
