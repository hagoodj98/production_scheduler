import { test, expect } from "@playwright/test";
import { gotoHomeAndWaitForJobs, mockLoadJobs } from "./helpers";

const todayAt = (hour: number, minute = 0) => {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

test("home page renders scheduler controls", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Production Scheduler" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /add resource/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /navigate to create order/i }),
  ).toBeVisible();
  await expect(page.getByText("Total")).toBeVisible();
});

test("shows warning notifier when editing a Completed order", async ({ page }) => {
  await mockLoadJobs(page, [
    {
      id: 1,
      resource_name: "CNC Machine 1",
      productionOrders: [
        {
          id: 101,
          dayMonthYear: todayAt(0, 0),
          startTime: todayAt(8, 0),
          endTime: todayAt(9, 0),
          resourceStatus: "Completed",
          resourceId: 1,
        },
      ],
    },
  ]);

  await gotoHomeAndWaitForJobs(page);

  const event = page.getByText(/CNC Machine 1 at/i).first();
  await expect(event).toBeVisible();
  await event.hover();

  await page.getByRole("button", { name: "Edit" }).first().click();

  await expect(
    page.getByText("Busy/Completed/Scheduled orders cannot be edited"),
  ).toBeVisible();
});

test("shows validation error on add resource page", async ({ page }) => {
  await page.goto("/add-resource");

  await page.getByRole("button", { name: "Add Resource" }).click();

  await expect(page.getByText("Please enter a valid resource name")).toBeVisible();
});

test("shows network error snackbar when add resource API fails", async ({ page }) => {
  await page.route("**/api/add-resource", async (route) => {
    await route.abort("failed");
  });

  await page.goto("/add-resource");

  await page.getByLabel("Resource name").fill("QA Resource");
  await page.getByRole("button", { name: "Add Resource" }).click();

  await expect(page.getByText("Could not add resource")).toBeVisible();
});

test("shows warning notifier when deleting a Completed order", async ({ page }) => {
  await mockLoadJobs(page, [
    {
      id: 2,
      resource_name: "CNC Machine 2",
      productionOrders: [
        {
          id: 202,
          dayMonthYear: todayAt(0, 0),
          startTime: todayAt(10, 0),
          endTime: todayAt(11, 0),
          resourceStatus: "Completed",
          resourceId: 2,
        },
      ],
    },
  ]);

  await gotoHomeAndWaitForJobs(page);

  const event = page.getByText(/CNC Machine 2 at/i).first();
  await expect(event).toBeVisible();
  await event.hover();

  await page.getByRole("button", { name: "delete" }).first().click();

  await expect(
    page.getByText("Busy/Completed/Scheduled orders cannot be deleted"),
  ).toBeVisible();
});

test("renders Busy status with red calendar event color", async ({ page }) => {
  await mockLoadJobs(page, [
    {
      id: 3,
      resource_name: "CNC Machine 3",
      productionOrders: [
        {
          id: 303,
          dayMonthYear: todayAt(0, 0),
          startTime: todayAt(12, 0),
          endTime: todayAt(13, 0),
          resourceStatus: "Busy",
          resourceId: 3,
        },
      ],
    },
  ]);

  await gotoHomeAndWaitForJobs(page);

  const event = page.locator(".rbc-event", {
    hasText: /CNC Machine 3 at/i,
  });
  await expect(event.first()).toBeVisible();
  await expect(event.first()).toHaveCSS("background-color", "rgb(255, 77, 77)");
});
