import nodemailer from "nodemailer";
import type { AppRole } from "@/features/auth/types";

type SendAccountCredentialsEmailInput = {
  email: string;
  fullName: string;
  role: AppRole;
  universityId: string | null;
  temporaryPassword: string;
};

function getRequiredEmailEnv() {
  const host = String(process.env.SMTP_HOST || "").trim();
  const portRaw = String(process.env.SMTP_PORT || "").trim();
  const user = String(process.env.SMTP_USER || "").trim();
  const pass = String(process.env.SMTP_PASS || "").trim();
  const from = String(process.env.SMTP_FROM || "").trim();

  if (!host || !portRaw || !user || !pass || !from) {
    throw new Error(
      "Missing SMTP email configuration. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.",
    );
  }

  const port = Number.parseInt(portRaw, 10);
  if (Number.isNaN(port) || port < 1) {
    throw new Error("SMTP_PORT must be a valid positive number.");
  }

  return {
    host,
    port,
    user,
    pass,
    from,
  };
}

function getRoleLabel(role: AppRole) {
  if (role === "student") {
    return "Student";
  }

  if (role === "instructor") {
    return "Instructor";
  }

  return "Admin";
}

function getIdLabel(role: AppRole) {
  if (role === "student") {
    return "Student ID";
  }

  if (role === "instructor") {
    return "Instructor ID";
  }

  return "User ID";
}

export async function sendAccountCredentialsEmail(
  input: SendAccountCredentialsEmailInput,
) {
  const smtp = getRequiredEmailEnv();
  const roleLabel = getRoleLabel(input.role);
  const idLabel = getIdLabel(input.role);
  const userIdLabel = input.universityId || "Not assigned";

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  const subject = "Your Haga FaceID account credentials";
  const text = [
    `Hello ${input.fullName || "User"},`,
    "",
    "Your Haga FaceID account has been created.",
    `Role: ${roleLabel}`,
    `${idLabel}: ${userIdLabel}`,
    `Temporary Password: ${input.temporaryPassword}`,
    "",
    "Use these credentials to sign in.",
    "For security, change your password after your first login.",
  ].join("\n");

  const html = [
    `<p>Hello ${input.fullName || "User"},</p>`,
    "<p>Your Haga FaceID account has been created.</p>",
    "<p>",
    `<strong>Role:</strong> ${roleLabel}<br/>`,
    `<strong>${idLabel}:</strong> ${userIdLabel}<br/>`,
    `<strong>Temporary Password:</strong> ${input.temporaryPassword}`,
    "</p>",
    "<p>Use these credentials to sign in.</p>",
    "<p>For security, change your password after your first login.</p>",
  ].join("");

  await transporter.sendMail({
    from: smtp.from,
    to: input.email,
    subject,
    text,
    html,
  });
}
