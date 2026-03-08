/** @vitest-environment jsdom */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Recharts from "@/app/components/Recharts";
import { withAppProviders } from "./testUtils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockPayload = {
  ResourceProductionOrders: [
    {
      id: 1,
      resource_name: "CNC Machine 1",
      productionOrders: [
        {
          id: 11,
          dayMonthYear: "2026-03-08T00:00:00.000Z",
          startTime: "2026-03-08T09:00:00.000Z",
          endTime: "2026-03-08T10:00:00.000Z",
          resourceStatus: "Pending",
          resourceId: 1,
        },
        {
          id: 12,
          dayMonthYear: "2026-03-08T00:00:00.000Z",
          startTime: "2026-03-08T10:00:00.000Z",
          endTime: "2026-03-08T11:00:00.000Z",
          resourceStatus: "Completed",
          resourceId: 1,
        },
      ],
    },
  ],
};

describe("Recharts", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          ({
            ok: true,
            json: async () => mockPayload,
          }) as Response,
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders computed totals from API data", async () => {
    render(withAppProviders(<Recharts compact />));

    await waitFor(() => {
      expect(screen.getByText("Total")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("toggles selected status when a legend item is clicked", async () => {
    const user = userEvent.setup();
    render(withAppProviders(<Recharts compact />));

    const pendingButton = await screen.findByRole("button", {
      name: /pending/i,
    });
    await user.click(pendingButton);
    expect(await screen.findByText(/filtered: pending/i)).toBeInTheDocument();

    await user.click(pendingButton);
    await waitFor(() => {
      expect(screen.queryByText(/filtered: pending/i)).not.toBeInTheDocument();
    });
  });

  it("renders status colors that match status mapping", async () => {
    render(withAppProviders(<Recharts compact />));

    const pendingButton = await screen.findByRole("button", {
      name: /pending/i,
    });
    const completedButton = await screen.findByRole("button", {
      name: /completed/i,
    });

    const pendingSwatch = pendingButton.querySelector("span.w-3.h-3");
    const completedSwatch = completedButton.querySelector("span.w-3.h-3");

    expect(pendingSwatch).toHaveAttribute(
      "style",
      expect.stringContaining("255, 187, 40"),
    );
    expect(completedSwatch).toHaveAttribute(
      "style",
      expect.stringContaining("46, 204, 113"),
    );
  });
});
