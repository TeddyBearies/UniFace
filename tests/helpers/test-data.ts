import type { AppRole } from "./auth";

export const DEFAULT_ROLE_CREDENTIALS: Record<
  AppRole,
  { email: string; password: string; expectedPath: string }
> = {
  student: {
    email: "hassanrasmy2005@gmail.com",
    password: "Pass1234$",
    expectedPath: "/student/dashboard",
  },
  instructor: {
    email: "h.rasmy.business@gmail.com",
    password: "Pass1234$",
    expectedPath: "/instructor/dashboard",
  },
  admin: {
    email: "anasayman232@gmail.com",
    password: "Pass1234$",
    expectedPath: "/admin/dashboard",
  },
};

export const DEFAULT_PLAYWRIGHT_FLAGS = {
  mutationTestsEnabled: true,
  reportDownloadTestsEnabled: true,
};

export const DEFAULT_STUDENT_FIXTURES = {
  enrollmentStudentId: "20260001",
  enrollmentStudentName: "Hassan Rasmy",
  resetStudentQuery: "20260001",
};
