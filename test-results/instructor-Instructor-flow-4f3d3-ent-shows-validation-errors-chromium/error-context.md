# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: instructor.spec.ts >> Instructor flows >> TC-I5 - invalid student enrollment shows validation errors
- Location: tests\instructor.spec.ts:66:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/please enter an 8-digit student id and name first/i)
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText(/please enter an 8-digit student id and name first/i)

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - complementary [ref=e3]:
      - img "Haga" [ref=e5]
      - navigation "Instructor navigation" [ref=e6]:
        - link "Dashboard" [ref=e7] [cursor=pointer]:
          - /url: /instructor/dashboard
          - img [ref=e8]
          - generic [ref=e13]: Dashboard
        - link "Take Attendance" [ref=e14] [cursor=pointer]:
          - /url: /instructor/take-attendance
          - img [ref=e15]
          - generic [ref=e20]: Take Attendance
        - link "Enroll New Student" [ref=e21] [cursor=pointer]:
          - /url: /instructor/enroll-student
          - img [ref=e22]
          - generic [ref=e25]: Enroll New Student
        - link "Class Attendance" [ref=e26] [cursor=pointer]:
          - /url: /instructor/class-attendance
          - img [ref=e27]
          - generic [ref=e30]: Class Attendance
        - link "Reports" [ref=e31] [cursor=pointer]:
          - /url: /instructor/reports
          - img [ref=e32]
          - generic [ref=e33]: Reports
      - button "LOGOUT" [ref=e34]:
        - img [ref=e35]
        - generic [ref=e38]: LOGOUT
    - main [ref=e39]:
      - generic [ref=e40]:
        - generic [ref=e41]:
          - heading "Enroll New Student" [level=1] [ref=e42]
          - generic [ref=e43]:
            - img [ref=e44]
            - generic [ref=e46]: FIRST TIME REGISTRATION ONLY
        - generic [ref=e47]:
          - generic [ref=e48]:
            - generic [ref=e49]:
              - img [ref=e50]
              - heading "Student Details" [level=2] [ref=e53]
            - generic [ref=e54]:
              - generic [ref=e55]: Student ID
              - textbox "Student ID" [ref=e56]:
                - /placeholder: Enter 8-digit ID
            - generic [ref=e57]:
              - generic [ref=e58]: Student Name
              - textbox "Student Name" [ref=e59]:
                - /placeholder: Enter full name
            - generic [ref=e60]:
              - generic [ref=e61]: Course / Group (Optional)
              - generic [ref=e62]:
                - combobox "Course / Group (Optional)" [ref=e63]:
                  - option "Select course" [selected]
                  - option "CS101 - Intro To Computing"
                  - option "PW31609 - Playwright Course"
                - img [ref=e64]
            - button "Start Enrollment Scan" [active] [ref=e66] [cursor=pointer]:
              - img [ref=e67]
              - generic [ref=e73]: Start Enrollment Scan
          - generic [ref=e74]:
            - generic [ref=e75]:
              - img [ref=e76]
              - heading "Biometric Registration" [level=2] [ref=e80]
            - generic [ref=e82]:
              - img [ref=e83]
              - heading "Camera Feed Placeholder" [level=3] [ref=e87]
              - paragraph [ref=e88]: Ready for face capture
            - paragraph [ref=e89]: Student ID must be exactly 8 digits.
            - button "Capture Face and Save" [disabled] [ref=e90] [cursor=pointer]:
              - img [ref=e91]
              - generic [ref=e97]: Capture Face and Save
            - paragraph [ref=e98]:
              - text: Ensure the student is in a well-lit area and looking directly at the
              - text: camera.
        - region "Enrollment steps" [ref=e99]:
          - article [ref=e100]:
            - generic [ref=e101]:
              - generic [ref=e102]: "1"
              - heading "STEP 1" [level=3] [ref=e103]
            - paragraph [ref=e104]:
              - text: Enter correct institutional student
              - text: identification details.
          - article [ref=e105]:
            - generic [ref=e106]:
              - generic [ref=e107]: "2"
              - heading "STEP 2" [level=3] [ref=e108]
            - paragraph [ref=e109]:
              - text: Position student within the camera
              - text: frame for optimal capture.
          - article [ref=e110]:
            - generic [ref=e111]:
              - generic [ref=e112]: "3"
              - heading "STEP 3" [level=3] [ref=e113]
            - paragraph [ref=e114]:
              - text: Capture face and save to encrypted
              - text: biometric database.
  - alert [ref=e115]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | import {
  3  |   hasRoleCredentials,
  4  |   isMutationTestingEnabled,
  5  |   loginAs,
  6  |   selectFirstUsableOption,
  7  | } from "./helpers/auth";
  8  | 
  9  | const biometricStudentId = process.env.E2E_EXISTING_STUDENT_ID || "";
  10 | const biometricStudentName = process.env.E2E_EXISTING_STUDENT_NAME || "Playwright Student";
  11 | 
  12 | test.describe("Instructor flows", () => {
  13 |   test.beforeEach(async ({ page }) => {
  14 |     test.skip(
  15 |       !hasRoleCredentials("instructor"),
  16 |       "Set E2E_INSTRUCTOR_EMAIL and E2E_INSTRUCTOR_PASSWORD.",
  17 |     );
  18 |     await loginAs(page, "instructor");
  19 |   });
  20 | 
  21 |   test("TC-I1 - instructor dashboard shows assigned courses", async ({ page }) => {
  22 |     await expect(page).toHaveURL(/\/instructor\/dashboard$/);
  23 |     await expect(page.getByRole("heading", { name: /assigned courses/i })).toBeVisible();
  24 |     await expect(page.getByRole("heading", { name: /quick actions/i })).toBeVisible();
  25 |   });
  26 | 
  27 |   test("TC-I2 and TC-I3 - instructor can start and end an attendance session", async ({ page }) => {
  28 |     await page.goto("/instructor/take-attendance");
  29 | 
  30 |     const selected = await selectFirstUsableOption(page.getByLabel(/course/i));
  31 |     test.skip(!selected, "No instructor course options are available for the test account.");
  32 | 
  33 |     const startButton = page.getByRole("button", { name: /start session/i });
  34 |     await expect(startButton).toBeEnabled({ timeout: 30_000 });
  35 |     await startButton.click();
  36 | 
  37 |     await expect(page.getByText(/session running\. scanning/i)).toBeVisible({ timeout: 20_000 });
  38 |     await expect(page.getByText(/active/i)).toBeVisible();
  39 | 
  40 |     await page.getByRole("button", { name: /end session/i }).click();
  41 |     await expect(page.getByText(/session successfully ended/i)).toBeVisible({ timeout: 20_000 });
  42 |   });
  43 | 
  44 |   test("TC-I4 - instructor can add a new student with valid details", async ({ page }) => {
  45 |     test.skip(
  46 |       !isMutationTestingEnabled() || !biometricStudentId,
  47 |       "Set PLAYWRIGHT_ENABLE_MUTATION_TESTS=1 and E2E_EXISTING_STUDENT_ID for valid enrollment testing.",
  48 |     );
  49 | 
  50 |     await page.goto("/instructor/enroll-student");
  51 |     await page.getByLabel(/student id/i).fill(biometricStudentId);
  52 |     await page.getByLabel(/student name/i).fill(biometricStudentName);
  53 | 
  54 |     const courseSelect = page.getByLabel(/course \/ group/i);
  55 |     if (await courseSelect.isVisible()) {
  56 |       await selectFirstUsableOption(courseSelect);
  57 |     }
  58 | 
  59 |     const startScanButton = page.getByRole("button", { name: /start enrollment scan/i });
  60 |     await expect(startScanButton).toBeEnabled({ timeout: 30_000 });
  61 |     await startScanButton.click();
  62 | 
  63 |     await expect(page.locator("video")).toBeVisible({ timeout: 15_000 });
  64 |   });
  65 | 
  66 |   test("TC-I5 - invalid student enrollment shows validation errors", async ({ page }) => {
  67 |     await page.goto("/instructor/enroll-student");
  68 |     await page.getByRole("button", { name: /start enrollment scan/i }).click();
  69 | 
> 70 |     await expect(page.getByText(/please enter an 8-digit student id and name first/i)).toBeVisible();
     |                                                                                        ^ Error: expect(locator).toBeVisible() failed
  71 |   });
  72 | });
  73 | 
```