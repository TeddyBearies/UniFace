import { expect, type Locator, type Page } from "@playwright/test";

export type AppRole = "student" | "instructor" | "admin";

type RoleCredentials = {
  email: string;
  password: string;
  expectedPath: string;
};

const ROLE_ENV_MAP: Record<AppRole, { email: string; password: string; expectedPath: string }> = {
  student: {
    email: "E2E_STUDENT_EMAIL",
    password: "E2E_STUDENT_PASSWORD",
    expectedPath: "/student/dashboard",
  },
  instructor: {
    email: "E2E_INSTRUCTOR_EMAIL",
    password: "E2E_INSTRUCTOR_PASSWORD",
    expectedPath: "/instructor/dashboard",
  },
  admin: {
    email: "E2E_ADMIN_EMAIL",
    password: "E2E_ADMIN_PASSWORD",
    expectedPath: "/admin/dashboard",
  },
};

export function hasRoleCredentials(role: AppRole) {
  const envMap = ROLE_ENV_MAP[role];
  return Boolean(process.env[envMap.email] && process.env[envMap.password]);
}

export function getRoleCredentials(role: AppRole): RoleCredentials {
  const envMap = ROLE_ENV_MAP[role];
  const email = process.env[envMap.email];
  const password = process.env[envMap.password];

  if (!email || !password) {
    throw new Error(`Missing credentials for ${role}. Set ${envMap.email} and ${envMap.password}.`);
  }

  return {
    email,
    password,
    expectedPath: envMap.expectedPath,
  };
}

export function isMutationTestingEnabled() {
  return process.env.PLAYWRIGHT_ENABLE_MUTATION_TESTS === "1";
}

export function isReportDownloadTestingEnabled() {
  return process.env.PLAYWRIGHT_ENABLE_REPORT_DOWNLOAD_TESTS === "1";
}

export async function gotoLogin(page: Page) {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
}

export async function loginAs(page: Page, role: AppRole) {
  const creds = getRoleCredentials(role);

  await gotoLogin(page);
  await page.getByLabel(/email address/i).fill(creds.email);
  await page.getByLabel(/password/i).fill(creds.password);
  await page.getByRole("button", { name: /^login$/i }).click();

  await page.waitForURL(
    (url) => url.pathname === creds.expectedPath,
    { timeout: 20_000 },
  );
}

export async function expectRedirectedToLogin(page: Page) {
  await page.waitForURL((url) => url.pathname === "/login", { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
}

export async function clickLogout(page: Page) {
  await page.getByRole("button", { name: /logout/i }).click();
  await expectRedirectedToLogin(page);
}

export async function selectFirstUsableOption(select: Locator) {
  const value = await select.evaluate((node) => {
    const options = Array.from((node as HTMLSelectElement).options);
    const candidate = options.find((option) => !option.disabled && option.value);
    return candidate?.value || "";
  });

  if (!value) {
    return false;
  }

  await select.selectOption(value);
  return true;
}
