"use client";

import { Cell, Pie, PieChart, Tooltip, ResponsiveContainer } from "recharts";
import type { ClientResource } from "./types";
import { useEffect, useMemo } from "react";

import {
  useGetAllSelectedResourcesContext,
  useResourcesContext,
} from "../context";
import useSWR from "swr";

const STATUS_ORDER = [
  "Processing",
  "Pending",
  "Scheduled",
  "Busy",
  "Completed",
];
const STATUS_COLORS: Record<string, string> = {
  Processing: "#cccccc",
  Pending: "#FFBB28",
  Scheduled: "#007bff",
  Busy: "#DB441A",
  Completed: "#2ecc71",
};

type LoadJob = {
  resource_name: string;
  productionOrders?: Array<
    { resourceStatus: string } & Record<string, unknown>
  >;
};
interface OrderProps {
  id: number;
  resource_name: string;
  productionOrders: {
    id: number;
    dayMonthYear: Date;
    startTime: Date;
    endTime: Date;
    resourceStatus: string;
    resourceId: number;
  }[];
}
const Recharts: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { setSelectedResourceData } = useGetAllSelectedResourcesContext();
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API ${url} failed: ${res.status}`);
    return await res.json();
  };
  const { selectedStatus, setSelectedStatus } = useResourcesContext();
  const { data: fetchedData } = useSWR<{
    ResourceProductionOrders: OrderProps[];
  }>("/api/load-jobs-to-chart", fetcher, {
    refreshInterval: 5000, // poll every 5 seconds
  });
  // compute flattened orders and counts by status
  const { chartData, total } = useMemo(() => {
    const flattened = (fetchedData?.ResourceProductionOrders ?? []).flatMap(
      (r: LoadJob) =>
        r.productionOrders?.map((p) => ({
          ...p,
          resource_name: r.resource_name,
        })) ?? [],
    );
    const counts = STATUS_ORDER.map((s) => ({
      name: s,
      value: flattened.filter((p) => p.resourceStatus === s).length,
    }));
    const total = counts.reduce((acc, c) => acc + c.value, 0);
    return { chartData: counts, total };
  }, [fetchedData?.ResourceProductionOrders]);

  // keep selectedResourceData up to date for other components
  useEffect(() => {
    const onlyName: ClientResource[] | undefined =
      fetchedData?.ResourceProductionOrders?.map((job) => ({
        resource_name: job.resource_name,
      })) ?? [];
    setSelectedResourceData(onlyName ?? []);
  }, [fetchedData?.ResourceProductionOrders, setSelectedResourceData]);

  const onSliceClick = (entry: { name?: string } | undefined) => {
    const name = entry?.name;
    if (!name) return;
    if (selectedStatus === name) {
      setSelectedStatus(null);
    } else {
      setSelectedStatus(name);
    }
  };

  if (!chartData) return <div>Loading chart...</div>;

  const width = compact ? 160 : 320;
  const height = compact ? 120 : 220;
  const innerRadius = compact ? 28 : 60;
  const outerRadius = compact ? 44 : 80;

  return (
    <div className={`flex items-center ${compact ? "gap-2" : ""}`}>
      {/* center label */}
      <div className="flex flex-col justify-center ml-3">
        <div className="text-sm font-medium">Total</div>
        <div className="text-xl font-semibold">{total}</div>
        {selectedStatus && (
          <div className="text-xs mt-1">Filtered: {selectedStatus}</div>
        )}

        <div className="mt-2 flex flex-col ">
          {chartData.map((entry) => (
            <button
              key={`legend-${entry.name}`}
              onClick={() => entry.value > 0 && onSliceClick(entry)}
              className={`flex items-center gap-2 text-sm px-2 py-1 rounded transition-colors duration-200 ease-in-out ${entry.value === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"} ${selectedStatus === entry.name ? "bg-gray-100 ring-1 ring-offset-1 ring-gray-200" : ""}`}
              aria-pressed={selectedStatus === entry.name}
              aria-disabled={entry.value === 0}
              title={`${entry.value} orders`}
            >
              <span
                className="w-3 h-3 rounded-sm"
                style={{ background: STATUS_COLORS[entry.name] }}
              />
              <span>{entry.name}</span>
              <span className="ml-2 text-xs text-gray-500">{entry.value}</span>
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
              onClick={(e) => onSliceClick(e as { name?: string } | undefined)}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={STATUS_COLORS[entry.name] ?? "#cccccc"}
                  stroke={selectedStatus === entry.name ? "#000" : "none"}
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
