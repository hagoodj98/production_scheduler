import { describe, expect, it } from "vitest";
import {
  markPendingRequestSchema,
  productionOrderSchema,
} from "@/app/validation/productionOrderSchemas";
import { resourceSchema } from "@/app/validation/resourceSchemas";

describe("productionOrderSchema", () => {
  it("accepts a valid production order", () => {
    const result = productionOrderSchema.safeParse({
      dayMonthYear: { month: 2, day: 19, year: 2026 },
      timeRange: {
        startTimeSlot: { hour: 9, minute: 15 },
        endTimeSlot: { hour: 10, minute: 45 },
      },
      resource: { resource_name: "Mixer A" },
      orderId: 1,
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing resource name", () => {
    const result = productionOrderSchema.safeParse({
      dayMonthYear: { month: 2, day: 19, year: 2026 },
      timeRange: {
        startTimeSlot: { hour: 9, minute: 15 },
        endTimeSlot: { hour: 10, minute: 45 },
      },
      resource: { resource_name: "" },
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid minute values", () => {
    const result = productionOrderSchema.safeParse({
      dayMonthYear: { month: 2, day: 19, year: 2026 },
      timeRange: {
        startTimeSlot: { hour: 9, minute: null },
        endTimeSlot: { hour: 10, minute: 45 },
      },
      resource: { resource_name: "Mixer A" },
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid month", () => {
    const result = productionOrderSchema.safeParse({
      dayMonthYear: { month: 0, day: 19, year: 2026 },
      timeRange: {
        startTimeSlot: { hour: 9, minute: 15 },
        endTimeSlot: { hour: 10, minute: 45 },
      },
      resource: { resource_name: "Mixer A" },
    });

    expect(result.success).toBe(false);
  });
});

describe("markPendingRequestSchema", () => {
  it("accepts a valid request", () => {
    const result = markPendingRequestSchema.safeParse({
      order: {
        dayMonthYear: { month: 2, day: 19, year: 2026 },
        timeRange: {
          startTimeSlot: { hour: 9, minute: 15 },
          endTimeSlot: { hour: 10, minute: 45 },
        },
        resource: { resource_name: "Mixer A" },
        orderId: 7,
      },
      existingOrder: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing order payload", () => {
    const result = markPendingRequestSchema.safeParse({
      existingOrder: false,
    });

    expect(result.success).toBe(false);
  });
});

describe("resourceSchema", () => {
  it("accepts a valid resource", () => {
    const result = resourceSchema.safeParse({ resource_name: "Lathe" });

    expect(result.success).toBe(true);
  });

  it("rejects empty resource name", () => {
    const result = resourceSchema.safeParse({ resource_name: "" });

    expect(result.success).toBe(false);
  });
});
