import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Haga FaceID",
  description: "Facial Recognition Attendance System",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "#f3f5f7",
          color: "#0f172a",
          fontFamily: '"Public Sans", "Segoe UI", sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
