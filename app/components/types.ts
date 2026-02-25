import { Prisma } from "../generated/prisma/client";
import React from "react";

export type SlotStatus = "Pending" | "Available" | "Scheduled" | "Busy";

export type CellID = {
  row: string;
  column: string;
};

export type Resource = {
  id: number;
  resource_name: string | null;
};

export type TimeSlots = {
  id: number;
  slot: StartEndTime;
};
export type StartEndTime = {
  start: string;
  end: string;
};

interface ColumnFilter {
  id: string;
  value: unknown;
}
export type ColumnFiltersState = ColumnFilter[];

export type TimeJobSlot = {
  id: CellID;
  timeslot: StartEndTime;
  resource: string;
};

export type MapPending = {
  row: string;
  column: string;
};
export type TimeSlot = {
  hour: number | null;
  minute: number | null;
};
export type TimeRange = {
  startTimeSlot: Pick<TimeSlot, "hour" | "minute">;
  endTimeSlot: Pick<TimeSlot, "hour" | "minute">;
};

export type DayMonthYear = {
  month: number | null;
  day: number | null;
  year: number | null;
};
export type ProductionOrder = {
  dayMonthYear: DayMonthYear;
  timeRange: TimeRange;
  resource: ClientResource;
  orderId?: number | null; // Production order ID for tracking pending → processing transition
};
export type AvailableSlotPair = {
  name: ClientResource;
  value: number;
};

export type Slot = {
  id: {
    row: string;
    column: string;
  };
  timeslot: StartEndTime;
  name: string;
};
export type RequestScheduledJobs = Prisma.ProductionOrderGetPayload<{
  select: {
    id: true;
    dayMonthYear: true;
    startTime: true;
    endTime: true;
    resourceStatus: true;
  };
}>;

export type SlotContextType = {
  dataSlot: Slot;
  setDataSlot: React.Dispatch<React.SetStateAction<Slot>>;
  cellSlotArray: TimeJobSlot[];
  setCellSlotArray: React.Dispatch<React.SetStateAction<TimeJobSlot[]>>;
};

export type ResourcesContextType = {
  resourceData: Resource[];
  setResourceData: React.Dispatch<React.SetStateAction<Resource[]>>;
  selectedResourceIds: number[];
  setSelectedResourceIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectedStatus: string | null;
  setSelectedStatus: React.Dispatch<React.SetStateAction<string | null>>;
};

export type ClientResource = Omit<Resource, "id" | "status">;

export type GetAllSelectedResourcesContextType = {
  selectedResourceData: ClientResource[];
  setSelectedResourceData: React.Dispatch<
    React.SetStateAction<ClientResource[]>
  >;
};

export type ErrorMessage = {
  field: string;
  message: string;
};
export type CustomError = {
  message: string;
  status: number;
};

export type FormErrors = ErrorMessage[] | CustomError;
