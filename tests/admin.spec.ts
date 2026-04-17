import { expect, test } from "@playwright/test";
import {
  hasRoleCredentials,
  isMutationTestingEnabled,
  loginAs,
  selectFirstUsableOption,
} from "./helpers/auth";
import { DEFAULT_STUDENT_FIXTURES } from "./helpers/test-data";

const resetStudentQuery = process.env.E2E_RESET_STUDENT_QUERY || DEFAULT_STUDENT_FIXTURES.resetStudentQuery;

test.describe("Admin flows", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!hasRoleCredentials("admin"), "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD.");
    await loginAs(page, "admin");
  });

  let createdUserEmail = "";

  test.describe("User lifecycle", () => {
    test.describe.configure({ mode: "serial" });

    test("TC-A1 - admin can add a user", async ({ page }) => {
      test.skip(
        !isMutationTestingEnabled(),
        "Set PLAYWRIGHT_ENABLE_MUTATION_TESTS=1 to run mutation-based admin tests.",
      );

      createdUserEmail = `playwright.user.${Date.now()}@university.edu`;

      await page.goto("/admin/user-management/create");
      await page.getByLabel(/full name/i).fill("Playwright Managed User");
      await page.getByLabel(/^email$/i).fill(createdUserEmail);
      await page.getByLabel(/^role$/i).selectOption("student");
      await page.getByLabel(/enrollment year/i).fill("2026");
      await page.getByRole("button", { name: /create user/i }).click();

      await expect(page.getByText(/invite sent successfully/i)).toBeVisible({ timeout: 20_000 });
    });

    test("TC-A2 - admin can modify and delete a managed user", async ({ page }) => {
      test.skip(
        !isMutationTestingEnabled(),
        "Set PLAYWRIGHT_ENABLE_MUTATION_TESTS=1 to run mutation-based admin tests.",
      );
      test.skip(!createdUserEmail, "TC-A1 must create a user first in this serial suite.");

      await page.goto(`/admin/user-management?role=student&q=${encodeURIComponent(createdUserEmail)}`);
      await expect(page.getByText(createdUserEmail)).toBeVisible({ timeout: 20_000 });

      await page.getByRole("button", { name: /make instructor/i }).click();
      await expect(page.getByText(/user role updated successfully/i)).toBeVisible({ timeout: 20_000 });

      await page.goto(`/admin/user-management?role=instructor&q=${encodeURIComponent(createdUserEmail)}`);
      await expect(page.getByText(createdUserEmail)).toBeVisible({ timeout: 20_000 });

      await page.getByRole("button", { name: /^delete$/i }).click();
      await expect(page.getByText(/user deleted successfully/i)).toBeVisible({ timeout: 20_000 });
    });
  });

  test("TC-A3 - admin can assign a course to an instructor", async ({ page }) => {
    test.skip(
      !isMutationTestingEnabled(),
      "Set PLAYWRIGHT_ENABLE_MUTATION_TESTS=1 to run mutation-based admin tests.",
    );

    await page.goto("/admin/course-assignment");

    const instructorSelect = page.locator("#create-course-instructor");
    const instructorSelected = await selectFirstUsableOption(instructorSelect);
    test.skip(!instructorSelected, "No instructors are available for assignment tests.");

    const uniqueCode = `PW${Date.now().toString().slice(-5)}`;

    await page.getByLabel(/course code/i).fill(uniqueCode);
    await page.getByLabel(/course title/i).fill("Playwright Course");
    await page.getByLabel(/^semester$/i).first().fill("Spring 2026");
    await page.getByRole("button", { name: /create course/i }).click();

    await expect(page.getByText(/course created and instructor assigned successfully/i)).toBeVisible({ timeout: 20_000 });
  });

  test("TC-A4 - admin can reset biometric data", async ({ page }) => {
    test.skip(
      !isMutationTestingEnabled() || !resetStudentQuery,
      "Set PLAYWRIGHT_ENABLE_MUTATION_TESTS=1 and E2E_RESET_STUDENT_QUERY to run biometric reset tests.",
    );

    await page.goto(`/admin/reset-face-data?query=${encodeURIComponent(resetStudentQuery)}`);
    await expect(page).toHaveURL(new RegExp(`/admin/reset-face-data\\?query=${resetStudentQuery}`));

    await expect(page.getByText(/name:/i)).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('input[name="profileId"]')).not.toHaveValue("", { timeout: 20_000 });

    const resetButton = page.getByRole("button", { name: /reset face data/i });
    await expect(resetButton).toBeEnabled();
    await resetButton.click();

    await expect(page.getByText(/face data reset successfully/i)).toBeVisible({ timeout: 20_000 });
  });
});
