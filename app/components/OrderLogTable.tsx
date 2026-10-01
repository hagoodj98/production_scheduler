'use client';
import React from 'react';
import { ColumnDef, createColumnHelper, tableFeatures, useTable } from '@tanstack/react-table';
import { OrderLogData } from '@/app/components/types';
import { useTanStackTableDevtools } from '@tanstack/react-table-devtools/production';

type TableData = {
  data: OrderLogData[];
};

const features = tableFeatures({});

const columnHelper = createColumnHelper<typeof features, OrderLogData>();

const columns = columnHelper.columns([
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
const OrderLogTable = ({ data }: TableData) => {
  //>{`Order ID: ${log.orderId}, Created At: ${time}, Employee: ${log.employee.name}, Description: ${log.description}, current status:`}</div>
  const table = useTable({
    key: 'users-table',
    data,
    columns,
    features,
  });
  // useTanStackTableDevtools(table, { enabled: false });
  return (
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
          <tr key={row.id}>
            {row.getAllCells().map((cell) => (
              <td className="px-4 py-2 border text-center" key={cell.id}>
                <table.FlexRender cell={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderLogTable;
