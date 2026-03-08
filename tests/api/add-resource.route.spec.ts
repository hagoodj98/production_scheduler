import { beforeEach, describe, expect, it, vi } from "vitest";

const { selectedResourceRepository } = vi.hoisted(() => ({
  selectedResourceRepository: {
    create: vi.fn(),
  },
}));

vi.mock("@/lib/repositories", () => ({
  selectedResourceRepository,
}));

import { POST } from "@/app/api/add-resource/route";

describe("POST /api/add-resource", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a selected resource and returns 200", async () => {
    selectedResourceRepository.create.mockResolvedValue({
      id: 1,
      resource_name: "CNC Machine 99",
    });

    const req = new Request("http://localhost/api/add-resource", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource_name: "CNC Machine 99" }),
    });

    const res = await POST(req as never);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ message: "received endpoint" });
    expect(selectedResourceRepository.create).toHaveBeenCalledWith(
      "CNC Machine 99",
    );
  });

  it("returns 500 when repository create fails", async () => {
    selectedResourceRepository.create.mockRejectedValueOnce(
      new Error("db write failed"),
    );

    const req = new Request("http://localhost/api/add-resource", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource_name: "CNC Machine 99" }),
    });

    const res = await POST(req as never);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body).toEqual({ message: "Failed to add resource" });
  });
});
