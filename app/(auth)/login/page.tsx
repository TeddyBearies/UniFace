"use client";

import type { FormEvent } from "react";
import { useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BACKGROUND_PATTERN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='116' height='116' viewBox='0 0 116 116'%3E%3Cg fill='none' stroke='%231098ae' stroke-width='4.5' stroke-opacity='.86'%3E%3Ccircle cx='0' cy='0' r='58'/%3E%3Ccircle cx='116' cy='0' r='58'/%3E%3Ccircle cx='0' cy='116' r='58'/%3E%3Ccircle cx='116' cy='116' r='58'/%3E%3C/g%3E%3Cg stroke='%231098ae' stroke-width='1.8' stroke-linecap='round' stroke-opacity='.72'%3E%3Cpath d='M54 58h8'/%3E%3Cpath d='M58 54v8'/%3E%3Cpath d='M55.2 55.2l5.6 5.6'/%3E%3Cpath d='M60.8 55.2l-5.6 5.6'/%3E%3C/g%3E%3C/svg%3E";

function Logo() {
  return (
    <img
      src="/haga-login-logo.svg"
      alt="Haga Inc"
      style={{
        width: "76px",
        height: "auto",
        display: "block",
      }}
    />
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: "20px",
        height: "20px",
        color: "#a3adbb",
        flex: "none",
      }}
    >
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: "20px",
        height: "20px",
        color: "#a3adbb",
        flex: "none",
      }}
    >
      <rect x="5" y="11" width="14" height="10" rx="1.5" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
      <circle cx="12" cy="16" r="1" />
    </svg>
  );
}

function StudentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: "22px",
        height: "22px",
        color: "#1098ae",
        flex: "none",
      }}
    >
      <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z" />
      <path d="M7 12v4.2c1.1 1.2 2.8 1.8 5 1.8s3.9-.6 5-1.8V12" />
      <path d="M21 9.5v5" />
    </svg>
  );
}

function InstructorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: "22px",
        height: "22px",
        color: "#1098ae",
        flex: "none",
      }}
    >
      <path d="M4 19v-2.2c0-2 1.6-3.6 3.6-3.6h8.8c2 0 3.6 1.6 3.6 3.6V19" />
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4 5h5" />
      <path d="M4 9h3" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: "22px",
        height: "22px",
        color: "#1098ae",
        flex: "none",
      }}
    >
      <path d="M12 3 6 6.2v5.6c0 4.2 2.7 7.9 6 9.2 3.3-1.3 6-5 6-9.2V6.2L12 3Z" />
      <circle cx="16.5" cy="16.5" r="2.5" />
      <path d="m18.2 18.2 2.3 2.3" />
    </svg>
  );
}

const QUICK_ACCESS_OPTIONS = [
  { label: "Continue as Student", icon: <StudentIcon /> },
  { label: "Continue as Instructor", icon: <InstructorIcon /> },
  { label: "Continue as Admin", icon: <AdminIcon /> },
];

const FOOTER_LINKS = ["Privacy Policy", "Terms of Service", "Support"];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"error" | "info">("error");

  const clearMessage = () => {
    if (message) {
      setMessage("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setMessageTone("error");
      setMessage("Please enter your email address and password.");
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setMessageTone("error");
      setMessage("Please enter a valid university email address.");
      return;
    }

    setMessageTone("info");
    setMessage("Login is not connected yet. This page is ready for backend integration.");
  };

  return (
    <div className="pageShell">
      <header className="topBar">
        <div className="topBarInner">
          <Logo />
          <p className="portalText">Secure Education Portal</p>
        </div>
      </header>

      <main className="mainArea">
        <section className="loginCard" aria-labelledby="login-title">
          <div className="cardHeading">
            <h1 id="login-title">Welcome back</h1>
            <p>Enter your credentials to access EduScan</p>
          </div>

          <form className="loginForm" onSubmit={handleSubmit} noValidate>
            <label className="fieldGroup" htmlFor="email">
              <span className="fieldLabel">Email Address</span>
              <span className="inputShell">
                <MailIcon />
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="username"
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    clearMessage();
                  }}
                />
              </span>
            </label>

            <div className="passwordHeader">
              <label className="fieldLabel" htmlFor="password">
                Password
              </label>
              <a
                href="#"
                className="forgotLink"
                onClick={(event) => event.preventDefault()}
              >
                Forgot password?
              </a>
            </div>

            <label className="fieldGroup" htmlFor="password">
              <span className="inputShell">
                <LockIcon />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="........"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    clearMessage();
                  }}
                />
              </span>
            </label>

            <p
              className={`message ${message ? "visible" : ""} ${messageTone}`}
              aria-live="polite"
              role="status"
            >
              {message || "\u00a0"}
            </p>

            <button className="loginButton" type="submit">
              Login
            </button>
          </form>

          <div className="quickAccess">
            <div className="divider">
              <span>QUICK ACCESS (DEV MODE)</span>
            </div>

            <div className="quickAccessList">
              {QUICK_ACCESS_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  className="quickAccessButton"
                  onClick={(event) => event.preventDefault()}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="supportLinks" aria-label="Support links">
          {FOOTER_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              onClick={(event) => event.preventDefault()}
            >
              {label}
            </a>
          ))}
        </div>
      </main>

      <footer className="copyright">
        <p>©2024 EduScan Platform. All rights reserved.</p>
      </footer>

      <style jsx>{`
        .pageShell {
          --accent: #1098ae;
          --accent-dark: #0b7f94;
          --accent-faint: #dff4f7;
          --text: #16213d;
          --muted: #727b8d;
          --line: #e8ecef;
          min-height: 100vh;
          background-color: #ffffff;
          color: var(--text);
        }

        .topBar {
          position: relative;
          background:
            radial-gradient(circle at 24px 24px, rgba(16, 152, 174, 0.025) 0, rgba(16, 152, 174, 0.025) 18px, transparent 18px),
            #ffffff;
          background-size: 72px 72px;
          border-bottom: 1px solid #eef2f5;
        }

        .topBarInner {
          max-width: 1760px;
          margin: 0 auto;
          padding: 16px 56px 14px;
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .portalText {
          margin: 0;
          color: #6d7688;
          font-size: 15px;
          font-weight: 500;
        }

        .mainArea {
          position: relative;
          overflow: hidden;
          min-height: calc(100vh - 77px);
          padding: 24px 20px 64px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #ffffff;
        }

        .mainArea::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("${BACKGROUND_PATTERN}");
          background-repeat: repeat;
          background-size: 116px 116px;
          background-position: center 0;
          opacity: 0.66;
          pointer-events: none;
        }

        .loginCard {
          position: relative;
          z-index: 1;
          width: min(100%, 520px);
          margin-top: 8px;
          padding: 42px 42px 34px;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.12);
          border: 1px solid #eef2f4;
        }

        .cardHeading {
          text-align: center;
          margin-bottom: 28px;
        }

        .cardHeading h1 {
          margin: 0;
          font-size: 34px;
          line-height: 1.1;
          letter-spacing: -0.03em;
          font-weight: 800;
          color: #101a39;
        }

        .cardHeading p {
          margin: 14px 0 0;
          font-size: 15px;
          line-height: 1.55;
          color: var(--muted);
        }

        .loginForm {
          display: flex;
          flex-direction: column;
        }

        .fieldGroup {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .fieldLabel {
          color: #2f3a52;
          font-size: 14px;
          font-weight: 700;
        }

        .inputShell {
          display: flex;
          align-items: center;
          gap: 12px;
          height: 52px;
          padding: 0 16px;
          border: 1px solid #e5e9ef;
          background: #ffffff;
          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;
        }

        .inputShell:focus-within {
          border-color: #aadfe7;
          box-shadow: 0 0 0 2px rgba(16, 152, 174, 0.1);
        }

        input {
          width: 100%;
          padding: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #374151;
          font: inherit;
          font-size: 15px;
        }

        input::placeholder {
          color: #939fb1;
        }

        .passwordHeader {
          margin-top: 28px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .forgotLink {
          color: var(--accent);
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
        }

        .forgotLink:hover {
          text-decoration: underline;
        }

        .message {
          min-height: 20px;
          margin: 12px 0 14px;
          font-size: 13px;
          line-height: 1.5;
          color: transparent;
        }

        .message.visible.error {
          color: #c0362c;
        }

        .message.visible.info {
          color: #2f6e79;
        }

        .loginButton {
          height: 52px;
          border: 0;
          border-radius: 2px;
          background: var(--accent);
          color: #ffffff;
          font: inherit;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(16, 152, 174, 0.25);
          transition: background-color 0.15s ease;
        }

        .loginButton:hover {
          background: var(--accent-dark);
        }

        .quickAccess {
          margin-top: 42px;
        }

        .divider {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
          color: #747d8b;
          font-size: 12px;
          letter-spacing: 0.04em;
          text-align: center;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          border-top: 1px solid #eceff2;
        }

        .divider span {
          padding: 0 12px;
          white-space: nowrap;
        }

        .quickAccessList {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .quickAccessButton {
          display: flex;
          align-items: center;
          gap: 14px;
          width: 100%;
          min-height: 54px;
          padding: 0 18px;
          border: 1px solid #d3edf1;
          background: #f7fcfd;
          color: #16213d;
          font: inherit;
          font-size: 15px;
          font-weight: 700;
          text-align: left;
          cursor: pointer;
        }

        .quickAccessButton:hover {
          background: #f1fafb;
        }

        .supportLinks {
          position: relative;
          z-index: 1;
          margin-top: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 36px;
          padding: 16px 30px;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.12);
        }

        .supportLinks a {
          color: #374151;
          font-size: 15px;
          text-decoration: none;
        }

        .supportLinks a:hover {
          color: var(--accent-dark);
        }

        .copyright {
          margin-top: -42px;
          padding: 0 20px 18px;
          text-align: center;
          pointer-events: none;
        }

        .copyright p {
          margin: 0;
          color: #6c7383;
          font-size: 14px;
        }

        @media (max-width: 680px) {
          .topBarInner {
            padding: 14px 18px 12px;
            min-height: 72px;
          }

          .logoGraphic {
            width: 88px;
          }

          .portalText {
            font-size: 13px;
            text-align: right;
          }

          .mainArea {
            padding: 20px 14px 42px;
          }

          .loginCard {
            padding: 28px 20px 24px;
          }

          .cardHeading h1 {
            font-size: 28px;
          }

          .passwordHeader {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .supportLinks {
            width: calc(100% - 28px);
            gap: 18px;
            padding: 14px 18px;
            flex-wrap: wrap;
          }

          .copyright {
            margin-top: -18px;
            padding-bottom: 14px;
          }
        }
      `}</style>
    </div>
  );
}
