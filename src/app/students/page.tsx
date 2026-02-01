"use client";

import React from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

const students = [
  {
    id: "#STU-2023001",
    name: "Sarah Jenkins",
    email: "s.jenkins@university.edu",
    avatar: "SJ",
    avatarColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    class: "CS-101-A",
    faceStatus: "REGISTERED",
    attendanceStatus: "PRESENT",
  },
  {
    id: "#STU-2023002",
    name: "Michael Chen",
    email: "m.chen@university.edu",
    avatar: "MC",
    avatarColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    class: "ENG-202-B",
    faceStatus: "PENDING",
    attendanceStatus: "ABSENT",
  },
  {
    id: "#STU-2023003",
    name: "Jessica Alba",
    email: "j.alba@university.edu",
    avatar: "JA",
    avatarColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    class: "CS-101-A",
    faceStatus: "REGISTERED",
    attendanceStatus: "PRESENT",
  },
  {
    id: "#STU-2023004",
    name: "David Smith",
    email: "d.smith@university.edu",
    avatar: "DS",
    avatarColor: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    class: "MATH-101-C",
    faceStatus: "REGISTERED",
    attendanceStatus: "PRESENT",
  },
];

export default function StudentManagementPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Student Management</h1>
          <p className="text-slate-400 text-sm">Manage student profiles and facial recognition data with high precision.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center gap-2 px-4 h-11 rounded-xl border border-slate-700 bg-[#1e293b] text-white text-sm font-medium hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-[20px]">file_upload</span>
            <span>Import</span>
          </button>
          <Link href="/registration" className="flex items-center justify-center gap-2 px-6 h-11 rounded-xl bg-primary text-white text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Add Student</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#1e293b] rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-1 min-w-[280px] max-w-md items-center relative">
          <span className="material-symbols-outlined absolute left-4 text-slate-500">search</span>
          <input
            className="w-full h-11 pl-12 pr-4 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm text-white placeholder:text-slate-500 transition-all outline-none"
            placeholder="Search students by name, ID or email..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-xl border border-slate-700">
            <span className="material-symbols-outlined text-slate-500 text-[20px]">filter_alt</span>
            <select className="bg-transparent border-none text-sm font-medium focus:ring-0 p-0 text-slate-200 cursor-pointer outline-none">
              <option className="bg-slate-900">All Departments</option>
              <option className="bg-slate-900">Computer Science</option>
              <option className="bg-slate-900">Engineering</option>
              <option className="bg-slate-900">Mathematics</option>
            </select>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-xl border border-slate-700">
            <span className="text-sm font-medium text-slate-500">Status:</span>
            <select className="bg-transparent border-none text-sm font-medium focus:ring-0 p-0 text-slate-200 cursor-pointer outline-none">
              <option className="bg-slate-900">All Statuses</option>
              <option className="bg-slate-900">Present</option>
              <option className="bg-slate-900">Absent</option>
              <option className="bg-slate-900">Registered</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Student ID</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Group/Class</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Face Registration</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Attendance</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {students.map((student) => (
                <tr key={student.id} className="group hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-5 text-sm font-mono text-slate-400 whitespace-nowrap">{student.id}</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`size-9 rounded-full flex items-center justify-center text-xs font-bold border ${student.avatarColor}`}>
                        {student.avatar}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">{student.name}</span>
                        <span className="text-xs text-slate-500">{student.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {student.class}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                      student.faceStatus === "REGISTERED"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}>
                      <span className={`size-1.5 rounded-full ${
                        student.faceStatus === "REGISTERED" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                      }`}></span>
                      {student.faceStatus}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                      student.attendanceStatus === "PRESENT"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-slate-800 text-slate-500 border-slate-700"
                    }`}>
                      {student.attendanceStatus}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {student.faceStatus === "PENDING" && (
                        <Link href="/registration" className="p-2 rounded-lg text-primary bg-primary/10 hover:bg-primary/20 transition-all font-bold text-xs flex items-center justify-center" title="Action Required">
                          <span className="material-symbols-outlined text-[20px]">face_retouching_natural</span>
                        </Link>
                      )}
                      <button className="p-2 rounded-lg text-slate-400 hover:bg-primary/10 hover:text-primary transition-all" title="View Details">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-all" title="Edit Profile">
                        <span className="material-symbols-outlined text-[20px]">edit_square</span>
                      </button>
                      <button className="p-2 rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all" title="Delete">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-900/50 border-t border-slate-800 px-6 py-5 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-300">1</span> to <span className="font-bold text-slate-300">4</span> of <span className="font-bold text-slate-300">128</span> entries
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-xl border border-slate-700 text-sm font-semibold text-slate-500 disabled:opacity-30 transition-all" disabled>
              <span className="material-symbols-outlined text-[18px] align-middle">chevron_left</span> Previous
            </button>
            <div className="flex items-center gap-1">
              <button className="size-9 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all">1</button>
              <button className="size-9 rounded-lg text-slate-400 hover:bg-slate-800 text-sm font-bold transition-all">2</button>
              <button className="size-9 rounded-lg text-slate-400 hover:bg-slate-800 text-sm font-bold transition-all">3</button>
              <span className="px-2 text-slate-600">...</span>
            </div>
            <button className="px-4 py-2 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-all">
              Next <span className="material-symbols-outlined text-[18px] align-middle">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
