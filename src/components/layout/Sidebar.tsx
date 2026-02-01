"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { name: "Live Attendance", icon: "videocam", href: "/session" },
  { name: "Students", icon: "school", href: "/students" },
  { name: "Courses", icon: "book", href: "/courses" },
  { name: "Reports", icon: "bar_chart", href: "/analytics" },
  { name: "Attendance History", icon: "history", href: "/attendance" },
  { name: "Settings", icon: "settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-72 flex-col justify-between border-r border-slate-800 bg-sidebar-dark transition-colors duration-300 h-screen sticky top-0">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-2xl">face</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-lg font-bold leading-none tracking-tight">UniAttendance</h1>
            <p className="text-slate-500 text-xs font-normal mt-1">Admin Console</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? "bg-primary/10 border border-primary/20 text-primary"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <span
                  className={`material-symbols-outlined ${isActive ? "text-primary" : "group-hover:text-primary"}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <p className="text-sm font-medium">{item.name}</p>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
            <div
              className="size-10 rounded-full bg-cover bg-center border-2 border-slate-700 shadow-sm"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB-w4dxlmawGopkN4XFXP3kPliiBP68b_jWzePZ3Ncu-O4mo0BT7rVhEJFXQr-P6ysYFbJen2EBrW9GfXGcMPClqizmy-okmQm-dXBJBtuNc8v2UuYNOteGY8jlahHAfoChMLxA-9rS4UNNDYBaFeBU8LhwAJeKYW2XXCGpL2Je8GMGq5BeyoCEWaVpGVI7npskfYO39FJcC5nkFyBDDgbIBA_Mon-UJU2S_KZGM7rwRoLqPi_9RvrrNO3DD9pzKJFm4_I2vZzInVw')",
              }}
            ></div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-white text-sm font-semibold truncate">Jane Admin</p>
              <p className="text-slate-500 text-xs truncate">System Administrator</p>
            </div>
            <span className="material-symbols-outlined ml-auto text-slate-500">more_vert</span>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium">Log Out</p>
          </Link>
        </div>
      </div>
    </aside>
  );
}
