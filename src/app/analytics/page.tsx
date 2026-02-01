"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const kpis = [
  {
    title: "System-wide Attendance",
    value: "85.2",
    unit: "%",
    trend: "+2.4%",
    icon: "donut_large",
    color: "primary",
  },
  {
    title: "Total Verified Sessions",
    value: "1,420",
    unit: "",
    trend: "+12%",
    icon: "event_available",
    color: "accent-purple",
  },
  {
    title: "Avg Students Per Class",
    value: "42",
    unit: "",
    trend: "-1.5%",
    trendDown: true,
    icon: "groups_3",
    color: "accent-cyan",
  },
];

const students = [
  {
    name: "Alice Johnson",
    id: "#402238",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnkwfJxnNM039NyRqhF0rYQllE1kJ5Wcx5LQn_phZg_P5bVMvLGgzOa5MSSjHCds9T0xvbdRos0bXmwiJPCdOsi709P7NWc3cYud1w4KG-i6-a7oChaTO64HeVPAOP5sfFzPSmZp-D1ivKwVp4UknWAXT8-4p0HZWgfOOGp6kJ_5qAMwgZwNlw8bWrToSOeie3g_7U5jhCeSppYtktyipoQ1LDcJAZNwBJ8_VzJsSSEOoUlGq5jwIPJLtHnqT3mVx5Hv3JwzaFaJA",
    course: "CompSci 101",
    sessions: "24 / 25",
    performance: 96,
    status: "Excellent",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    name: "Michael Chen",
    id: "#402241",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuASbVpRa621qbGn2p0BXkD0AGZ_GEaf4q96A1QraClfz3p2Lq7DqLQQqTCcqWOBooBOnKtZ2zzLunT5mKHPGVzplGqY1n2Wxvz3Rfn79diCghfB8iFSavdNjdi_bn6GsLHevYBoHMsBcUUnVTF4Lm72LT-MbrgTSXYzEio38OWuI_U8U2cUZNLUbbmTO1FJoA-Pd0sOps-SK5FY4ViAMiOHIAHrTobB7mfbv-PkaiWOgC4lZs8xT9UaQYWpGT9fg-hDAyhTP-XrFEQ",
    course: "Physics 202",
    sessions: "18 / 25",
    performance: 72,
    status: "Monitoring",
    statusColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  },
  {
    name: "Sarah Connor",
    id: "#402299",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAg7qesz1oFceFnQEWWS9z0p8KPGfcy8eN9bdBzzTdBrFRZQpQBnM4IymFohuiTGJz3ZynsD7MF0binoKA-ZikGWBgEoIHJTY9xoq8hG1WkhkHw-OJvUMbWN_rVC0LLFY68xUBZatIWXXlahCc2ARCBU5q9qN9DoD03Y-FTILJtZhb-4cUqPzVy6yuKAqdNLMAK2g6Kyf-sHJEsOBomtbHQiZb41904jaZra9L7ekKOk6aWcL0Rcnfr4kEYT01FFuj_0aeYp0ylivg",
    course: "CompSci 101",
    sessions: "12 / 25",
    performance: 48,
    status: "At Risk",
    statusColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">Attendance Analytics</h1>
          <p className="text-gray-400 text-base max-w-2xl font-body">
            Real-time insights from biometric face recognition logs for the Spring 2024 semester.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white font-medium text-sm transition-all">
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            <span>Refresh Logs</span>
          </button>
          <button className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>Export Reports</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className={`bg-card-dark rounded-2xl p-6 border border-gray-800 shadow-xl flex flex-col justify-between group hover:border-primary/50 transition-all duration-300`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 bg-primary/10 rounded-xl text-primary border border-primary/20`}>
                <span className="material-symbols-outlined text-2xl">{kpi.icon}</span>
              </div>
              <span
                className={`flex items-center ${
                  kpi.trendDown ? "text-rose-400 bg-rose-400/10 border-rose-400/20" : "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                } border px-2 py-1 rounded-lg text-xs font-bold`}
              >
                <span className="material-symbols-outlined text-sm mr-1">
                  {kpi.trendDown ? "trending_down" : "trending_up"}
                </span>{" "}
                {kpi.trend}
              </span>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{kpi.title}</p>
              <h3 className="text-4xl font-bold text-white tracking-tight">
                {kpi.value}
                <span className="text-primary text-2xl ml-1">{kpi.unit}</span>
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card-dark rounded-2xl border border-gray-800 shadow-2xl p-7 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-xl text-white">Participation Trends</h3>
              <p className="text-sm text-gray-500">Historical data (30-day window)</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-gray-800 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-700 transition-colors">
                Daily
              </button>
              <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-primary/20">
                Weekly
              </button>
            </div>
          </div>
          <div className="relative h-72 w-full mt-auto">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
              <defs>
                <linearGradient id="neonGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"></stop>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <line className="stroke-gray-800" strokeWidth="0.3" x1="0" x2="100" y1="10" y2="10"></line>
              <line className="stroke-gray-800" strokeWidth="0.3" x1="0" x2="100" y1="25" y2="25"></line>
              <line className="stroke-gray-800" strokeWidth="0.3" x1="0" x2="100" y1="40" y2="40"></line>
              <path d="M0 40 Q 15 38, 25 30 T 50 20 T 75 25 T 100 12 V 50 H 0 Z" fill="url(#neonGradient)"></path>
              <path
                className="chart-glow-primary"
                d="M0 40 Q 15 38, 25 30 T 50 20 T 75 25 T 100 12"
                fill="none"
                stroke="#3b82f6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              ></path>
              <circle cx="25" cy="30" fill="#0b0f1a" r="1.5" stroke="#3b82f6" strokeWidth="1.5"></circle>
              <circle cx="50" cy="20" fill="#0b0f1a" r="1.5" stroke="#3b82f6" strokeWidth="1.5"></circle>
              <circle cx="100" cy="12" fill="#0b0f1a" r="1.5" stroke="#3b82f6" strokeWidth="1.5"></circle>
            </svg>
            <div className="flex justify-between text-xs text-gray-500 mt-4 font-bold uppercase tracking-widest">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        <div className="bg-card-dark rounded-2xl border border-gray-800 shadow-2xl p-7 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-xl text-white">Department Leaders</h3>
              <p className="text-sm text-gray-500 font-body">Average rate by department</p>
            </div>
            <button className="text-gray-400 hover:text-white bg-gray-800/50 p-1.5 rounded-lg transition-colors">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div className="flex items-end justify-between h-72 gap-6 px-4">
            {[
              { label: "Arts", height: "60%", barHeight: "45%", color: "bg-primary" },
              { label: "STEM", height: "85%", barHeight: "75%", color: "bg-accent-cyan" },
              { label: "Med", height: "95%", barHeight: "90%", color: "bg-primary" },
              { label: "Law", height: "55%", barHeight: "40%", color: "bg-accent-purple" },
            ].map((dept) => (
              <div key={dept.label} className="flex flex-col items-center gap-4 flex-1 group">
                <div className="w-full bg-gray-800/50 rounded-xl relative h-full flex items-end overflow-hidden">
                  <div
                    className={`${dept.color} opacity-40 absolute bottom-0 transition-all duration-700 rounded-t-lg w-full`}
                    style={{ height: dept.height }}
                  ></div>
                  <div
                    className={`${dept.color} absolute bottom-0 transition-all duration-700 rounded-t-lg shadow-[0_0_15px_rgba(59,130,246,0.3)] w-full`}
                    style={{ height: dept.barHeight }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">
                  {dept.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card-dark rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/20">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">analytics</span>
            Detailed Attendance Log
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]">
                search
              </span>
              <input
                className="pl-10 pr-4 py-2 text-sm bg-gray-800 border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:ring-1 focus:ring-primary focus:border-primary w-full md:w-64 outline-none border"
                placeholder="Search student ID or name..."
                type="text"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm font-semibold text-white hover:bg-gray-700 transition-colors">
              <span className="material-symbols-outlined text-[18px]">ios_share</span>
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 text-[10px] font-black text-gray-500 uppercase tracking-[0.1em]">
                <th className="p-5 border-b border-gray-800 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-gray-700 bg-gray-800 text-primary focus:ring-0 w-4 h-4"
                  />
                </th>
                <th className="p-5 border-b border-gray-800">Student Identity</th>
                <th className="p-5 border-b border-gray-800">Assigned Course</th>
                <th className="p-5 border-b border-gray-800">Sessions</th>
                <th className="p-5 border-b border-gray-800">Performance</th>
                <th className="p-5 border-b border-gray-800">Status</th>
                <th className="p-5 border-b border-gray-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm font-body">
              {students.map((student, idx) => (
                <tr key={idx} className="hover:bg-primary/5 transition-colors">
                  <td className="p-5">
                    <input
                      type="checkbox"
                      className="rounded border-gray-700 bg-gray-800 text-primary focus:ring-0 w-4 h-4"
                    />
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 rounded-xl overflow-hidden border border-gray-700 p-0.5 bg-gray-800">
                        <img alt={student.name} className="size-full object-cover rounded-lg" src={student.avatar} />
                      </div>
                      <div>
                        <p className="font-bold text-white">{student.name}</p>
                        <p className="text-xs text-gray-500">ID: {student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-gray-300">{student.course}</td>
                  <td className="p-5 text-gray-300 font-medium">{student.sessions}</td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            student.performance > 90 ? "bg-emerald-500" : student.performance > 60 ? "bg-yellow-500" : "bg-rose-500"
                          } shadow-[0_0_8px_rgba(16,185,129,0.5)]`}
                          style={{ width: `${student.performance}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-black ${
                        student.performance > 90 ? "text-emerald-400" : student.performance > 60 ? "text-yellow-400" : "text-rose-400"
                      }`}>{student.performance}%</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${student.statusColor}`}>
                      <span className={`size-1.5 rounded-full ${student.performance > 90 ? "bg-emerald-400 animate-pulse" : student.performance > 60 ? "bg-yellow-400" : "bg-rose-400"}`}></span>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-gray-800 flex items-center justify-between bg-gray-900/10">
          <p className="text-sm text-gray-500">
            Displaying <span className="font-bold text-white">1 - 3</span> of <span className="font-bold text-white">142</span> records
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="size-9 rounded-lg bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20">1</button>
            <button className="size-9 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 text-xs font-bold">2</button>
            <button className="size-9 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 text-xs font-bold">3</button>
            <button className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
