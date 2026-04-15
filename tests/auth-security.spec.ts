import { expect, test } from "@playwright/test";
import {
  clickLogout,
  expectRedirectedToLogin,
  hasRoleCredentials,
  loginAs,
} from "./helpers/auth";

test.describe("Authentication and Security", () => {
  test("TC-L1 - login with empty credentials shows an error", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: /^login$/i }).click();

    await expect(page.getByRole("status")).toContainText(
      "Please enter your email address and password.",
    );
    await expect(page).toHaveURL(/\/login$/);
  });

  test("TC-L2 - login with invalid credentials is blocked", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel(/email address/i).fill("wrong.user@university.edu");
    await page.getByLabel(/password/i).fill("not-the-right-password");
    await page.getByRole("button", { name: /^login$/i }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("status")).not.toContainText("Login successful");
  });

  test("TC-L3 - valid student credentials redirect to the student dashboard", async ({ page }) => {
    test.skip(!hasRoleCredentials("student"), "Set E2E_STUDENT_EMAIL and E2E_STUDENT_PASSWORD.");

    await loginAs(page, "student");
    await expect(page.getByRole("heading", { name: /welcome back!/i })).toBeVisible();
    await expect(page.getByText(/attendance percentage/i)).toBeVisible();
  });

  test("TC-L3 - valid instructor credentials redirect to the instructor dashboard", async ({ page }) => {
    test.skip(
      !hasRoleCredentials("instructor"),
      "Set E2E_INSTRUCTOR_EMAIL and E2E_INSTRUCTOR_PASSWORD.",
    );

    await loginAs(page, "instructor");
    await expect(page.getByRole("heading", { name: /welcome back,/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /assigned courses/i })).toBeVisible();
  });

  test("TC-L3 - valid admin credentials redirect to the admin dashboard", async ({ page }) => {
    test.skip(!hasRoleCredentials("admin"), "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD.");

    await loginAs(page, "admin");
    await expect(page.getByRole("heading", { name: /system overview/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /quick management links/i })).toBeVisible();
  });

  test("TC-L4 - protected routes redirect unauthenticated users to login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expectRedirectedToLogin(page);
  });

  test("TC-SEC1 - student cannot access an admin page", async ({ page }) => {
    test.skip(!hasRoleCredentials("student"), "Set E2E_STUDENT_EMAIL and E2E_STUDENT_PASSWORD.");

    await loginAs(page, "student");
    await page.goto("/admin/dashboard");

    await expectRedirectedToLogin(page);
  });

  test("TC-SEC2 - direct restricted URL entry is blocked", async ({ page }) => {
    test.skip(
      !hasRoleCredentials("instructor"),
      "Set E2E_INSTRUCTOR_EMAIL and E2E_INSTRUCTOR_PASSWORD.",
    );

    await loginAs(page, "instructor");
    await page.goto("/admin/reset-face-data");

    await expectRedirectedToLogin(page);
  });

  test("TC-SEC3 - logged-out users cannot revisit a protected page", async ({ page }) => {
    test.skip(!hasRoleCredentials("admin"), "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD.");

    await loginAs(page, "admin");
    await clickLogout(page);

    await page.goto("/admin/dashboard");
    await expectRedirectedToLogin(page);
  });
});
