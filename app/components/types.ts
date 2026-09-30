import { Prisma } from '../generated/prisma/client';
import React from 'react';
import { Severity } from './ui/snackbar';

export type SlotStatus = 'Pending' | 'Available' | 'Scheduled' | 'Busy';

export type CellID = {
  row: string;
  column: string;
};
export type NotifierState = {
  openNotifier: boolean;
  notifierMessage: string;
  notifierSeverity: Severity | undefined;
};
export type OrderProps = {
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
};
export type AllPossibleResource = {
  id: number;
  resource_name: string;
};
export type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resourceStatus: string;
  resource_name?: string;
  resourceId?: number;
  [key: string]: unknown;
};
export type AdminFormState = {
  formData: {
    employee_id: string;
    password: string;
    admin_key: string;
  };
};
export type LoadJob = {
  resource_name: string;
  productionOrders?: Array<{ resourceStatus: string } & Record<string, unknown>>;
};

export type PendingOrder = {
  id: number | null;
  dayMonthYear: Date;
  resourceStatus: string;
  resourceId: number;
  startTime: Date;
  endTime: Date;
  resourceName: string;
  employeeAssigneeID: string;
};
export type OrderType = {
  pendingOrder?: PendingOrder;
};

export type AdminFormAction =
  | { type: 'setEmployee_id'; value: string }
  | { type: 'setPassword'; value: string }
  | { type: 'setAdmin_key'; value: string };

export type NotifierAction =
  | { type: 'setOpenNotifier'; value: boolean }
  | { type: 'setNotifierMessage'; value: string }
  | { type: 'setNotifierSeverity'; value: Severity | undefined };

export type Resource = {
  id: number;
  resource_name: string | null;
};
export type PayloadSession = {
  employee_id: string;
  role: string;
  expiresAt: Date;
  name: string;
  permissions: string[];
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
  startTimeSlot: Pick<TimeSlot, 'hour' | 'minute'>;
  endTimeSlot: Pick<TimeSlot, 'hour' | 'minute'>;
};
export type ProductionOrderWriteInput = {
  dayMonthYear: Date;
  startTime: Date;
  endTime: Date;
  resourceId: number;
  resourceStatus: string;
  employeeAssigneeID: string;
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
  orderId: number; // Production order ID for tracking pending → processing transition
  assignedEmployeeId: string;
};
export type AvailableSlotPair = {
  name: ClientResource;
  value: number;
};
export type AuthData = {
  username: string;
  password: string;
};
export type Employee = {
  employeeId: string;
  name: string;
  email: string;
  password: string;
  role: string;
  admin_key?: string | null;
  userPermissions?: string[];
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
    resourceId: true;
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

export type ClientResource = Omit<Resource, 'id' | 'status'>;

export type AuthContextType = {
  userIsAuthenticated: {
    name: string | null;
    state: 'idle' | 'checking' | 'authenticated' | 'unauthenticated';
  };
  setUserIsAuthenticated: React.Dispatch<
    React.SetStateAction<{
      name: string | null;
      state: 'idle' | 'checking' | 'authenticated' | 'unauthenticated';
    }>
  >;
};

export type ErrorMessage = {
  field?: string;
  message: string;
};
export type CustomError = {
  message: string;
  status: number;
};

export type FormErrors = ErrorMessage[] | CustomError;
