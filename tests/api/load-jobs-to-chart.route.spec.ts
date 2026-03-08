import { beforeEach, describe, expect, it, vi } from "vitest";

const { selectedResourceRepository } = vi.hoisted(() => ({
  selectedResourceRepository: {
    findAllWithOrders: vi.fn(),
  },
}));

vi.mock("@/lib/repositories", () => ({
  selectedResourceRepository,
}));

import { GET } from "@/app/api/load-jobs-to-chart/route";

describe("GET /api/load-jobs-to-chart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns selected resources and nested orders", async () => {
    const payload = [
      {
        id: 1,
        resource_name: "CNC Machine 1",
        productionOrders: [
          {
            id: 10,
            dayMonthYear: new Date("2026-03-08T00:00:00.000Z"),
            startTime: new Date("2026-03-08T08:00:00.000Z"),
            endTime: new Date("2026-03-08T09:00:00.000Z"),
            resourceStatus: "Pending",
            resourceId: 1,
          },
        ],
      },
    ];

    selectedResourceRepository.findAllWithOrders.mockResolvedValueOnce(payload);

    const res = await GET();
    const body = await res.json();

    expect(selectedResourceRepository.findAllWithOrders).toHaveBeenCalledTimes(
      1,
    );
    expect(res.status).toBe(200);
    expect(body).toEqual({
      ResourceProductionOrders: [
        {
          id: 1,
          resource_name: "CNC Machine 1",
          productionOrders: [
            {
              id: 10,
              dayMonthYear: "2026-03-08T00:00:00.000Z",
              startTime: "2026-03-08T08:00:00.000Z",
              endTime: "2026-03-08T09:00:00.000Z",
              resourceStatus: "Pending",
              resourceId: 1,
            },
          ],
        },
      ],
    });
  });
});
