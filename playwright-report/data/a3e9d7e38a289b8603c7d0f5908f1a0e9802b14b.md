# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: non-functional.spec.ts >> Non-functional and report checks >> TC-NF2 - core UI links, buttons, and forms are interactive
- Location: tests\non-functional.spec.ts:43:7

# Error details

```
TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
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
  85  |   await page.waitForURL(
  86  |     (url) => url.pathname === creds.expectedPath,
  87  |     { timeout: 20_000 },
  88  |   );
  89  | 
  90  |   // Ensure the authenticated session cookie is fully persisted for subsequent
  91  |   // server-rendered pages and server actions.
  92  |   await page.waitForLoadState("networkidle");
  93  |   await page.reload();
> 94  |   await page.waitForURL((url) => url.pathname === creds.expectedPath, {
      |              ^ TimeoutError: page.waitForURL: Timeout 20000ms exceeded.
  95  |     timeout: 20_000,
  96  |   });
  97  | 
  98  |   await expect
  99  |     .poll(
  100 |       async () => {
  101 |         const cookies = await page.context().cookies();
  102 |         return cookies.some((cookie) => cookie.name.includes("auth-token"));
  103 |       },
  104 |       {
  105 |         timeout: 15_000,
  106 |         message: "Waiting for the Supabase auth cookie to persist in the browser context",
  107 |       },
  108 |     )
  109 |     .toBeTruthy();
  110 | 
  111 |   await page.goto(creds.expectedPath, { waitUntil: "networkidle" });
  112 |   await page.waitForURL((url) => url.pathname === creds.expectedPath, {
  113 |     timeout: 20_000,
  114 |   });
  115 | }
  116 | 
  117 | export async function expectRedirectedToLogin(page: Page) {
  118 |   const loginHeading = page.getByRole("heading", { name: /welcome back/i });
  119 |   const loginButton = page.getByRole("button", { name: /^login$/i });
  120 | 
  121 |   await Promise.race([
  122 |     page.waitForURL((url) => url.pathname === "/login", { timeout: 15_000 }),
  123 |     loginHeading.waitFor({ state: "visible", timeout: 15_000 }),
  124 |   ]);
  125 | 
  126 |   await expect(loginHeading).toBeVisible();
  127 |   await expect(loginButton).toBeVisible();
  128 | }
  129 | 
  130 | export async function clickLogout(page: Page) {
  131 |   await page.getByRole("button", { name: /logout/i }).click();
  132 |   await expectRedirectedToLogin(page);
  133 | }
  134 | 
  135 | export async function selectFirstUsableOption(select: Locator) {
  136 |   await select.waitFor({ state: "visible", timeout: 15_000 });
  137 | 
  138 |   let value = "";
  139 | 
  140 |   await expect
  141 |     .poll(
  142 |       async () => {
  143 |         const options = await select.locator("option").evaluateAll((nodes) =>
  144 |           nodes.map((node) => {
  145 |             const option = node as HTMLOptionElement;
  146 |             return {
  147 |               value: option.value,
  148 |               disabled: option.disabled,
  149 |             };
  150 |           }),
  151 |         );
  152 | 
  153 |         const candidate = options.find((option) => !option.disabled && option.value);
  154 |         value = candidate?.value || "";
  155 |         return value;
  156 |       },
  157 |       {
  158 |         timeout: 20_000,
  159 |         message: "Waiting for the first usable select option to load",
  160 |       },
  161 |     )
  162 |     .not.toBe("");
  163 | 
  164 |   if (!value) {
  165 |     return false;
  166 |   }
  167 | 
  168 |   await select.selectOption(value);
  169 |   return true;
  170 | }
  171 | 
```