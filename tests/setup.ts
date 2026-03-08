import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

class ResizeObserverMock {
  observe() {
    // noop for jsdom
  }
  unobserve() {
    // noop for jsdom
  }
  disconnect() {
    // noop for jsdom
  }
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;
}

afterEach(() => {
  cleanup();
});
