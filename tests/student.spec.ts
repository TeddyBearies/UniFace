import { expect, test } from "@playwright/test";
import { hasRoleCredentials, loginAs, selectFirstUsableOption } from "./helpers/auth";

test.describe("Student flows", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasRoleCredentials("student"), "Set E2E_STUDENT_EMAIL and E2E_STUDENT_PASSWORD.");
    await loginAs(page, "student");
  });

  test("TC-S1 - student dashboard loads", async ({ page }) => {
    await expect(page).toHaveURL(/\/student\/dashboard$/);
    await expect(page.getByRole("heading", { name: /welcome back!/i })).toBeVisible();
    await expect(page.getByText(/attendance percentage/i)).toBeVisible();
    await expect(page.getByText(/attendance summary/i)).toBeVisible();
  });

  test("TC-S2 - attendance history page opens from the dashboard", async ({ page }) => {
    await page.getByRole("link", { name: /view attendance history/i }).click();

    await expect(page).toHaveURL(/\/student\/attendance-history$/);
    await expect(page.getByRole("heading", { name: /attendance history/i })).toBeVisible();
    await expect(page.getByLabel(/course/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /apply filters/i })).toBeVisible();
  });

  test("TC-S3 - attendance filters can be applied without breaking the page", async ({ page }) => {
    await page.goto("/student/attendance-history");

    const courseSelect = page.getByLabel(/course/i);
    await selectFirstUsableOption(courseSelect);
    await page.getByRole("button", { name: /apply filters/i }).click();

    await expect(page.getByLabel(/attendance history table/i)).toBeVisible();
    await expect(page.getByLabel(/attendance summary metrics/i)).toBeVisible();
  });
});
