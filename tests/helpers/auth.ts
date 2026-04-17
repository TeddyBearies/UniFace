import { expect, type Locator, type Page } from "@playwright/test";
import { DEFAULT_PLAYWRIGHT_FLAGS, DEFAULT_ROLE_CREDENTIALS } from "./test-data";

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
  return Boolean(
    process.env[envMap.email] ||
      process.env[envMap.password] ||
      DEFAULT_ROLE_CREDENTIALS[role].email ||
      DEFAULT_ROLE_CREDENTIALS[role].password,
  );
}

export function getRoleCredentials(role: AppRole): RoleCredentials {
  const envMap = ROLE_ENV_MAP[role];
  const email = process.env[envMap.email] || DEFAULT_ROLE_CREDENTIALS[role].email;
  const password = process.env[envMap.password] || DEFAULT_ROLE_CREDENTIALS[role].password;

  if (!email || !password) {
    throw new Error(`Missing credentials for ${role}. Set ${envMap.email} and ${envMap.password}.`);
  }

  return {
    email,
    password,
    expectedPath: DEFAULT_ROLE_CREDENTIALS[role].expectedPath,
  };
}

export function isMutationTestingEnabled() {
  if (process.env.PLAYWRIGHT_ENABLE_MUTATION_TESTS) {
    return process.env.PLAYWRIGHT_ENABLE_MUTATION_TESTS === "1";
  }

  return DEFAULT_PLAYWRIGHT_FLAGS.mutationTestsEnabled;
}

export function isReportDownloadTestingEnabled() {
  if (process.env.PLAYWRIGHT_ENABLE_REPORT_DOWNLOAD_TESTS) {
    return process.env.PLAYWRIGHT_ENABLE_REPORT_DOWNLOAD_TESTS === "1";
  }

  return DEFAULT_PLAYWRIGHT_FLAGS.reportDownloadTestsEnabled;
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
  const loginHeading = page.getByRole("heading", { name: /welcome back/i });
  const loginButton = page.getByRole("button", { name: /^login$/i });

  await Promise.race([
    page.waitForURL((url) => url.pathname === "/login", { timeout: 15_000 }),
    loginHeading.waitFor({ state: "visible", timeout: 15_000 }),
  ]);

  await expect(loginHeading).toBeVisible();
  await expect(loginButton).toBeVisible();
}

export async function clickLogout(page: Page) {
  await page.getByRole("button", { name: /logout/i }).click();
  await expectRedirectedToLogin(page);
}

export async function selectFirstUsableOption(select: Locator) {
  await select.waitFor({ state: "visible", timeout: 15_000 });

  const options = await select.locator("option").evaluateAll((nodes) =>
    nodes.map((node) => {
      const option = node as HTMLOptionElement;
      return {
        value: option.value,
        disabled: option.disabled,
      };
    }),
  );

  const candidate = options.find((option) => !option.disabled && option.value);
  const value = candidate?.value || "";

  if (!value) {
    return false;
  }

  await select.selectOption(value);
  return true;
}
