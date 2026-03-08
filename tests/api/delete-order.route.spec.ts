import { beforeEach, describe, expect, it, vi } from "vitest";

const { productionOrderRepository } = vi.hoisted(() => ({
  productionOrderRepository: {
    remove: vi.fn(),
  },
}));

vi.mock("@/lib/repositories", () => ({
  productionOrderRepository,
}));

import { POST } from "@/app/api/delete-order/route";

describe("POST /api/delete-order", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when orderId is missing", async () => {
    const req = new Request("http://localhost/api/delete-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await POST(req as never);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body).toEqual({ error: "orderId is required" });
    expect(productionOrderRepository.remove).not.toHaveBeenCalled();
  });

  it("deletes an order and returns 200", async () => {
    productionOrderRepository.remove.mockResolvedValueOnce({ id: 11 });

    const req = new Request("http://localhost/api/delete-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: 11 }),
    });

    const res = await POST(req as never);
    const body = await res.json();

    expect(productionOrderRepository.remove).toHaveBeenCalledWith(11);
    expect(res.status).toBe(200);
    expect(body).toEqual({ message: "Order deleted successfully" });
  });

  it("returns 500 when repository remove throws", async () => {
    productionOrderRepository.remove.mockRejectedValueOnce(
      new Error("delete failed"),
    );

    const req = new Request("http://localhost/api/delete-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: 11 }),
    });

    const res = await POST(req as never);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({ error: "Internal server error" });
  });
});
