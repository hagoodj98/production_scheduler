'use client';

import { Cell, Pie, PieChart, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { OrderProps } from './types';
import { STATUSES, STATUS_COLORS } from '../../utils/GlobalVar';
import { API_ENDPOINTS } from '../config/api';
import useSWR from 'swr';
import fetcher from '../../utils/fetcher';

const Recharts: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { data: fetchedData } = useSWR(API_ENDPOINTS.LOAD_ORDERS, fetcher, {
    refreshInterval: 5000, // poll every 5 seconds
  });
  // compute flattened orders and counts by status
  const calculateProductionOrders = () => {
    // flatten all production orders from the fetched jobs
    const flattened = ((fetchedData as { jobs: OrderProps[] })?.jobs ?? []).flatMap(
      (job: OrderProps) =>
        job.productionOrders?.map((p) => ({
          ...p,
          resource_name: job.resource_name,
        })) ?? [],
    );
    // calculate counts of production orders by status.
    //Recharts expects the data in the format of an array of objects with 'name' and 'value' properties.
    const statusCounts = Object.values(STATUSES).map((s) => ({
      name: s,
      value: flattened.filter((p) => p.resourceStatus === s).length,
    }));
    // return both the counts and the total number of production orders
    const total = statusCounts.reduce((acc, c) => acc + c.value, 0);
    return { chartData: statusCounts, total };
  };
  // handle selection of a status slice in the chart
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const onSliceClick = (name: string) => {
    // toggle selection of the clicked status
    if (selectedStatus === name) {
      setSelectedStatus(null);
    } else {
      setSelectedStatus(name);
    }
  };

  const { chartData, total } = calculateProductionOrders();
  if (!chartData) return <div>Loading chart...</div>;

  const width = compact ? 160 : 320;
  const height = compact ? 120 : 220;
  const innerRadius = compact ? 28 : 60;
  const outerRadius = compact ? 44 : 80;

  return (
    <div className={`flex items-center ${compact ? 'gap-2' : ''}`}>
      {/* center label */}
      <div className="flex flex-col justify-center ml-3">
        <div className="text-sm font-medium">Total</div>
        <div className="text-xl font-semibold">{total}</div>
        {selectedStatus && <div className="text-xs mt-1">Filtered: {selectedStatus}</div>}

        <div className="mt-2 flex flex-col ">
          {chartData.map((status) => (
            <button
              key={`legend-${status.name}`}
              onClick={() => status.value > 0 && onSliceClick(status.name)}
              className={`flex items-center gap-2 text-sm px-2 py-1 rounded transition-colors duration-200 ease-in-out ${status.value === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              aria-pressed={selectedStatus === status.name}
              aria-disabled={status.value === 0}
              title={`${status.value} orders`}
            >
              <span
                className="w-3 h-3 rounded-sm"
                style={{ background: STATUS_COLORS[status.name] }}
              />
              <span>{status.name}</span>
              <span className="ml-2 text-xs text-gray-500">{status.value}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={4}
              dataKey="value"
              onClick={(e) => onSliceClick(e.payload.name)}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={STATUS_COLORS[entry.name] ?? '#cccccc'}
                  stroke={selectedStatus === entry.name ? '#000' : 'none'}
                  strokeWidth={selectedStatus === entry.name ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Recharts;
