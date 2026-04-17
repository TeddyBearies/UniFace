# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin flows >> TC-A4 - admin can reset biometric data
- Location: tests\admin.spec.ts:84:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/admin\/reset-face-data\?query=20260001/
Received string:  "https://haga-faceid.vercel.app/login"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    14 × unexpected value "https://haga-faceid.vercel.app/login"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - img "Haga Inc" [ref=e5]
        - paragraph [ref=e6]: Secure Education Portal
    - main [ref=e7]:
      - region "Welcome back" [ref=e8]:
        - generic [ref=e9]:
          - heading "Welcome back" [level=1] [ref=e10]
          - paragraph [ref=e11]: Enter your credentials to access EduScan
        - generic [ref=e12]:
          - generic [ref=e13]:
            - generic [ref=e14]: Email Address
            - generic [ref=e15]:
              - img [ref=e16]
              - textbox "Email Address" [ref=e19]:
                - /placeholder: name@university.edu
          - generic [ref=e20]:
            - generic [ref=e21]: Password
            - link "Forgot password?" [ref=e22] [cursor=pointer]:
              - /url: "#"
          - generic [ref=e24]:
            - img [ref=e25]
            - textbox "Password" [ref=e29]:
              - /placeholder: ........
          - status [ref=e30]
          - button "Login" [ref=e31] [cursor=pointer]
        - generic [ref=e32]:
          - generic [ref=e34]: QUICK ACCESS (DEV MODE)
          - generic [ref=e35]:
            - button "Continue as Student" [ref=e36] [cursor=pointer]:
              - img [ref=e37]
              - generic [ref=e40]: Continue as Student
            - button "Continue as Instructor" [ref=e41] [cursor=pointer]:
              - img [ref=e42]
              - generic [ref=e45]: Continue as Instructor
            - button "Continue as Admin" [ref=e46] [cursor=pointer]:
              - img [ref=e47]
              - generic [ref=e51]: Continue as Admin
      - generic "Support links" [ref=e52]:
        - link "Privacy Policy" [ref=e53] [cursor=pointer]:
          - /url: "#"
        - link "Terms of Service" [ref=e54] [cursor=pointer]:
          - /url: "#"
        - link "Support" [ref=e55] [cursor=pointer]:
          - /url: "#"
    - contentinfo:
      - paragraph: ©2024 EduScan Platform. All rights reserved.
  - alert [ref=e56]
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
  10  | const resetStudentQuery = process.env.E2E_RESET_STUDENT_QUERY || DEFAULT_STUDENT_FIXTURES.resetStudentQuery;
  11  | 
  12  | test.describe("Admin flows", () => {
  13  |   test.beforeEach(async ({ page }) => {
  14  |     test.skip(!hasRoleCredentials("admin"), "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD.");
  15  |     await loginAs(page, "admin");
  16  |   });
  17  | 
  18  |   let createdUserEmail = "";
  19  | 
  20  |   test.describe("User lifecycle", () => {
  21  |     test.describe.configure({ mode: "serial" });
  22  | 
  23  |     test("TC-A1 - admin can add a user", async ({ page }) => {
  24  |       test.skip(
  25  |         !isMutationTestingEnabled(),
  26  |         "Set PLAYWRIGHT_ENABLE_MUTATION_TESTS=1 to run mutation-based admin tests.",
  27  |       );
  28  | 
  29  |       createdUserEmail = `playwright.user.${Date.now()}@university.edu`;
  30  | 
  31  |       await page.goto("/admin/user-management/create");
  32  |       await page.getByLabel(/full name/i).fill("Playwright Managed User");
  33  |       await page.getByLabel(/^email$/i).fill(createdUserEmail);
  34  |       await page.getByLabel(/^role$/i).selectOption("student");
  35  |       await page.getByLabel(/enrollment year/i).fill("2026");
  36  |       await page.getByRole("button", { name: /create user/i }).click();
  37  | 
  38  |       await expect(page.getByText(/invite sent successfully/i)).toBeVisible({ timeout: 20_000 });
  39  |     });
  40  | 
  41  |     test("TC-A2 - admin can modify and delete a managed user", async ({ page }) => {
  42  |       test.skip(
  43  |         !isMutationTestingEnabled(),
  44  |         "Set PLAYWRIGHT_ENABLE_MUTATION_TESTS=1 to run mutation-based admin tests.",
  45  |       );
  46  |       test.skip(!createdUserEmail, "TC-A1 must create a user first in this serial suite.");
  47  | 
  48  |       await page.goto(`/admin/user-management?role=student&q=${encodeURIComponent(createdUserEmail)}`);
  49  |       await expect(page.getByText(createdUserEmail)).toBeVisible({ timeout: 20_000 });
  50  | 
  51  |       await page.getByRole("button", { name: /make instructor/i }).click();
  52  |       await expect(page.getByText(/user role updated successfully/i)).toBeVisible({ timeout: 20_000 });
  53  | 
  54  |       await page.goto(`/admin/user-management?role=instructor&q=${encodeURIComponent(createdUserEmail)}`);
  55  |       await expect(page.getByText(createdUserEmail)).toBeVisible({ timeout: 20_000 });
  56  | 
  57  |       await page.getByRole("button", { name: /^delete$/i }).click();
  58  |       await expect(page.getByText(/user deleted successfully/i)).toBeVisible({ timeout: 20_000 });
  59  |     });
  60  |   });
  61  | 
  62  |   test("TC-A3 - admin can assign a course to an instructor", async ({ page }) => {
  63  |     test.skip(
  64  |       !isMutationTestingEnabled(),
  65  |       "Set PLAYWRIGHT_ENABLE_MUTATION_TESTS=1 to run mutation-based admin tests.",
  66  |     );
  67  | 
  68  |     await page.goto("/admin/course-assignment");
  69  | 
  70  |     const instructorSelect = page.locator("#create-course-instructor");
  71  |     const instructorSelected = await selectFirstUsableOption(instructorSelect);
  72  |     test.skip(!instructorSelected, "No instructors are available for assignment tests.");
  73  | 
  74  |     const uniqueCode = `PW${Date.now().toString().slice(-5)}`;
  75  | 
  76  |     await page.getByLabel(/course code/i).fill(uniqueCode);
  77  |     await page.getByLabel(/course title/i).fill("Playwright Course");
  78  |     await page.getByLabel(/^semester$/i).first().fill("Spring 2026");
  79  |     await page.getByRole("button", { name: /create course/i }).click();
  80  | 
  81  |     await expect(page.getByText(/course created and instructor assigned successfully/i)).toBeVisible({ timeout: 20_000 });
  82  |   });
  83  | 
  84  |   test("TC-A4 - admin can reset biometric data", async ({ page }) => {
  85  |     test.skip(
  86  |       !isMutationTestingEnabled() || !resetStudentQuery,
  87  |       "Set PLAYWRIGHT_ENABLE_MUTATION_TESTS=1 and E2E_RESET_STUDENT_QUERY to run biometric reset tests.",
  88  |     );
  89  | 
  90  |     await page.goto(`/admin/reset-face-data?query=${encodeURIComponent(resetStudentQuery)}`);
> 91  |     await expect(page).toHaveURL(new RegExp(`/admin/reset-face-data\\?query=${resetStudentQuery}`));
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  92  | 
  93  |     await expect(page.getByText(/name:/i)).toBeVisible({ timeout: 20_000 });
  94  |     await expect(page.locator('input[name="profileId"]')).not.toHaveValue("", { timeout: 20_000 });
  95  | 
  96  |     const resetButton = page.getByRole("button", { name: /reset face data/i });
  97  |     await expect(resetButton).toBeEnabled();
  98  |     await resetButton.click();
  99  | 
  100 |     await expect(page.getByText(/face data reset successfully/i)).toBeVisible({ timeout: 20_000 });
  101 |   });
  102 | });
  103 | 
```