# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-security.spec.ts >> Authentication and Security >> TC-L4 - protected routes redirect unauthenticated users to login
- Location: tests\auth-security.spec.ts:59:7

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - 'heading "Application error: a server-side exception has occurred (see the server logs for more information)." [level=2] [ref=e4]'
  - paragraph [ref=e5]: "Digest: 3136677737"
```

# Test source

```ts
  1   | import { expect, type Locator, type Page } from "@playwright/test";
  2   | 
  3   | export type AppRole = "student" | "instructor" | "admin";
  4   | 
  5   | type RoleCredentials = {
  6   |   email: string;
  7   |   password: string;
  8   |   expectedPath: string;
  9   | };
  10  | 
  11  | const ROLE_ENV_MAP: Record<AppRole, { email: string; password: string; expectedPath: string }> = {
  12  |   student: {
  13  |     email: "E2E_STUDENT_EMAIL",
  14  |     password: "E2E_STUDENT_PASSWORD",
  15  |     expectedPath: "/student/dashboard",
  16  |   },
  17  |   instructor: {
  18  |     email: "E2E_INSTRUCTOR_EMAIL",
  19  |     password: "E2E_INSTRUCTOR_PASSWORD",
  20  |     expectedPath: "/instructor/dashboard",
  21  |   },
  22  |   admin: {
  23  |     email: "E2E_ADMIN_EMAIL",
  24  |     password: "E2E_ADMIN_PASSWORD",
  25  |     expectedPath: "/admin/dashboard",
  26  |   },
  27  | };
  28  | 
  29  | export function hasRoleCredentials(role: AppRole) {
  30  |   const envMap = ROLE_ENV_MAP[role];
  31  |   return Boolean(process.env[envMap.email] && process.env[envMap.password]);
  32  | }
  33  | 
  34  | export function getRoleCredentials(role: AppRole): RoleCredentials {
  35  |   const envMap = ROLE_ENV_MAP[role];
  36  |   const email = process.env[envMap.email];
  37  |   const password = process.env[envMap.password];
  38  | 
  39  |   if (!email || !password) {
  40  |     throw new Error(`Missing credentials for ${role}. Set ${envMap.email} and ${envMap.password}.`);
  41  |   }
  42  | 
  43  |   return {
  44  |     email,
  45  |     password,
  46  |     expectedPath: envMap.expectedPath,
  47  |   };
  48  | }
  49  | 
  50  | export function isMutationTestingEnabled() {
  51  |   return process.env.PLAYWRIGHT_ENABLE_MUTATION_TESTS === "1";
  52  | }
  53  | 
  54  | export function isReportDownloadTestingEnabled() {
  55  |   return process.env.PLAYWRIGHT_ENABLE_REPORT_DOWNLOAD_TESTS === "1";
  56  | }
  57  | 
  58  | export async function gotoLogin(page: Page) {
  59  |   await page.goto("/login");
  60  |   await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  61  | }
  62  | 
  63  | export async function loginAs(page: Page, role: AppRole) {
  64  |   const creds = getRoleCredentials(role);
  65  | 
  66  |   await gotoLogin(page);
  67  |   await page.getByLabel(/email address/i).fill(creds.email);
  68  |   await page.getByLabel(/password/i).fill(creds.password);
  69  |   await page.getByRole("button", { name: /^login$/i }).click();
  70  | 
  71  |   await page.waitForURL(
  72  |     (url) => url.pathname === creds.expectedPath,
  73  |     { timeout: 20_000 },
  74  |   );
  75  | }
  76  | 
  77  | export async function expectRedirectedToLogin(page: Page) {
  78  |   const loginHeading = page.getByRole("heading", { name: /welcome back/i });
  79  |   const loginButton = page.getByRole("button", { name: /^login$/i });
  80  | 
  81  |   await Promise.race([
> 82  |     page.waitForURL((url) => url.pathname === "/login", { timeout: 15_000 }),
      |          ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  83  |     loginHeading.waitFor({ state: "visible", timeout: 15_000 }),
  84  |   ]);
  85  | 
  86  |   await expect(loginHeading).toBeVisible();
  87  |   await expect(loginButton).toBeVisible();
  88  | }
  89  | 
  90  | export async function clickLogout(page: Page) {
  91  |   await page.getByRole("button", { name: /logout/i }).click();
  92  |   await expectRedirectedToLogin(page);
  93  | }
  94  | 
  95  | export async function selectFirstUsableOption(select: Locator) {
  96  |   const value = await select.evaluate((node) => {
  97  |     const options = Array.from((node as HTMLSelectElement).options);
  98  |     const candidate = options.find((option) => !option.disabled && option.value);
  99  |     return candidate?.value || "";
  100 |   });
  101 | 
  102 |   if (!value) {
  103 |     return false;
  104 |   }
  105 | 
  106 |   await select.selectOption(value);
  107 |   return true;
  108 | }
  109 | 
```