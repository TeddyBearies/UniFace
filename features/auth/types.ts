export const APP_ROLES = ["student", "instructor", "admin"] as const;

export type AppRole = (typeof APP_ROLES)[number];

export function isAppRole(value: unknown): value is AppRole {
  return APP_ROLES.includes(value as AppRole);
}
