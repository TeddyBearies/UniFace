# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: instructor.spec.ts >> Instructor flows >> TC-I2 and TC-I3 - instructor can start and end an attendance session
- Location: tests\instructor.spec.ts:30:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /session active/i })
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 20000ms
  - waiting for getByRole('button', { name: /session active/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
          - heading "Take Attendance" [level=1] [ref=e42]
          - paragraph [ref=e43]: Session-based attendance scanning during class
          - button "Enter Locked Tablet Mode" [ref=e44]:
            - img [ref=e45]
            - generic [ref=e54]: Enter Locked Tablet Mode
        - generic [ref=e55]:
          - generic [ref=e56]:
            - generic [ref=e57]:
              - generic [ref=e58]:
                - generic [ref=e59]: "1"
                - heading "Select Course" [level=2] [ref=e60]
              - generic [ref=e61]:
                - generic [ref=e62]: Course
                - generic [ref=e63]:
                  - combobox "Course" [ref=e64]:
                    - option "Select one of your assigned courses" [disabled]
                    - option "CS101 - Intro To Computing" [selected]
                    - option "PW31609 - Playwright Course"
                  - img [ref=e65]
              - button "Start Session" [ref=e67] [cursor=pointer]:
                - img [ref=e68]
                - generic [ref=e71]: Start Session
              - paragraph [ref=e72]: Students are enrolled in this course, but none of them have completed face enrollment yet.
              - generic [ref=e73]:
                - generic [ref=e74]:
                  - img [ref=e76]
                  - generic [ref=e78]:
                    - generic [ref=e79]: unknown
                    - heading "No enrolled faces" [level=3] [ref=e80]
                - paragraph [ref=e81]: Students are on the roster, but none have completed face enrollment yet.
            - generic [ref=e82]:
              - generic [ref=e83]:
                - generic [ref=e84]: "2"
                - heading "Session Controls" [level=2] [ref=e85]
              - button "Scan Next Student" [disabled] [ref=e86]:
                - img [ref=e87]
                - generic [ref=e92]: Scan Next Student
              - button "End Session" [disabled] [ref=e93]:
                - img [ref=e94]
                - generic [ref=e97]: End Session
          - generic [ref=e98]:
            - generic [ref=e99]:
              - generic [ref=e102]: STANDBY
              - generic [ref=e103]:
                - img [ref=e104]
                - heading "Camera Feed Placeholder" [level=3] [ref=e108]
                - paragraph [ref=e109]: Start session to activate camera
            - generic [ref=e110]:
              - img [ref=e112]
              - heading "Awaiting Scan" [level=3] [ref=e117]
              - paragraph [ref=e118]:
                - text: Position the student's face in front of the
                - text: camera to verify identity.
        - generic [ref=e119]:
          - generic [ref=e120]:
            - generic [ref=e121]: "Present: 0"
            - generic [ref=e123]: "Enrolled: 0"
            - generic [ref=e125]: "Late: 0"
          - paragraph [ref=e127]: "Last scan: None"
  - alert [ref=e128]
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | import {
  3   |   hasRoleCredentials,
  4   |   isMutationTestingEnabled,
  5   |   loginAs,
  6   |   selectFirstUsableOption,
  7   | } from "./helpers/auth";
  8   | import { DEFAULT_STUDENT_FIXTURES } from "./helpers/test-data";
  9   | 
  10  | const biometricStudentId =
  11  |   process.env.E2E_EXISTING_STUDENT_ID || DEFAULT_STUDENT_FIXTURES.enrollmentStudentId;
  12  | const biometricStudentName =
  13  |   process.env.E2E_EXISTING_STUDENT_NAME || DEFAULT_STUDENT_FIXTURES.enrollmentStudentName;
  14  | 
  15  | test.describe("Instructor flows", () => {
  16  |   test.beforeEach(async ({ page }) => {
  17  |     test.skip(
  18  |       !hasRoleCredentials("instructor"),
  19  |       "Set E2E_INSTRUCTOR_EMAIL and E2E_INSTRUCTOR_PASSWORD.",
  20  |     );
  21  |     await loginAs(page, "instructor");
  22  |   });
  23  | 
  24  |   test("TC-I1 - instructor dashboard shows assigned courses", async ({ page }) => {
  25  |     await expect(page).toHaveURL(/\/instructor\/dashboard$/);
  26  |     await expect(page.getByRole("heading", { name: /assigned courses/i })).toBeVisible();
  27  |     await expect(page.getByRole("heading", { name: /quick actions/i })).toBeVisible();
  28  |   });
  29  | 
  30  |   test("TC-I2 and TC-I3 - instructor can start and end an attendance session", async ({ page }) => {
  31  |     await page.goto("/instructor/take-attendance");
  32  | 
  33  |     const selected = await selectFirstUsableOption(page.getByLabel(/course/i));
  34  |     expect(selected).toBeTruthy();
  35  | 
  36  |     const startButton = page.getByRole("button", { name: /start session/i });
  37  |     await expect(startButton).toBeEnabled({ timeout: 30_000 });
  38  |     await startButton.click();
  39  | 
  40  |     await expect(
  41  |       page.getByRole("button", { name: /session active/i }),
> 42  |     ).toBeVisible({ timeout: 20_000 });
      |       ^ Error: expect(locator).toBeVisible() failed
  43  |     await expect(
  44  |       page.getByRole("button", { name: /end session/i }),
  45  |     ).toBeEnabled({ timeout: 20_000 });
  46  |     await expect(page.locator("video")).toBeVisible({ timeout: 20_000 });
  47  | 
  48  |     await page.getByRole("button", { name: /end session/i }).click();
  49  |     await expect(page.getByText(/session successfully ended/i)).toBeVisible({ timeout: 20_000 });
  50  |   });
  51  | 
  52  |   test("TC-I4 - instructor can add a new student with valid details", async ({ page }) => {
  53  |     test.skip(
  54  |       !isMutationTestingEnabled() || !biometricStudentId,
  55  |       "Set PLAYWRIGHT_ENABLE_MUTATION_TESTS=1 and E2E_EXISTING_STUDENT_ID for valid enrollment testing.",
  56  |     );
  57  | 
  58  |     await page.goto("/instructor/enroll-student");
  59  |     await page.getByLabel(/student id/i).fill(biometricStudentId);
  60  |     await page.getByLabel(/student name/i).fill(biometricStudentName);
  61  | 
  62  |     const courseSelect = page.getByLabel(/course \/ group/i);
  63  |     if (await courseSelect.isVisible()) {
  64  |       const selectedCourse = await courseSelect.evaluate((node) => {
  65  |         const select = node as HTMLSelectElement;
  66  |         const generalOption = Array.from(select.options).find(
  67  |           (option) => option.value === "general" && !option.disabled,
  68  |         );
  69  | 
  70  |         if (generalOption) {
  71  |           return generalOption.value;
  72  |         }
  73  | 
  74  |         const firstUsableOption = Array.from(select.options).find(
  75  |           (option) => option.value && !option.disabled,
  76  |         );
  77  | 
  78  |         return firstUsableOption?.value || "";
  79  |       });
  80  | 
  81  |       if (selectedCourse) {
  82  |         await courseSelect.selectOption(selectedCourse);
  83  |       } else {
  84  |         await selectFirstUsableOption(courseSelect);
  85  |       }
  86  |     }
  87  | 
  88  |     const startScanButton = page.getByRole("button", { name: /start enrollment scan/i });
  89  |     await expect(startScanButton).toBeEnabled({ timeout: 30_000 });
  90  |     await startScanButton.click();
  91  | 
  92  |     const enrollmentMessage = page.getByText(
  93  |       /this student already has enrolled face data\. reset it before enrolling again\.|this student already had face data and has now been added to the selected course roster\.|student id .* belongs to .* please correct the name before scanning\./i,
  94  |     );
  95  | 
  96  |     await Promise.race([
  97  |       page.locator("video").waitFor({ state: "visible", timeout: 15_000 }),
  98  |       enrollmentMessage.waitFor({ state: "visible", timeout: 15_000 }),
  99  |     ]);
  100 | 
  101 |     const videoVisible = await page.locator("video").isVisible();
  102 |     if (!videoVisible) {
  103 |       await expect(enrollmentMessage).toBeVisible();
  104 |     }
  105 |   });
  106 | 
  107 |   test("TC-I5 - invalid student enrollment shows validation errors", async ({ page }) => {
  108 |     await page.goto("/instructor/enroll-student");
  109 |     await page.getByLabel(/student id/i).fill("");
  110 |     await page.getByLabel(/student name/i).fill("");
  111 |     const startScanButton = page.getByRole("button", { name: /start enrollment scan/i });
  112 |     await expect(startScanButton).toBeEnabled({ timeout: 30_000 });
  113 |     await startScanButton.click({ force: true });
  114 | 
  115 |     const enrollmentMessage = page.getByTestId("enrollment-message");
  116 | 
  117 |     await expect(enrollmentMessage).toBeVisible({ timeout: 15_000 });
  118 |     await expect(enrollmentMessage).toHaveText(
  119 |       /please enter an 8-digit student id and name first/i,
  120 |     );
  121 |   });
  122 | });
  123 | 
```