import { expect, test } from "@playwright/test";
import {
  hasRoleCredentials,
  isMutationTestingEnabled,
  loginAs,
  selectFirstUsableOption,
} from "./helpers/auth";
import { DEFAULT_STUDENT_FIXTURES } from "./helpers/test-data";

const biometricStudentId =
  process.env.E2E_EXISTING_STUDENT_ID || DEFAULT_STUDENT_FIXTURES.enrollmentStudentId;
const biometricStudentName =
  process.env.E2E_EXISTING_STUDENT_NAME || DEFAULT_STUDENT_FIXTURES.enrollmentStudentName;

test.describe("Instructor flows", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !hasRoleCredentials("instructor"),
      "Set E2E_INSTRUCTOR_EMAIL and E2E_INSTRUCTOR_PASSWORD.",
    );
    await loginAs(page, "instructor");
  });

  test("TC-I1 - instructor dashboard shows assigned courses", async ({ page }) => {
    await expect(page).toHaveURL(/\/instructor\/dashboard$/);
    await expect(page.getByRole("heading", { name: /assigned courses/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /quick actions/i })).toBeVisible();
  });

  test("TC-I2 and TC-I3 - instructor can start and end an attendance session", async ({ page }) => {
    await page.goto("/instructor/take-attendance");

    const selected = await selectFirstUsableOption(page.getByLabel(/course/i));
    test.skip(!selected, "No instructor course options are available for the test account.");

    const startButton = page.getByRole("button", { name: /start session/i });
    await expect(startButton).toBeEnabled({ timeout: 30_000 });
    await startButton.click();

    await expect(page.getByText(/session running\. scanning/i)).toBeVisible({ timeout: 20_000 });
    await expect(page.getByText(/active/i)).toBeVisible();

    await page.getByRole("button", { name: /end session/i }).click();
    await expect(page.getByText(/session successfully ended/i)).toBeVisible({ timeout: 20_000 });
  });

  test("TC-I4 - instructor can add a new student with valid details", async ({ page }) => {
    test.skip(
      !isMutationTestingEnabled() || !biometricStudentId,
      "Set PLAYWRIGHT_ENABLE_MUTATION_TESTS=1 and E2E_EXISTING_STUDENT_ID for valid enrollment testing.",
    );

    await page.goto("/instructor/enroll-student");
    await page.getByLabel(/student id/i).fill(biometricStudentId);
    await page.getByLabel(/student name/i).fill(biometricStudentName);

    const courseSelect = page.getByLabel(/course \/ group/i);
    if (await courseSelect.isVisible()) {
      const selectedCourse = await courseSelect.evaluate((node) => {
        const select = node as HTMLSelectElement;
        const generalOption = Array.from(select.options).find(
          (option) => option.value === "general" && !option.disabled,
        );

        if (generalOption) {
          return generalOption.value;
        }

        const firstUsableOption = Array.from(select.options).find(
          (option) => option.value && !option.disabled,
        );

        return firstUsableOption?.value || "";
      });

      if (selectedCourse) {
        await courseSelect.selectOption(selectedCourse);
      } else {
        await selectFirstUsableOption(courseSelect);
      }
    }

    const startScanButton = page.getByRole("button", { name: /start enrollment scan/i });
    await expect(startScanButton).toBeEnabled({ timeout: 30_000 });
    await startScanButton.click();

    await expect(page.locator("video")).toBeVisible({ timeout: 15_000 });
  });

  test("TC-I5 - invalid student enrollment shows validation errors", async ({ page }) => {
    await page.goto("/instructor/enroll-student");
    await page.getByRole("button", { name: /start enrollment scan/i }).click();

    await expect(page.getByText(/please enter an 8-digit student id and name first/i)).toBeVisible();
  });
});
