# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin flows >> TC-A1 - admin can add a user
- Location: tests\admin.spec.ts:21:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/invite sent successfully/i)
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 20000ms
  - waiting for getByText(/invite sent successfully/i)

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - complementary [ref=e3]:
      - img "Haga" [ref=e5]
      - navigation "Admin navigation" [ref=e6]:
        - link "Dashboard" [ref=e7] [cursor=pointer]:
          - /url: /admin/dashboard
          - img [ref=e8]
          - generic [ref=e13]: Dashboard
        - link "User Management" [ref=e14] [cursor=pointer]:
          - /url: /admin/user-management
          - img [ref=e15]
          - generic [ref=e18]: User Management
        - link "Course Assignment" [ref=e19] [cursor=pointer]:
          - /url: /admin/course-assignment
          - img [ref=e20]
          - generic [ref=e23]: Course Assignment
        - link "Reset Face Data" [ref=e24] [cursor=pointer]:
          - /url: /admin/reset-face-data
          - img [ref=e25]
          - generic [ref=e30]: Reset Face Data
        - link "Reports" [ref=e31] [cursor=pointer]:
          - /url: /admin/reports
          - img [ref=e32]
          - generic [ref=e33]: Reports
      - button "LOGOUT" [ref=e34]:
        - img [ref=e35]
        - generic [ref=e38]: LOGOUT
    - generic [ref=e39]:
      - banner [ref=e40]:
        - generic [ref=e41]: Create User
        - generic [ref=e42]:
          - button "Refresh page" [ref=e44]:
            - img [ref=e45]
          - generic [ref=e48]:
            - generic [ref=e49]:
              - paragraph [ref=e50]: Anas Ayman
              - text: Active Session
            - img [ref=e52]
      - main [ref=e55]:
        - generic [ref=e56]:
          - generic [ref=e57]:
            - link "Back to User Management" [ref=e58] [cursor=pointer]:
              - /url: /admin/user-management
              - img [ref=e59]
              - generic [ref=e61]: Back to User Management
            - heading "Create User" [level=1] [ref=e62]
            - paragraph [ref=e63]: Add a student, instructor, or admin account.
          - paragraph [ref=e64]: Supabase email sending is temporarily rate-limited. Wait a bit before sending another invite, or configure custom SMTP in Supabase to raise the email limit.
          - generic [ref=e65]:
            - generic [ref=e66]:
              - img [ref=e67]
              - heading "New Account Details" [level=2] [ref=e70]
            - generic [ref=e71]:
              - generic [ref=e72]:
                - generic [ref=e73]:
                  - generic [ref=e74]: Full Name
                  - textbox "Full Name" [ref=e76]:
                    - /placeholder: Enter full name
                    - text: Playwright Managed User
                - generic [ref=e77]:
                  - generic [ref=e78]: Email
                  - textbox "Email" [ref=e80]:
                    - /placeholder: name@university.edu
                    - text: playwright.user.1776290924866@university.edu
                - generic [ref=e81]:
                  - generic [ref=e82]: Role
                  - combobox "Role" [ref=e84]:
                    - option "Student" [selected]
                    - option "Instructor"
                    - option "Admin"
                - generic [ref=e85]:
                  - generic [ref=e86]: Enrollment Year
                  - textbox "Enrollment Year" [ref=e88]:
                    - /placeholder: "2026"
                    - text: "2026"
              - paragraph [ref=e89]: Users receive a secure one-time invite link to finish setting up their account.
              - paragraph [ref=e90]: "University IDs are auto-generated as linear yearly IDs (`YYYYNNNN`) for student and instructor accounts and stay tied to the invite flow."
              - button "Create User" [active] [ref=e92]
  - alert [ref=e93]
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
  9  | const resetStudentQuery = process.env.E2E_RESET_STUDENT_QUERY || "";
  10 | 
  11 | test.describe("Admin flows", () => {
  12 |   test.beforeEach(async ({ page }) => {
  13 |     test.skip(!hasRoleCredentials("admin"), "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD.");
  14 |     await loginAs(page, "admin");
  15 |   });
  16 | 
  17 |   test.describe.configure({ mode: "serial" });
  18 | 
  19 |   let createdUserEmail = "";
  20 | 
  21 |   test("TC-A1 - admin can add a user", async ({ page }) => {
  22 |     test.skip(
  23 |       !isMutationTestingEnabled(),
  24 |       "Set PLAYWRIGHT_ENABLE_MUTATION_TESTS=1 to run mutation-based admin tests.",
  25 |     );
  26 | 
  27 |     createdUserEmail = `playwright.user.${Date.now()}@university.edu`;
  28 | 
  29 |     await page.goto("/admin/user-management/create");
  30 |     await page.getByLabel(/full name/i).fill("Playwright Managed User");
  31 |     await page.getByLabel(/^email$/i).fill(createdUserEmail);
  32 |     await page.getByLabel(/^role$/i).selectOption("student");
  33 |     await page.getByLabel(/enrollment year/i).fill("2026");
  34 |     await page.getByRole("button", { name: /create user/i }).click();
  35 | 
> 36 |     await expect(page.getByText(/invite sent successfully/i)).toBeVisible({ timeout: 20_000 });
     |                                                               ^ Error: expect(locator).toBeVisible() failed
  37 |   });
  38 | 
  39 |   test("TC-A2 - admin can modify and delete a managed user", async ({ page }) => {
  40 |     test.skip(
  41 |       !isMutationTestingEnabled(),
  42 |       "Set PLAYWRIGHT_ENABLE_MUTATION_TESTS=1 to run mutation-based admin tests.",
  43 |     );
  44 |     test.skip(!createdUserEmail, "TC-A1 must create a user first in this serial suite.");
  45 | 
  46 |     await page.goto(`/admin/user-management?role=student&q=${encodeURIComponent(createdUserEmail)}`);
  47 |     await expect(page.getByText(createdUserEmail)).toBeVisible({ timeout: 20_000 });
  48 | 
  49 |     await page.getByRole("button", { name: /make instructor/i }).click();
  50 |     await expect(page.getByText(/user role updated successfully/i)).toBeVisible({ timeout: 20_000 });
  51 | 
  52 |     await page.goto(`/admin/user-management?role=instructor&q=${encodeURIComponent(createdUserEmail)}`);
  53 |     await expect(page.getByText(createdUserEmail)).toBeVisible({ timeout: 20_000 });
  54 | 
  55 |     await page.getByRole("button", { name: /^delete$/i }).click();
  56 |     await expect(page.getByText(/user deleted successfully/i)).toBeVisible({ timeout: 20_000 });
  57 |   });
  58 | 
  59 |   test("TC-A3 - admin can assign a course to an instructor", async ({ page }) => {
  60 |     test.skip(
  61 |       !isMutationTestingEnabled(),
  62 |       "Set PLAYWRIGHT_ENABLE_MUTATION_TESTS=1 to run mutation-based admin tests.",
  63 |     );
  64 | 
  65 |     await page.goto("/admin/course-assignment");
  66 | 
  67 |     const instructorSelected = await selectFirstUsableOption(page.getByLabel(/assign instructor \(optional\)/i));
  68 |     test.skip(!instructorSelected, "No instructors are available for assignment tests.");
  69 | 
  70 |     const uniqueCode = `PW${Date.now().toString().slice(-5)}`;
  71 | 
  72 |     await page.getByLabel(/course code/i).fill(uniqueCode);
  73 |     await page.getByLabel(/course title/i).fill("Playwright Course");
  74 |     await page.getByLabel(/^semester$/i).first().fill("Spring 2026");
  75 |     await page.getByRole("button", { name: /create course/i }).click();
  76 | 
  77 |     await expect(page.getByText(/course created/i)).toBeVisible({ timeout: 20_000 });
  78 |   });
  79 | 
  80 |   test("TC-A4 - admin can reset biometric data", async ({ page }) => {
  81 |     test.skip(
  82 |       !isMutationTestingEnabled() || !resetStudentQuery,
  83 |       "Set PLAYWRIGHT_ENABLE_MUTATION_TESTS=1 and E2E_RESET_STUDENT_QUERY to run biometric reset tests.",
  84 |     );
  85 | 
  86 |     await page.goto("/admin/reset-face-data");
  87 |     await page.getByLabel(/student identifier/i).fill(resetStudentQuery);
  88 |     await page.getByRole("button", { name: /find student/i }).click();
  89 | 
  90 |     await expect(page.getByText(/name:/i)).toBeVisible({ timeout: 20_000 });
  91 | 
  92 |     const resetButton = page.getByRole("button", { name: /reset face data/i });
  93 |     await expect(resetButton).toBeEnabled();
  94 |     await resetButton.click();
  95 | 
  96 |     await expect(page.getByText(/face data reset successfully/i)).toBeVisible({ timeout: 20_000 });
  97 |   });
  98 | });
  99 | 
```