import * as z from "zod/v4";

export const productionOrderSchema = z.object({
  dayMonthYear: z.object({
    month: z.coerce.number().min(1, "Please select month"),
    day: z.coerce.number().min(1, "Please select day"),
    year: z.coerce.number().min(1, "Please select year"),
  }),
  timeRange: z.object({
    startTimeSlot: z.object({
      hour: z.coerce.number().min(1, "please select start time hour"),
      minute: z.preprocess(
        (val) => (val === null || val === undefined ? -1 : Number(val)),
        z.number().min(0, "please select start time minute"),
      ),
    }),
    endTimeSlot: z.object({
      hour: z.coerce.number().min(1, "please select end time hour"),
      minute: z.preprocess(
        (val) => (val === null || val === undefined ? -1 : Number(val)),
        z.number().min(0, "please select end time minute"),
      ),
    }),
  }),
  resource: z.object({
    resource_name: z.preprocess(
      (val) => (val === null || val === undefined ? "" : val),
      z.string().min(1, "Please select a resource"),
    ),
  }),
  orderId: z.number().nullable().optional(),
});

export const markPendingRequestSchema = z.object({
  order: productionOrderSchema,
  existingOrder: z.boolean().optional(),
});
