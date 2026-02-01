"use client";

import React from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

const stats = [
  {
    title: "Total Students",
    value: "2,450",
    trend: "+12% this semester",
    icon: "groups",
    color: "neon-blue",
    trendIcon: "trending_up",
    trendColor: "text-emerald-400",
  },
  {
    title: "Active Courses",
    value: "34",
    trend: "2 new courses added",
    icon: "library_books",
    color: "neon-purple",
    trendIcon: "add",
    trendColor: "text-emerald-400",
  },
  {
    title: "Sessions Today",
    value: "12",
    trend: "4 active now",
    icon: "event_available",
    color: "neon-amber",
    trendIcon: "schedule",
    trendColor: "text-slate-400",
  },
  {
    title: "Present Today",
    value: "845",
    trend: "92% rate",
    icon: "co_present",
    color: "neon-emerald",
    trendIcon: "check_circle",
    trendColor: "text-emerald-400",
  },
];

const recentActivity = [
  {
    timestamp: "Today, 10:42 AM",
    user: "Mark T.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSO7wgLwLrTHtzuP1MR88v4Hg1ObbpRaZZAEymLyyIGMHPjHhF_RUZClSd8LCpCde8MSLMsIMKULIjd_p7t4fJXbWOmHQZoBHayYyQNezPre54_is5cHrq-dFdDqm761-8vWtZ6SNNQVYFPJb3OoVztaLl4CeKp4Q_BX2ERS19zSde4DA1t6P1XnduRck78QPhIsinZtXIRryp-nnZKPrfeDEoZ1wDI4ySJXQJQlWXvPOoMmXjwmO91zVK1XqnH__4mHxZMBmnxq0",
    action: "Started Session",
    context: "CS101 - Lecture Hall A",
    status: "Active",
    statusColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    timestamp: "Today, 10:15 AM",
    user: "System Bot",
    avatar: "SYS",
    action: "Auto-generated Report",
    context: "Weekly Attendance Summary",
    status: "Completed",
    statusColor: "bg-slate-800 text-slate-400 border-slate-700",
  },
  {
    timestamp: "Today, 09:30 AM",
    user: "Sarah L.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ5sKUIVdyCJaQtafl-R9CMPDzdtUgOf7i6q3cg_NSypPMAZSXJzU8ofPb_KfT3y4HzNAkfcz9BdWJhvYPGk87fy8HwdZksmIoBDPTfFFjMqCmbyB5LIF3GkMOXWEV0vJ3GX9_v675oSbmgushskoAYYpCHcM7xOQQFJj4Z3lN7gfKMSJ1NMiu2_CCJ7aLXYC6PF2Y1kXYA-CRkj1KTEOCub2PkN4fVTFxl-vKM3-bXmCBDgsj-sRWVkitre6iBKcgsZExqjrN8Ac",
    action: "Manual Override",
    context: "Student ID #88492 (Late)",
    status: "Logged",
    statusColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    timestamp: "Yesterday, 04:50 PM",
    user: "David K.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2OqoJB-j-ExshmOxjSI3RyGt9sJSHv5ncsdjNSqnlc3YdPau3tlcBkviVZI-IbsCjj6q37BA8qAefDu_7AS3yUcudciVFQ1dlDM2Eg9OmhdxfAs9ZjLU9BHQSWI9V6cUTcjofq4w_bTqlO7x0OPUzxW5ePyZyNvD3o5qs0fEcK2Mrq9T-hvdcCa3lUyIPZpmU7cLDslWLijvqWexoebjrtFzExqj2vf5IOGPztWnVDfD-xpY8FRJ2UBmNYfj3EzR5EeQifwMO-ys",
    action: "Added New Course",
    context: "ENG202 - Adv. Physics",
    status: "Completed",
    statusColor: "bg-slate-800 text-slate-400 border-slate-700",
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold text-white">Good Morning, Jane</h2>
        <p className="text-slate-500 mt-1">Here's what's happening on campus today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`bg-surface-dark p-6 rounded-xl border border-slate-800/50 flex flex-col justify-between h-36 relative overflow-hidden group shadow-[0_0_15px_-3px_rgba(0,0,0,0.3)] transition-all hover:border-primary/30`}
          >
            <div className="flex justify-between items-start z-10">
              <div className="flex flex-col">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{stat.title}</span>
                <span className="text-3xl font-bold text-white mt-2">{stat.value}</span>
              </div>
              <div className={`p-2.5 bg-primary/10 rounded-lg text-primary border border-primary/20`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendColor} z-10`}>
              <span className="material-symbols-outlined text-base">{stat.trendIcon}</span>
              <span>{stat.trend}</span>
            </div>
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-dark rounded-xl border border-slate-800 overflow-hidden flex flex-col md:flex-row shadow-xl">
          <div className="p-8 md:w-2/3 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary/10 p-1.5 rounded text-primary border border-primary/20">
                <span className="material-symbols-outlined text-xl">bolt</span>
              </div>
              <h3 className="text-lg font-bold text-white">Quick Session Start</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Select a course and date to immediately launch the facial recognition attendance engine.
            </p>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</label>
                <select className="w-full h-11 rounded-lg bg-background-dark border-slate-700 text-sm text-white focus:ring-primary focus:border-primary border outline-none px-3">
                  <option>CS101 - Intro to Algo</option>
                  <option>ENG202 - Adv. Physics</option>
                  <option>ART104 - Graphic Design</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
                <input
                  className="w-full h-11 rounded-lg bg-background-dark border-slate-700 text-sm text-white focus:ring-primary focus:border-primary border outline-none px-3"
                  type="date"
                  defaultValue="2023-10-24"
                />
              </div>
              <div className="sm:col-span-2 mt-2">
                <Link
                  href="/session"
                  className="w-full inline-flex justify-center items-center gap-2 bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-xl">play_circle</span>
                  Start Attendance Session
                </Link>
              </div>
            </form>
          </div>
          <div className="hidden md:flex md:w-1/3 bg-slate-900/50 items-center justify-center relative overflow-hidden border-l border-slate-800">
            <div
              className="absolute inset-0 opacity-5"
              style={{ backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)", backgroundSize: "20px 20px" }}
            ></div>
            <div className="text-center p-6 relative z-10">
              <div className="bg-surface-dark rounded-full p-5 shadow-2xl inline-block mb-3 border border-slate-700">
                <span className="material-symbols-outlined text-4xl text-primary">center_focus_strong</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Biometric Sensors Ready</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 bg-surface-dark rounded-xl border border-slate-800 flex flex-col shadow-xl">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-white">System Status</h3>
            <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Operational
            </span>
          </div>
          <div className="p-5 flex flex-col gap-5 flex-1">
            <div className="flex items-start gap-3">
              <div className="relative mt-1">
                <div className="size-2.5 rounded-full bg-emerald-500"></div>
                <div className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-pulse"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Recognition Model v2.4</p>
                <p className="text-xs text-slate-500">Active (99.8% precision)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 size-2.5 rounded-full bg-emerald-500"></div>
              <div>
                <p className="text-sm font-medium text-slate-200">Server Connection</p>
                <p className="text-xs text-slate-500">Latency: 24ms (Excellent)</p>
              </div>
            </div>
            <hr className="border-slate-800 my-1" />
            <div className="flex gap-3 bg-amber-500/5 p-3.5 rounded-lg border border-amber-500/20">
              <span className="material-symbols-outlined text-amber-500 text-xl shrink-0">warning</span>
              <div>
                <p className="text-sm font-medium text-amber-100">Camera Tip</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Room 304 camera reports low light. Attendance accuracy may drop slightly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-dark rounded-xl border border-slate-800 flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-800 flex flex-wrap gap-4 justify-between items-center">
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          <div className="flex gap-3">
            <button className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors">
              Export Logs
            </button>
            <button className="text-xs font-semibold text-primary px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-800">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Course/Context</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {recentActivity.map((activity, idx) => (
                <tr key={idx} className="group hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{activity.timestamp}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {activity.avatar === "SYS" ? (
                        <div className="size-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
                          SYS
                        </div>
                      ) : (
                        <div
                          className="size-8 rounded-full bg-cover bg-center border border-slate-700"
                          style={{ backgroundImage: `url('${activity.avatar}')` }}
                        ></div>
                      )}
                      <span className="font-medium text-slate-200">{activity.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{activity.action}</td>
                  <td className="px-6 py-4 text-slate-500">{activity.context}</td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${activity.statusColor}`}
                    >
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="mt-4 py-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2023 University Attendance Systems. All rights reserved.</p>
        <div className="flex gap-6">
          <a className="hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Terms of Service
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Help Center
          </a>
        </div>
      </footer>
    </DashboardLayout>
  );
}
