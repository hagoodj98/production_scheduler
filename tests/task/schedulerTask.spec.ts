import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    productionOrder: {
      findUniqueOrThrow: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/database", () => ({
  prisma: prismaMock,
}));

import { loopThroughScheduledJobs } from "@/task/schedulerTask";

const flushAsync = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

type TestOrder = {
  id: number;
  dayMonthYear: Date;
  startTime: Date;
  endTime: Date;
  resourceStatus: string;
};

const makeOrder = (overrides: Partial<TestOrder>): TestOrder => ({
  id: 1,
  dayMonthYear: new Date("2026-03-08T00:00:00.000Z"),
  startTime: new Date("2026-03-08T10:00:00.000Z"),
  endTime: new Date("2026-03-08T11:00:00.000Z"),
  resourceStatus: "Processing",
  ...overrides,
});

describe("schedulerTask status transitions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not update when order is still Pending", async () => {
    vi.setSystemTime(new Date("2026-03-08T10:30:00.000Z"));
    prismaMock.productionOrder.findUniqueOrThrow.mockResolvedValueOnce({
      resourceStatus: "Pending",
    });

    loopThroughScheduledJobs([makeOrder({})] as never);
    await flushAsync();

    expect(prismaMock.productionOrder.update).not.toHaveBeenCalled();
  });

  it("sets status to Scheduled when now is before start time", async () => {
    vi.setSystemTime(new Date("2026-03-08T09:30:00.000Z"));
    prismaMock.productionOrder.findUniqueOrThrow.mockResolvedValueOnce({
      resourceStatus: "Processing",
    });
    prismaMock.productionOrder.update.mockResolvedValueOnce({});

    loopThroughScheduledJobs([makeOrder({})] as never);
    await flushAsync();

    expect(prismaMock.productionOrder.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { resourceStatus: "Scheduled" },
    });
  });

  it("sets status to Busy when now is within start/end window", async () => {
    vi.setSystemTime(new Date("2026-03-08T10:30:00.000Z"));
    prismaMock.productionOrder.findUniqueOrThrow.mockResolvedValueOnce({
      resourceStatus: "Processing",
    });
    prismaMock.productionOrder.update.mockResolvedValueOnce({});

    loopThroughScheduledJobs([makeOrder({})] as never);
    await flushAsync();

    expect(prismaMock.productionOrder.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { resourceStatus: "Busy" },
    });
  });

  it("sets status to Completed when now is after end time", async () => {
    vi.setSystemTime(new Date("2026-03-08T12:00:00.000Z"));
    prismaMock.productionOrder.findUniqueOrThrow.mockResolvedValueOnce({
      resourceStatus: "Processing",
    });
    prismaMock.productionOrder.update.mockResolvedValueOnce({});

    loopThroughScheduledJobs([makeOrder({})] as never);
    await flushAsync();

    expect(prismaMock.productionOrder.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { resourceStatus: "Completed" },
    });
  });
});
