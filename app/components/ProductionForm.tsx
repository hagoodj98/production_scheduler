"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { useGetAllSelectedResourcesContext } from "../context";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Notifier, { Severity } from "./Notifier";
import { ProductionOrder } from "./types";
import type { ErrorMessage } from "./types";
import * as z from "zod/v4";
import { CustomError } from "@/utils/CustomErrors";
import { productionOrderSchema } from "@/app/validation/productionOrderSchemas";

type PendingOrder = {
  id: number;
  dayMonthYear: Date;
  resourceStatus: string;
  resourceId: number;
  startTime: Date;
  endTime: Date;
  resourceName: string;
};
type OrderType = {
  pendingOrder?: PendingOrder;
};

const ProductionForm = ({ pendingOrder }: OrderType) => {
  /* build initial state using dayjs and conditional checks */
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

    resource: {
      resource_name: pendingOrder?.resourceName ?? null,
    },

    orderId: pendingOrder?.id ?? null,
  };
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [openNotifier, setOpenNotifier] = useState(false);
  const [notifierSeverity, setNotifierSeverity] = useState<Severity>();
  const [notifierMessage, setNotifierMessage] = useState("");
  const markhasRun = useRef(false);
  const [errors, setErrors] = useState<ErrorMessage[] | CustomError[]>([]);
  const { selectedResourceData } = useGetAllSelectedResourcesContext();
  const [productionOrder, setProductionOrder] = useState<ProductionOrder>(
    initialProductionOrder,
  );

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

  const validate = useCallback((): boolean => {
    try {
      const now = dayjs();
      const { dayMonthYear } = productionOrder;
      const time = productionOrder.timeRange;

      const startHour = time.startTimeSlot.hour;
      const startMinute = time.startTimeSlot.minute;

      const startDateTime = dayjs()
        .year(dayMonthYear.year!)
        .month(dayMonthYear.month! - 1)
        .date(dayMonthYear.day!)
        .hour(startHour!)
        .minute(startMinute!);

      //Check if start time is in the past
      if (!startDateTime.isBefore(now)) {
        productionOrderSchema.parse(productionOrder);
        return true;
      }
      setNotifierMessage("Cannot create order: This time is in the past");
      setNotifierSeverity("error");
      setOpenNotifier(true);
      return false;
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        const fieldErrors: ErrorMessage[] = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        setErrors(fieldErrors);
      }
      return false;
    }
  }, [productionOrder]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;
    try {
      setSubmitting(true);
      await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productionOrder }),
      });
      setNotifierMessage("Order created");
      setNotifierSeverity("success");
      setOpenNotifier(true);
      setSubmitting(false);
      router.push("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: ErrorMessage[] = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        setErrors(fieldErrors);
        return;
      }
      if (error instanceof CustomError) {
        const customError: CustomError = error;
        setErrors([customError]);
        return;
      }
      console.error("Submission error:", error);
      setNotifierMessage("Could not create order");
      setNotifierSeverity("error");
      setOpenNotifier(true);
      setSubmitting(false);
    }
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
      };
      try {
        const response = await fetch("/api/mark-pending", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order }),
        });
        const responseData = await response.json();

        setProductionOrder((prev) => ({
          ...prev,
          orderId: responseData.orderId,
        }));
      } catch (error) {
        console.error("Network error marking pending:", error);
      }
    };

    const isFormComplete = () => {
      const { dayMonthYear, timeRange, resource } = productionOrder;
      return (
        dayMonthYear.day !== null &&
        dayMonthYear.month !== null &&
        dayMonthYear.year !== null &&
        timeRange.startTimeSlot.hour !== null &&
        timeRange.startTimeSlot.minute !== null &&
        timeRange.endTimeSlot.hour !== null &&
        timeRange.endTimeSlot.minute !== null &&
        resource.resource_name !== null
      );
    };

    if (!isFormComplete()) return;

    if (pendingOrder) {
      markhasRun.current = true;
      const response = async () => {
        try {
          await fetch("/api/mark-pending", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order: productionOrder,
              existingOrder: true,
            }),
          });
        } catch (error) {
          console.error("Network error updating pending order:", error);
        }
      };
      response();
    }
    if (!markhasRun.current) {
      sendPendingStatus();
      markhasRun.current = true;
    }
  }, [pendingOrder, productionOrder]);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Create Order</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <FormControl fullWidth sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Resource
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={productionOrder.resource.resource_name ?? ""}
              onChange={handleChange}
              autoWidth
              label="Resource"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {selectedResourceData.map((chosenResource, index) => (
                <MenuItem
                  key={index}
                  value={chosenResource.resource_name ?? ""}
                >
                  {chosenResource.resource_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {Array.isArray(errors) &&
            errors.find(
              (err) => "field" in err && err.field === "resource.resource_name",
            ) && (
              <div className=" text-red-600">
                {
                  errors.find(
                    (err) =>
                      "field" in err && err.field === "resource.resource_name",
                  )?.message
                }
              </div>
            )}
          <div className="mt-3">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  name="calendar"
                  onAccept={handleDayAccept}
                  label="Pick Date"
                  value={
                    productionOrder.dayMonthYear.month
                      ? dayjs()
                          .year(
                            productionOrder.dayMonthYear.year ?? dayjs().year(),
                          )
                          .month((productionOrder.dayMonthYear.month ?? 1) - 1)
                          .date(productionOrder.dayMonthYear.day ?? 1)
                      : null
                  }
                />
                {Array.isArray(errors) &&
                  errors.find((err) => {
                    return "field" in err && err.field === "dayMonthYear.month";
                  }) && (
                    <div className=" text-red-600">
                      {
                        errors.find(
                          (err) =>
                            "field" in err &&
                            err.field === "dayMonthYear.month",
                        )?.message
                      }
                    </div>
                  )}
                {Array.isArray(errors) &&
                  errors.find(
                    (err) => "field" in err && err.field === "dayMonthYear.day",
                  ) && (
                    <div className=" text-red-600">
                      {
                        errors.find(
                          (err) =>
                            "field" in err && err.field === "dayMonthYear.day",
                        )?.message
                      }
                    </div>
                  )}
                {Array.isArray(errors) &&
                  errors.find(
                    (err) =>
                      "field" in err && err.field === "dayMonthYear.year",
                  ) && (
                    <div className=" text-red-600">
                      {
                        errors.find(
                          (err) =>
                            "field" in err && err.field === "dayMonthYear.year",
                        )?.message
                      }
                    </div>
                  )}
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]}>
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
              />
              {Array.isArray(errors) &&
                errors.find(
                  (err) =>
                    "field" in err &&
                    err.field === "timeRange.startTimeSlot.hour",
                ) && (
                  <div className=" text-red-600">
                    {
                      errors.find(
                        (err) =>
                          "field" in err &&
                          err.field === "timeRange.startTimeSlot.hour",
                      )?.message
                    }
                  </div>
                )}
              {Array.isArray(errors) &&
                errors.find(
                  (err) =>
                    "field" in err &&
                    err.field === "timeRange.startTimeSlot.minute",
                ) && (
                  <div className=" text-red-600">
                    {
                      errors.find(
                        (err) =>
                          "field" in err &&
                          err.field === "timeRange.startTimeSlot.minute",
                      )?.message
                    }
                  </div>
                )}
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
              />
              {Array.isArray(errors) &&
                errors.find(
                  (err) =>
                    "field" in err &&
                    err.field === "timeRange.endTimeSlot.hour",
                ) && (
                  <div className=" text-red-600">
                    {
                      errors.find(
                        (err) =>
                          "field" in err &&
                          err.field === "timeRange.endTimeSlot.hour",
                      )?.message
                    }
                  </div>
                )}
              {Array.isArray(errors) &&
                errors.find(
                  (err) =>
                    "field" in err &&
                    err.field === "timeRange.endTimeSlot.minute",
                ) && (
                  <div className=" text-red-600">
                    {
                      errors.find(
                        (err) =>
                          "field" in err &&
                          err.field === "timeRange.endTimeSlot.minute",
                      )?.message
                    }
                  </div>
                )}
            </DemoContainer>
          </LocalizationProvider>
        </div>

        <div className="md:col-span-2 flex items-center gap-3">
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Creating…" : "Create Order"}
          </Button>
          <Button variant="outlined" onClick={() => router.push("/")}>
            Cancel
          </Button>
        </div>
      </form>
      <Notifier
        open={openNotifier}
        onClose={() => setOpenNotifier(false)}
        severity={notifierSeverity}
        message={notifierMessage}
      />
    </div>
  );
};

export default ProductionForm;
