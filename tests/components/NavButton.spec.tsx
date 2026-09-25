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

vi.mock("@/app/components/AdminAccessForm", () => ({
  default: () => null,
}));

describe("NavButton", () => {
  it("renders the admin access button when the user is unauthenticated", () => {
    render(
      withAppProviders(
        <NavButton resourceLabel="Create Order" pageNav="/assign-resource" />,
      ),
    );

    expect(screen.getByRole("button", { name: /create order/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /create order/i })).not.toBeInTheDocument();
  });
});
