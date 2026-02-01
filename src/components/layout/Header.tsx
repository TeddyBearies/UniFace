"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const path = pathname.split("/").filter(Boolean);
    if (path.length === 0) return [{ name: "Home", href: "/" }];
    return path.map((p, i) => ({
      name: p.charAt(0).toUpperCase() + p.slice(1),
      href: "/" + path.slice(0, i + 1).join("/"),
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-20 px-8 flex items-center justify-between bg-background-dark/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((bc, i) => (
          <React.Fragment key={bc.href}>
            {i > 0 && <span className="text-slate-700">/</span>}
            <span className={i === breadcrumbs.length - 1 ? "text-white font-medium" : "text-slate-500"}>
              {bc.name}
            </span>
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">
            search
          </span>
          <input
            className="h-10 w-80 rounded-full bg-surface-dark border-slate-800 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary text-slate-200 placeholder-slate-500 border outline-none"
            placeholder="Search students, courses..."
            type="text"
          />
        </div>
        <button className="relative p-2 text-slate-400 hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-background-dark"></span>
        </button>
        <button className="p-2 text-slate-400 hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-symbols-outlined">help</span>
        </button>
      </div>
    </header>
  );
}
