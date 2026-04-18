import { expect, test } from "@playwright/test";
import {
  hasRoleCredentials,
  isReportDownloadTestingEnabled,
  loginAs,
} from "./helpers/auth";

test.describe("Non-functional and report checks", () => {
  test("TC-NF1 - main pages load without obvious rendering errors", async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on("pageerror", (error) => pageErrors.push(error));

    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();

    if (hasRoleCredentials("student")) {
      await loginAs(page, "student");
      await page.goto("/student/dashboard");
      await expect(page.getByRole("heading", { name: /welcome back!/i })).toBeVisible();
      await page.goto("/student/attendance-history");
      await expect(page.getByRole("heading", { name: /attendance history/i })).toBeVisible();
    }

    if (hasRoleCredentials("instructor")) {
      await loginAs(page, "instructor");
      await page.goto("/instructor/dashboard");
      await expect(page.getByRole("heading", { name: /assigned courses/i })).toBeVisible();
      await page.goto("/instructor/reports");
      await expect(page.getByRole("heading", { name: /instructor reports/i })).toBeVisible();
    }

    if (hasRoleCredentials("admin")) {
      await loginAs(page, "admin");
      await page.goto("/admin/dashboard");
      await expect(page.getByRole("heading", { name: /system overview/i })).toBeVisible();
      await page.goto("/admin/reports");
      await expect(page.getByRole("heading", { name: /admin reports/i })).toBeVisible();
    }

    expect(pageErrors).toHaveLength(0);
  });

  test("TC-NF2 - core UI links, buttons, and forms are interactive", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: /^login$/i })).toBeEnabled();

    if (hasRoleCredentials("student")) {
      await loginAs(page, "student");
      await page.getByRole("link", { name: /view attendance history/i }).click();
      await expect(page.getByRole("button", { name: /apply filters/i })).toBeEnabled();
    }

    if (hasRoleCredentials("instructor")) {
      await loginAs(page, "instructor");
      await page.getByRole("link", { name: /^reports$/i }).click();
      await expect(page.getByRole("button", { name: /generate report/i })).toBeEnabled();
    }

    if (hasRoleCredentials("admin")) {
      await loginAs(page, "admin");
      await page.getByRole("link", { name: /manage users/i }).click();
      const addUserLink = page.getByRole("link", { name: /add user/i });
      await expect(addUserLink).toBeVisible();
      await addUserLink.click();
      await expect(page).toHaveURL(/\/admin\/user-management\/create$/);
      await expect(page.getByRole("heading", { name: /create user/i })).toBeVisible();
    }
  });

  test("TC-NF3 - instructor report CSV export downloads successfully", async ({ page }) => {
    test.skip(
      !hasRoleCredentials("instructor") || !isReportDownloadTestingEnabled(),
      "Set instructor credentials and PLAYWRIGHT_ENABLE_REPORT_DOWNLOAD_TESTS=1 for CSV export testing.",
    );

    await loginAs(page, "instructor");
    await page.goto("/instructor/reports");

    await page.getByRole("button", { name: /generate report/i }).click();
    const exportButton = page.getByRole("button", { name: /export csv/i });
    await expect(exportButton).toBeEnabled({ timeout: 20_000 });

    const downloadPromise = page.waitForEvent("download");
    await exportButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/^attendance-report-.*\.csv$/);
  });
});
