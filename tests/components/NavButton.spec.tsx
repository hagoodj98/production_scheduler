/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import NavButton from "@/app/components/NavButton";
import { withAppProviders } from "./testUtils";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    // Render a plain anchor in tests.
    <a href={href}>{children}</a>
  ),
}));

describe("NavButton", () => {
  it("renders a navigation link with expected label", () => {
    render(
      withAppProviders(
        <NavButton resourceLabel="Create Order" pageNav="/assign-resource" />,
      ),
    );

    expect(
      screen.getByRole("button", { name: /create order/i }),
    ).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /create order/i });
    expect(link).toHaveAttribute("href", "/assign-resource");
  });
});
