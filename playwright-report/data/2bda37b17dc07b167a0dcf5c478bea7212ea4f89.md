# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.ts >> Admin flows >> TC-A3 - admin can assign a course to an instructor
- Location: tests\admin.spec.ts:60:7

# Error details

```
TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "https://haga-faceid.vercel.app/login"
============================================================
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
              - textbox "Email Address" [disabled] [ref=e19]:
                - /placeholder: name@university.edu
                - text: anasayman232@gmail.com
          - generic [ref=e20]:
            - generic [ref=e21]: Password
            - link "Forgot password?" [ref=e22] [cursor=pointer]:
              - /url: "#"
          - generic [ref=e24]:
            - img [ref=e25]
            - textbox "Password" [disabled] [ref=e29]:
              - /placeholder: ........
              - text: Pass1234$
          - status [ref=e30]: Login successful. Redirecting to your dashboard...
          - button "Signing in..." [disabled] [ref=e31]
        - generic [ref=e32]:
          - generic [ref=e34]: QUICK ACCESS (DEV MODE)
          - generic [ref=e35]:
            - button "Continue as Student" [disabled] [ref=e36]:
              - img [ref=e37]
              - generic [ref=e40]: Continue as Student
            - button "Continue as Instructor" [disabled] [ref=e41]:
              - img [ref=e42]
              - generic [ref=e45]: Continue as Instructor
            - button "Continue as Admin" [disabled] [ref=e46]:
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
  1   | import { expect, type Locator, type Page } from "@playwright/test";
  2   | import { DEFAULT_PLAYWRIGHT_FLAGS, DEFAULT_ROLE_CREDENTIALS } from "./test-data";
  3   | 
  4   | export type AppRole = "student" | "instructor" | "admin";
  5   | 
  6   | type RoleCredentials = {
  7   |   email: string;
  8   |   password: string;
  9   |   expectedPath: string;
  10  | };
  11  | 
  12  | const ROLE_ENV_MAP: Record<AppRole, { email: string; password: string; expectedPath: string }> = {
  13  |   student: {
  14  |     email: "E2E_STUDENT_EMAIL",
  15  |     password: "E2E_STUDENT_PASSWORD",
  16  |     expectedPath: "/student/dashboard",
  17  |   },
  18  |   instructor: {
  19  |     email: "E2E_INSTRUCTOR_EMAIL",
  20  |     password: "E2E_INSTRUCTOR_PASSWORD",
  21  |     expectedPath: "/instructor/dashboard",
  22  |   },
  23  |   admin: {
  24  |     email: "E2E_ADMIN_EMAIL",
  25  |     password: "E2E_ADMIN_PASSWORD",
  26  |     expectedPath: "/admin/dashboard",
  27  |   },
  28  | };
  29  | 
  30  | export function hasRoleCredentials(role: AppRole) {
  31  |   const envMap = ROLE_ENV_MAP[role];
  32  |   return Boolean(
  33  |     process.env[envMap.email] ||
  34  |       process.env[envMap.password] ||
  35  |       DEFAULT_ROLE_CREDENTIALS[role].email ||
  36  |       DEFAULT_ROLE_CREDENTIALS[role].password,
  37  |   );
  38  | }
  39  | 
  40  | export function getRoleCredentials(role: AppRole): RoleCredentials {
  41  |   const envMap = ROLE_ENV_MAP[role];
  42  |   const email = process.env[envMap.email] || DEFAULT_ROLE_CREDENTIALS[role].email;
  43  |   const password = process.env[envMap.password] || DEFAULT_ROLE_CREDENTIALS[role].password;
  44  | 
  45  |   if (!email || !password) {
  46  |     throw new Error(`Missing credentials for ${role}. Set ${envMap.email} and ${envMap.password}.`);
  47  |   }
  48  | 
  49  |   return {
  50  |     email,
  51  |     password,
  52  |     expectedPath: DEFAULT_ROLE_CREDENTIALS[role].expectedPath,
  53  |   };
  54  | }
  55  | 
  56  | export function isMutationTestingEnabled() {
  57  |   if (process.env.PLAYWRIGHT_ENABLE_MUTATION_TESTS) {
  58  |     return process.env.PLAYWRIGHT_ENABLE_MUTATION_TESTS === "1";
  59  |   }
  60  | 
  61  |   return DEFAULT_PLAYWRIGHT_FLAGS.mutationTestsEnabled;
  62  | }
  63  | 
  64  | export function isReportDownloadTestingEnabled() {
  65  |   if (process.env.PLAYWRIGHT_ENABLE_REPORT_DOWNLOAD_TESTS) {
  66  |     return process.env.PLAYWRIGHT_ENABLE_REPORT_DOWNLOAD_TESTS === "1";
  67  |   }
  68  | 
  69  |   return DEFAULT_PLAYWRIGHT_FLAGS.reportDownloadTestsEnabled;
  70  | }
  71  | 
  72  | export async function gotoLogin(page: Page) {
  73  |   await page.goto("/login");
  74  |   await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  75  | }
  76  | 
  77  | export async function loginAs(page: Page, role: AppRole) {
  78  |   const creds = getRoleCredentials(role);
  79  | 
  80  |   await gotoLogin(page);
  81  |   await page.getByLabel(/email address/i).fill(creds.email);
  82  |   await page.getByLabel(/password/i).fill(creds.password);
  83  |   await page.getByRole("button", { name: /^login$/i }).click();
  84  | 
> 85  |   await page.waitForURL(
      |              ^ TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
  86  |     (url) => url.pathname === creds.expectedPath,
  87  |     { timeout: 20_000 },
  88  |   );
  89  | }
  90  | 
  91  | export async function expectRedirectedToLogin(page: Page) {
  92  |   const loginHeading = page.getByRole("heading", { name: /welcome back/i });
  93  |   const loginButton = page.getByRole("button", { name: /^login$/i });
  94  | 
  95  |   await Promise.race([
  96  |     page.waitForURL((url) => url.pathname === "/login", { timeout: 15_000 }),
  97  |     loginHeading.waitFor({ state: "visible", timeout: 15_000 }),
  98  |   ]);
  99  | 
  100 |   await expect(loginHeading).toBeVisible();
  101 |   await expect(loginButton).toBeVisible();
  102 | }
  103 | 
  104 | export async function clickLogout(page: Page) {
  105 |   await page.getByRole("button", { name: /logout/i }).click();
  106 |   await expectRedirectedToLogin(page);
  107 | }
  108 | 
  109 | export async function selectFirstUsableOption(select: Locator) {
  110 |   await select.waitFor({ state: "visible", timeout: 15_000 });
  111 | 
  112 |   const options = await select.locator("option").evaluateAll((nodes) =>
  113 |     nodes.map((node) => {
  114 |       const option = node as HTMLOptionElement;
  115 |       return {
  116 |         value: option.value,
  117 |         disabled: option.disabled,
  118 |       };
  119 |     }),
  120 |   );
  121 | 
  122 |   const candidate = options.find((option) => !option.disabled && option.value);
  123 |   const value = candidate?.value || "";
  124 | 
  125 |   if (!value) {
  126 |     return false;
  127 |   }
  128 | 
  129 |   await select.selectOption(value);
  130 |   return true;
  131 | }
  132 | 
```