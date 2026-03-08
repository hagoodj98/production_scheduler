import { beforeEach, describe, expect, it, vi } from "vitest";

const { resourceRepository } = vi.hoisted(() => ({
  resourceRepository: {
    findByNamePrefix: vi.fn(),
  },
}));

vi.mock("@/lib/repositories", () => ({
  resourceRepository,
}));

import { GET } from "@/app/api/search-resources/route";

describe("GET /api/search-resources", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries repository by name prefix and returns resources", async () => {
    const resources = [
      { id: 1, resource_name: "Press 1" },
      { id: 2, resource_name: "Press 2" },
    ];
    resourceRepository.findByNamePrefix.mockResolvedValueOnce(resources);

    const req = new Request("http://localhost/api/search-resources?name=Pr", {
      method: "GET",
    });

    const res = await GET(req as never);
    const body = await res.json();

    expect(resourceRepository.findByNamePrefix).toHaveBeenCalledWith("Pr");
    expect(res.status).toBe(200);
    expect(body).toEqual({ resources });
  });
});
