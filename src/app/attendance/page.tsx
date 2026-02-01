"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const records = [
  {
    date: "Oct 24, 2023",
    course: "Intro to AI (CS-400)",
    student: "Sarah Jenkins",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhPt3p78d2EmFukGJ3KLiktMqaIQER085V21LePvQbNpQY0TmGIQEO9D9lyjX9O_fXGU6-lQ3DsYDFIFhszTWmDykjxLrvDQeJHfx8GEikYsbqLEMJKSeMPUBWLPFy591-Q8RLRHSz2UHZ0ZtSVPpqjjDuk-nd53KpZNsnS_VzQosY_nKZ3Q2w9wqL8n0R90GhG9KSqBrKXe34MldJwLcefs0TF0XvA2QJjjwu48atl-z2O607GNoJ4NYrgI1xSTPwJZOGNfZh2N4",
    timeIn: "09:02 AM",
    status: "Present",
    markedBy: "System (AI)",
    markedByIcon: "smart_toy",
  },
  {
    date: "Oct 24, 2023",
    course: "Intro to AI (CS-400)",
    student: "Michael Chen",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBChmV2LJdHajtJgU1rVoOlaSBShAabiSJb0V_y9yBLa3Q0U3D2u150ZKxYCUjqfWzxnZ6AT-gJmNyAkO_S-MMqlYVIVGsCJ3hF6z7COTKeP8PLrqCQu4mQmNCwSKDN5ABNmuV5oaNxE0XPrmXQHXEmsI5S3aB2L5r1IgaBIQFQit3ZLHHSWyZ41E1K0t8Bgi7X3vTNr-j0ZsFF9NWjX_yKEn90D49c6BWcrRlQ1OgTstp_Gphi-XQWZRXAo2qEg-94ig_tswxnC4c",
    timeIn: "--:--",
    status: "Absent",
    markedBy: "System (AI)",
    markedByIcon: "smart_toy",
  },
  {
    date: "Oct 24, 2023",
    course: "Lit. Analysis (ENG-202)",
    student: "Jessica Lee",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqMuus-Eoz4nYIgvtJGSTRqlQuKsEBYP8D6_dL4Cwga--e4phfUqorpNM4AXNM1gO80PkSljxRGvpHWk8MMkR9MOp0Wecc5-dawLjKnl79ps0hhhO3x4JT5bp1RczRbx6E8-smH2ErhU3szKYgACWUJpB8ctglFvb990nTCICXsGQ-LQb117HCbvklasFingMEKG2n4jXFIYczjIitKNE4X0yz21qxwzshZA9ljh-DU9fvtrQYrs2D3jAT8YW8InKUMyxg0Gqo8Pg",
    timeIn: "09:45 AM",
    status: "Late",
    markedBy: "Manual",
    markedByIcon: "manage_accounts",
  },
  {
    date: "Oct 24, 2023",
    course: "Intro to AI (CS-400)",
    student: "David Kim",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtP87gHLXR4GT9CkWECQfQ7XUv7vJfe_KD4NAFSphmBGlgjT55lbnNEcoGgDXdaWLmyaFlnJHDH40OALPYIwhV0wgWTk68he3RNxDyU6kbPRcCARxNkaq-zbtMwTAjFQa6hH6GMvUAvHnuDsIeeGAz39l42hzzw6qSXFgDS9WcLX1MUCsOSMVye5p1eDGPZeSB6omfuin5kH0uSzQLD7zA9fQkIylz8CKi6JVLop7uudZ0BIX0_zOY8RSkNomVZ6CUYVAT778f940",
    timeIn: "09:05 AM",
    status: "Present",
    markedBy: "System (AI)",
    markedByIcon: "smart_toy",
  },
  {
    date: "Oct 24, 2023",
    course: "Design Fund. (ART-101)",
    student: "Emily Blunt",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3zH3lF2O3fZxrpvUedWGZY1mf4Z3qhLTx-1wXdQWDkKb8WLjLaYojbKPH8d6nXzjQn23iEJN8OLSPtRPinsKHy6WNre6aWEdklvLSojrrEnYF6udooWzXKYovqfmbr4quuTIWjVIf2j4WnO50kKmg5sCL4DhDxDNhYRqb6yzKwQmjzILZMcju5fJPvSue4E9D3gkUI4rAMEvJMlHc7HCDkw9wX2Kq_AlmaJ7vF10vouXCKouYeumxJavKq5rKWk07EqFVy0FtWZo",
    timeIn: "10:15 AM",
    status: "Late",
    markedBy: "System (AI)",
    markedByIcon: "smart_toy",
  },
];

export default function AttendanceHistoryPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Attendance Records</h1>
          <p className="text-slate-400 max-w-2xl">
            Audit and manage student attendance logs. Review system-generated records and manual adjustments.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 font-semibold text-sm hover:bg-slate-700 transition-colors shadow-lg">
            <span className="material-symbols-outlined text-[20px]">print</span>
            <span className="hidden sm:inline">Print Report</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-blue-900/20">
            <span className="material-symbols-outlined text-[20px]">download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-card-dark p-5 rounded-xl border border-slate-800 shadow-xl flex flex-col lg:flex-row gap-5">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">
            Search Student
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-500">search</span>
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg bg-input-dark text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all sm:text-sm outline-none"
              placeholder="Search by name or student ID..."
              type="text"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 flex-1 lg:justify-end">
          <div className="w-full sm:w-auto min-w-[180px]">
            <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">Course</label>
            <div className="relative">
              <select className="block w-full pl-3 pr-10 py-2.5 text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg bg-input-dark text-slate-200 appearance-none outline-none">
                <option>All Courses</option>
                <option>CS-101 Intro to CS</option>
                <option>CS-400 Intro to AI</option>
                <option>ENG-202 Lit. Analysis</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">Date</label>
            <div className="relative">
              <input
                className="block w-full px-3 py-2.5 text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg bg-input-dark text-slate-200 outline-none"
                type="date"
                defaultValue="2023-10-24"
              />
            </div>
          </div>
          <div className="w-full sm:w-auto min-w-[140px]">
            <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">Status</label>
            <div className="relative">
              <select className="block w-full pl-3 pr-10 py-2.5 text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg bg-input-dark text-slate-200 appearance-none outline-none">
                <option>All Statuses</option>
                <option>Present</option>
                <option>Absent</option>
                <option>Late</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card-dark rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Course</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Time In
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Marked By
                </th>
                <th className="relative px-6 py-4">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {records.map((record, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{record.course}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="h-9 w-9 rounded-full bg-cover bg-center mr-3 ring-2 ring-slate-800"
                        style={{ backgroundImage: `url('${record.avatar}')` }}
                      ></div>
                      <div className="text-sm font-semibold text-slate-200">{record.student}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{record.timeIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                        record.status === "Present"
                          ? "bg-green-900/20 text-green-400 border-green-900/30"
                          : record.status === "Absent"
                          ? "bg-red-900/20 text-red-400 border-red-900/30"
                          : "bg-yellow-900/20 text-yellow-400 border-yellow-900/30"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div
                      className={`flex items-center justify-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg inline-flex border ${
                        record.markedBy === "System (AI)"
                          ? "text-blue-400 bg-blue-900/20 border-blue-900/30"
                          : "text-slate-300 bg-slate-700/50 border-slate-700"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{record.markedByIcon}</span>
                      {record.markedBy}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-slate-500 hover:text-primary transition-colors p-2 rounded-lg hover:bg-slate-700/50">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-900/30 px-4 py-4 border-t border-slate-800 flex items-center justify-between sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Showing <span className="font-bold text-white">1</span> to <span className="font-bold text-white">5</span> of <span className="font-bold text-white">97</span> results
              </p>
            </div>
            <div>
              <nav aria-label="Pagination" className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px bg-input-dark">
                <button className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-slate-700 text-sm font-medium text-slate-400 hover:bg-slate-700 transition-colors">
                  <span className="sr-only">Previous</span>
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="z-10 bg-primary border-primary text-white relative inline-flex items-center px-4 py-2 border text-sm font-bold">
                  1
                </button>
                <button className="border-slate-700 text-slate-400 hover:bg-slate-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors">
                  2
                </button>
                <button className="border-slate-700 text-slate-400 hover:bg-slate-700 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium transition-colors">
                  3
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-slate-700 bg-input-dark text-sm font-medium text-slate-500">
                  ...
                </span>
                <button className="border-slate-700 text-slate-400 hover:bg-slate-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors">
                  10
                </button>
                <button className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-slate-700 text-sm font-medium text-slate-400 hover:bg-slate-700 transition-colors">
                  <span className="sr-only">Next</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
