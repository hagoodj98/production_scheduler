'use client';

import React, { useCallback, useEffect, useState, useReducer, useRef } from 'react';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { PickerValue } from '@mui/x-date-pickers/internals';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Notifier, { initialNotifierState, notifierReducer, Severity } from './ui/snackbar';
import FormHeader from './ui/FormHeader';
import { ProductionOrder, OrderType } from './types';
import type { ErrorMessage } from './types';
import * as z from 'zod/v4';
import { CustomError } from '@/utils/CustomErrors';
import { productionOrderSchema } from '@/app/validation/productionOrderSchemas';
import { timeScheduleValidator } from '../validation/timeScheduleValidator';
import { API_ENDPOINTS } from '../config/api';
import { STATUSES } from '@/utils/GlobalVar';

const ProductionForm = ({ pendingOrder }: OrderType) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [notifierState, dispatchNotifier] = useReducer(notifierReducer, initialNotifierState);
  const [errors, setErrors] = useState<ErrorMessage[]>([]);
  const [customError, setCustomError] = useState<{ error: string } | null>(null);
  const initialProductionOrder: ProductionOrder = {
    dayMonthYear: pendingOrder
      ? {
          month: dayjs(pendingOrder.dayMonthYear).month() + 1, // month() is 0-based
          day: dayjs(pendingOrder.dayMonthYear).date(),
          year: dayjs(pendingOrder.dayMonthYear).year(),
        }
      : { month: null, day: null, year: null },

    timeRange: {
      startTimeSlot: pendingOrder?.startTime
        ? {
            hour: dayjs(pendingOrder.startTime).hour(),
            minute: dayjs(pendingOrder.startTime).minute(),
          }
        : { hour: null, minute: null },

      endTimeSlot: pendingOrder?.endTime
        ? {
            hour: dayjs(pendingOrder.endTime).hour(),
            minute: dayjs(pendingOrder.endTime).minute(),
          }
        : { hour: null, minute: null },
    },
    assignedEmployeeId: pendingOrder?.employeeAssigneeID ?? '',
    resource: {
      resource_name: pendingOrder?.resourceName ?? null,
    },

    orderId: pendingOrder?.id ?? 0,
  };

  const [productionOrder, setProductionOrder] = useState<ProductionOrder>(initialProductionOrder);
  // Last order data successfully synced to mark-pending; prevents remounting an unchanged form from resending it
  const lastSyncedOrderRef = useRef<string>(JSON.stringify(initialProductionOrder));
  const [workers, setWorkers] = useState<{ employeeId: string; name: string }[]>([]);
  const [resources, setResources] = useState<{ resource_name: string }[]>([]);
  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await fetch(API_ENDPOINTS.LOAD_EMPLOYEES);
      const data: { employeeId: string; name: string }[] = await res.json();
      setWorkers(data);
    };
    const fetchResources = async () => {
      const res = await fetch(API_ENDPOINTS.LOAD_RESOURCES);
      const data = await res.json();
      // Assuming you have a context or state to store the resources
      setResources(data.Resources);
    };

    fetchEmployees();
    fetchResources();
  }, []);
  const handleTimeAcceptOnStart = (value: PickerValue) => {
    if (value && dayjs.isDayjs(value)) {
      const hour = value.hour();
      const minute = value.minute();
      setProductionOrder((prev) => ({
        ...prev,
        timeRange: {
          ...prev.timeRange,
          startTimeSlot: { hour, minute },
        },
      }));
    }
  };

  const handleTimeAcceptOnEnd = (value: PickerValue) => {
    if (value && dayjs.isDayjs(value)) {
      const hour = value.hour();
      const minute = value.minute();
      setProductionOrder((prev) => ({
        ...prev,
        timeRange: {
          ...prev.timeRange,
          endTimeSlot: { hour, minute },
        },
      }));
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    const resourceName = event.target.value;
    setProductionOrder((prev) => ({
      ...prev,
      resource: { ...prev.resource, resource_name: resourceName },
    }));
  };

  const handleDayAccept = (value: PickerValue) => {
    if (value && dayjs.isDayjs(value)) {
      const month = value.month() + 1;
      const day = value.date();
      const year = value.year();

      setProductionOrder((prev) => ({
        ...prev,
        dayMonthYear: { ...prev.dayMonthYear, month, day, year },
      }));
    }
  };

  const validate = useCallback(() => {
    try {
      const { dayMonthYear, timeRange } = productionOrder;

      productionOrderSchema.parse(productionOrder);

      timeScheduleValidator(dayMonthYear, timeRange);
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        return error;
      }
      if (error instanceof CustomError) {
        return error;
      }
    }
  }, [productionOrder]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Before sending the request, validate the data again to ensure that any changes made after the initial validation are also checked. This is important because the user might have changed some fields after the first validation, and we want to catch any new errors before making the API call.
    const error = validate();
    if (error instanceof z.ZodError) {
      const fieldErrors: ErrorMessage[] = error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      setErrors(fieldErrors);
      return;
    } else if (error instanceof CustomError) {
      setCustomError({ error: error.message });
      return;
    } else if (error) {
      setCustomError({ error: 'An unknown error occurred' });
      return;
    }

    try {
      setSubmitting(true);
      // If the pending order is already scheduled, we need to reschedule it
      if (pendingOrder) {
        await fetch(API_ENDPOINTS.RESCHEDULE_ORDER, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productionOrder }),
        });
      } else {
        const response = await fetch(API_ENDPOINTS.SCHEDULE_ORDER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productionOrder }),
        });
        if (!response.ok) {
          dispatchNotifier({ type: 'setNotifierMessage', value: 'Failed to create order' });
          dispatchNotifier({ type: 'setNotifierSeverity', value: Severity.error });
          dispatchNotifier({ type: 'setOpenNotifier', value: true });
          setSubmitting(false);
          return;
        }
      }
      dispatchNotifier({ type: 'setNotifierMessage', value: 'Order is created! Redirecting...' });
      dispatchNotifier({ type: 'setNotifierSeverity', value: Severity.success });
      dispatchNotifier({ type: 'setOpenNotifier', value: true });
      setTimeout(() => {
        router.push('/');
      }, 3000);
      setSubmitting(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: ErrorMessage[] = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        setErrors(fieldErrors);
        return;
      }
      if (error instanceof CustomError) {
        const customError: CustomError = error;
        setCustomError({ error: customError.message });
        return;
      }
      console.error('Submission error:', error);
      dispatchNotifier({ type: 'setNotifierMessage', value: 'Could not create order' });
      dispatchNotifier({ type: 'setNotifierSeverity', value: Severity.error });
      dispatchNotifier({ type: 'setOpenNotifier', value: true });
      setSubmitting(false);
    }
  };
  const handleEmployeeChange = (event: SelectChangeEvent) => {
    const employeeId = event.target.value;

    setProductionOrder((prev) => ({
      ...prev,
      assignedEmployeeId: employeeId,
    }));
  };
  const handleStartTimeChange = (value: PickerValue) => {
    if (value && dayjs.isDayjs(value)) {
      const hour = value.hour();
      const minute = value.minute();
      setProductionOrder((prev) => ({
        ...prev,
        timeRange: {
          ...prev.timeRange,
          startTimeSlot: { hour, minute },
        },
      }));
    }
  };
  const handleEndTimeChange = (value: PickerValue) => {
    if (value && dayjs.isDayjs(value)) {
      const hour = value.hour();
      const minute = value.minute();
      setProductionOrder((prev) => ({
        ...prev,
        timeRange: {
          ...prev.timeRange,
          endTimeSlot: { hour, minute },
        },
      }));
    }
  };

  // Keep original pending behaviour
  useEffect(() => {
    const sendPendingStatus = async () => {
      const order: ProductionOrder = {
        dayMonthYear: { ...productionOrder.dayMonthYear },
        timeRange: { ...productionOrder.timeRange },
        resource: { ...productionOrder.resource },
        orderId: productionOrder.orderId,
        assignedEmployeeId: productionOrder.assignedEmployeeId,
      };
      try {
        // Before sending the request, validate the data again to ensure that any changes made after the initial validation are also checked. This is important because the user might have changed some fields after the first validation, and we want to catch any new errors before making the API call.
        const error = validate();
        if (error instanceof z.ZodError) {
          const fieldErrors: ErrorMessage[] = error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          }));
          setErrors(fieldErrors);
          return;
        } else if (error instanceof CustomError) {
          setCustomError({ error: error.message });
          return;
        } else if (error) {
          setCustomError({ error: 'An unknown error occurred' });
          return;
        }
        // Send the request to mark the order as pending
        const response = await fetch(API_ENDPOINTS.MARK_PENDING, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order }),
        });
        if (!response.ok) {
          const data = await response.json();
          // Handle the error response from the server
          setCustomError({ error: data.error });
          console.error('Failed to mark order as pending:', data.error);
          return;
        }
        // Update the local state with the new order ID returned from the server
        const responseData = await response.json();
        setProductionOrder((prev) => ({
          ...prev,
          orderId: responseData.orderId,
        }));
      } catch (error) {
        console.error('Network error marking pending:', error);
      }
    };

    // Check if the form is complete before allowing submission
    const isFormComplete = () => {
      const { dayMonthYear, timeRange, resource, assignedEmployeeId } = productionOrder;
      return (
        dayMonthYear.day !== null &&
        dayMonthYear.month !== null &&
        dayMonthYear.year !== null &&
        timeRange.startTimeSlot.hour !== null &&
        timeRange.startTimeSlot.minute !== null &&
        timeRange.endTimeSlot.hour !== null &&
        timeRange.endTimeSlot.minute !== null &&
        resource.resource_name !== null &&
        assignedEmployeeId !== null
      );
    };

    if (!isFormComplete()) return;

    // Skip the call if this exact order was already synced (e.g. remounting with no changes)
    const orderSnapshot = JSON.stringify(productionOrder);
    if (orderSnapshot === lastSyncedOrderRef.current) return;

    if (pendingOrder) {
      const response = async () => {
        try {
          const response = await fetch(API_ENDPOINTS.MARK_PENDING, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              order: productionOrder,
              existingOrder: true,
            }),
          });
          if (!response.ok) {
            const data = await response.json();
            setCustomError({ error: data.error });
            console.error('Failed to update pending order:', data.error);
            return;
          }
          lastSyncedOrderRef.current = orderSnapshot;
        } catch (error) {
          console.error('Network error updating pending order:', error);
        }
      };
      response();
    } else {
      if (!productionOrder.orderId) {
        sendPendingStatus();
      }
    }
  }, [pendingOrder, productionOrder, validate]);

  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <FormHeader
        icon={<EventNoteOutlinedIcon />}
        eyebrow="Production scheduler"
        title={pendingOrder ? 'Update production order' : 'Schedule production'}
        description={
          pendingOrder
            ? 'Adjust the assignment and timing for this order.'
            : 'Choose a resource, an employee, and a production window.'
        }
        titleAs="h1"
        className="border-b border-slate-200 border-l-4 border-l-emerald-600 bg-slate-50 px-6 py-5"
        badge={
          pendingOrder && (
            <span className="shrink-0 rounded border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900">
              Editing order
            </span>
          )
        }
      />

      {customError?.error && (
        <div className="p-4 mt-4">
          <p className="text-sm text-red-700">{customError?.error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6 px-6 py-6">
          <section aria-labelledby="assignment-heading">
            <div className="mb-4">
              <h2 id="assignment-heading" className="text-base font-semibold text-slate-900">
                Assignment
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Select the resource and employee for this order.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <FormControl fullWidth>
                  <InputLabel id="resource-label">Resource</InputLabel>
                  <Select
                    labelId="resource-label"
                    id="resource-select"
                    value={productionOrder.resource.resource_name ?? ''}
                    onChange={handleChange}
                    label="Resource"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {resources.map((resource, index) => (
                      <MenuItem key={index} value={resource.resource_name ?? ''}>
                        {resource.resource_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {Array.isArray(errors) &&
                  errors.find(
                    (err) => 'field' in err && err.field === 'resource.resource_name',
                  ) && (
                    <p className="mt-1 text-sm text-red-700">
                      {
                        errors.find(
                          (err) => 'field' in err && err.field === 'resource.resource_name',
                        )?.message
                      }
                    </p>
                  )}
              </div>
              <div>
                <FormControl fullWidth>
                  <InputLabel id="employee-label">Assign employee</InputLabel>
                  <Select
                    labelId="employee-label"
                    id="employee-select"
                    value={productionOrder.assignedEmployeeId ?? ''}
                    onChange={handleEmployeeChange}
                    label="Assigned employee"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {workers.map((worker, index) => (
                      <MenuItem key={index} value={worker.employeeId ?? ''}>
                        {worker.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {Array.isArray(errors) &&
                  errors.find((err) => 'field' in err && err.field === 'assignedEmployeeId') && (
                    <p className="mt-1 text-sm text-red-700">
                      {
                        errors.find((err) => 'field' in err && err.field === 'assignedEmployeeId')
                          ?.message
                      }
                    </p>
                  )}
              </div>
            </div>
          </section>

          <section aria-labelledby="schedule-heading" className="border-t border-slate-200 pt-6">
            <div className="mb-4">
              <h2 id="schedule-heading" className="text-base font-semibold text-slate-900">
                Production window
              </h2>
              <p className="mt-1 text-sm text-slate-600">Set the date and start and end times.</p>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="min-w-0">
                  <DatePicker
                    name="calendar"
                    onAccept={handleDayAccept}
                    label="Production date"
                    value={
                      productionOrder.dayMonthYear.month
                        ? dayjs()
                            .year(productionOrder.dayMonthYear.year ?? dayjs().year())
                            .month((productionOrder.dayMonthYear.month ?? 1) - 1)
                            .date(productionOrder.dayMonthYear.day ?? 1)
                        : null
                    }
                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                  />
                  {Array.isArray(errors) &&
                    errors.find((error) => error.field === 'dayMonthYear.month') && (
                      <p className="text-red-500 text-sm">
                        {errors.find((error) => error.field === 'dayMonthYear.month')?.message}
                      </p>
                    )}
                  {Array.isArray(errors) &&
                    errors.find((error) => error.field === 'dayMonthYear.day') && (
                      <p className="text-red-500 text-sm">
                        {errors.find((error) => error.field === 'dayMonthYear.day')?.message}
                      </p>
                    )}
                  {Array.isArray(errors) &&
                    errors.find((error) => error.field === 'dayMonthYear.year') && (
                      <p className="text-red-500 text-sm">
                        {errors.find((error) => error.field === 'dayMonthYear.year')?.message}
                      </p>
                    )}
                </div>
                <div className="min-w-0">
                  <TimePicker
                    onAccept={handleTimeAcceptOnStart}
                    label="Start time"
                    onChange={handleStartTimeChange}
                    value={
                      productionOrder.timeRange.startTimeSlot.hour !== null &&
                      productionOrder.timeRange.startTimeSlot.minute !== null
                        ? dayjs()
                            .hour(productionOrder.timeRange.startTimeSlot.hour)
                            .minute(productionOrder.timeRange.startTimeSlot.minute)
                        : null
                    }
                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                  />
                  {Array.isArray(errors) &&
                  errors.find((error) => error.field === 'timeRange.startTimeSlot.hour') ? (
                    <p className="text-red-500 text-sm">
                      {
                        errors.find((error) => error.field === 'timeRange.startTimeSlot.hour')
                          ?.message
                      }
                    </p>
                  ) : null}
                  {Array.isArray(errors) &&
                  errors.find((error) => error.field === 'timeRange.startTimeSlot.minute') ? (
                    <p className="text-red-500 text-sm">
                      {
                        errors.find((error) => error.field === 'timeRange.startTimeSlot.minute')
                          ?.message
                      }
                    </p>
                  ) : null}
                </div>
                <div className="min-w-0">
                  <TimePicker
                    onAccept={handleTimeAcceptOnEnd}
                    label="End time"
                    onChange={handleEndTimeChange}
                    value={
                      productionOrder.timeRange.endTimeSlot.hour !== null &&
                      productionOrder.timeRange.endTimeSlot.minute !== null
                        ? dayjs()
                            .hour(productionOrder.timeRange.endTimeSlot.hour)
                            .minute(productionOrder.timeRange.endTimeSlot.minute)
                        : null
                    }
                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                  />
                  {Array.isArray(errors) &&
                  errors.find((error) => error.field === 'timeRange.endTimeSlot.hour') ? (
                    <p className="text-red-500 text-sm">
                      {
                        errors.find((error) => error.field === 'timeRange.endTimeSlot.hour')
                          ?.message
                      }
                    </p>
                  ) : null}
                  {Array.isArray(errors) &&
                  errors.find((error) => error.field === 'timeRange.endTimeSlot.minute') ? (
                    <p className="text-red-500 text-sm">
                      {
                        errors.find((error) => error.field === 'timeRange.endTimeSlot.minute')
                          ?.message
                      }
                    </p>
                  ) : null}
                </div>
              </div>
            </LocalizationProvider>
          </section>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outlined" onClick={() => router.push('/')}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting
              ? pendingOrder
                ? 'Updating…'
                : 'Creating…'
              : pendingOrder
                ? 'Update order'
                : 'Create order'}
          </Button>
        </footer>
      </form>
      <Notifier
        open={notifierState.openNotifier}
        onClose={() => dispatchNotifier({ type: 'setOpenNotifier', value: false })}
        severity={notifierState.notifierSeverity}
        message={notifierState.notifierMessage}
      />
    </div>
  );
};

export default ProductionForm;
