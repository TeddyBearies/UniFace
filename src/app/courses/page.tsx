"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

const courses = [
  {
    code: "CS-101",
    name: "Intro to Comp Sci",
    instructor: "Prof. Sarah Jenkins",
    location: "Lecture Hall A",
    enrolled: 124,
    active: true,
  },
  {
    code: "ENG-204",
    name: "Advanced Literature",
    instructor: "Dr. Emily Chen",
    location: "Room 304",
    enrolled: 45,
    active: false,
  },
  {
    code: "MATH-302",
    name: "Linear Algebra",
    instructor: "Prof. John Nash",
    location: "Lecture Hall B",
    enrolled: 88,
    active: false,
  },
  {
    code: "PHY-101",
    name: "Physics I",
    instructor: "Dr. Albert Stein",
    location: "Lab 4",
    enrolled: 60,
    active: false,
  },
  {
    code: "BIO-112",
    name: "Biology Fundamentals",
    instructor: "Prof. Marie Curie",
    location: "Lab 2",
    enrolled: 0,
    active: false,
  },
];

const roster = [
  { name: "Alex Morgan", id: "2024001", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcKOfiANTGzvajfYV_nUjEMvupVHrRduwwN-mWAJeAKEACuXX-A5WY_KozbfSXG3OVC8s-MVF7jZva8tWipK0AqXeSSm904lLnmET1Dqlv9zzGMWGj0cEQUrg51T_rxWDs3EoKFY2GuCykpsTO0D5KrsOfVXigIOgr4XbTtv6PYcdcS0lZx7UXfgQtRq5aABT54MvgB674C8AKNJ5UKCIq_al9xCUiimCH2ceSCKud3_CrkU2SwiaRtC-k9HXQj83pu_HX2Y7Q3iI" },
  { name: "James Smith", id: "2024045", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvl-3gC8IsQW_ZRMqIA7QwOgITpFrJFiZtOVk6KX3lnHYNjG_NiAaQdHqYqObsWEG1Ec4m3rijYWlbnwgungdJblq3cyM82Sq1GUi2n6FuyaBo3Dit3Yue2BhdKKiv8zJ_PegjwjmiGuU7gf3UEJ6S0idOqdmTzeNqVLj0CY29T9UNwT7ZzMfdh8ycpMAIInH_55mtiOnd0_mw3k4JVNUavT0TVcQ2CsNRuSAPJbRQLP8lKJgp3HziivWErfc5qej4qN9E6Ny2BPQ" },
  { name: "Maria Garcia", id: "2024089", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYaKSxXLWhNpV9TGVFguvuWHRzFcOa2m5z4u05mcFGiisrx1KXcfwFVCnwveVl3eavp_Dm4vGehtXOnzQQI0POaiGNVSw2gDwFTb6RviAoq-Y0vGCrI_YOTN8F78b_gjpA-dg7oaR3D8dSRl7AgUUVihBGDHyYroVtWHRinsM7ppCrXv1HEwVIQdg2svqZT0-tp1eTfUIPCgDULhw3FrH2dnx2vZVPuanC8Tdrkcv_V8RnlIFlbioQS90xXbX45WWa0WZe28-1Psc" },
];

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-white text-3xl font-bold tracking-tight">Courses & Enrollments</h2>
          <p className="text-slate-400 text-base">Manage active courses and student rosters for the Spring 2024 semester.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 h-10 px-4 rounded-lg border border-border-dark bg-surface-dark text-slate-200 text-sm font-medium hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            <span>Filters</span>
          </button>
          <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Add Course</span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="relative flex items-center w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 text-slate-500">search</span>
          <input
            className="w-full bg-surface-dark border-border-dark border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            placeholder="Search by Course Code or Name..."
            type="text"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col bg-surface-dark rounded-xl shadow-sm border border-border-dark overflow-hidden">
          <div className="px-6 py-4 border-b border-border-dark flex justify-between items-center bg-slate-900/50">
            <h3 className="font-bold text-lg text-white">Active Courses</h3>
            <span className="bg-slate-800 text-slate-400 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-700">Spring 2024</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-dark">
                  <th className="py-3.5 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-900/30">Code</th>
                  <th className="py-3.5 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-900/30">Course Name</th>
                  <th className="py-3.5 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-900/30">Instructor</th>
                  <th className="py-3.5 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-900/30 text-center">Enrolled</th>
                  <th className="py-3.5 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-900/30"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {courses.map((course) => (
                  <tr
                    key={course.code}
                    onClick={() => setSelectedCourse(course)}
                    className={`group hover:bg-primary/5 cursor-pointer transition-colors ${
                      selectedCourse.code === course.code ? "bg-primary/10 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                    }`}
                  >
                    <td className={`py-4 px-6 font-mono text-sm font-bold ${selectedCourse.code === course.code ? "text-primary" : "text-slate-400"}`}>
                      {course.code}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{course.name}</span>
                        <span className="text-xs text-slate-500">{course.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-300">{course.instructor}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${
                        course.enrolled > 0 ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {course.enrolled}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">chevron_right</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-border-dark flex justify-between items-center bg-slate-900/30">
            <p className="text-xs text-slate-500">Showing <span className="text-slate-300 font-medium">5</span> of <span className="text-slate-300 font-medium">24</span> courses</p>
            <div className="flex gap-2">
              <button className="p-1.5 rounded-lg border border-border-dark bg-surface-dark text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800" disabled>
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button className="p-1.5 rounded-lg border border-border-dark bg-surface-dark text-slate-300 hover:border-slate-600 hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-surface-dark rounded-xl shadow-2xl border border-primary/20 flex flex-col sticky top-24">
            <div className="h-28 w-full bg-gradient-to-br from-blue-700 via-primary to-indigo-800 rounded-t-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10 opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute bottom-4 right-4">
                <button className="flex items-center justify-center size-10 rounded-full bg-surface-dark border border-white/10 shadow-xl text-primary hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
              </div>
            </div>
            <div className="px-6 pt-2 pb-6 flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded tracking-wide">{selectedCourse.code}</span>
                  <span className="text-[10px] font-bold text-green-400 flex items-center gap-1.5 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">
                    <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span> ACTIVE
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white leading-tight">{selectedCourse.name}</h2>
                <p className="text-sm text-slate-400 mt-1.5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  Mon, Wed, Fri • 10:00 AM - 11:30 AM
                </p>
              </div>
              <Link href="/session" className="w-full flex items-center justify-center gap-3 h-12 rounded-lg bg-primary text-white font-bold hover:bg-blue-600 transition-all shadow-xl shadow-primary/20 active:scale-95 group">
                <span className="material-symbols-outlined fill-0 group-hover:scale-110 transition-transform">face_unlock</span>
                Start Face Recognition
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-900/50 border border-border-dark">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-white">{selectedCourse.enrolled}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/50 border border-border-dark">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Avg Attendance</p>
                  <p className="text-2xl font-bold text-white text-primary">92%</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Student Roster</h4>
                  <a className="text-xs font-medium text-primary hover:underline flex items-center gap-1" href="#">
                    Manage <span className="material-symbols-outlined text-xs">arrow_outward</span>
                  </a>
                </div>
                <div className="relative">
                  <input
                    className="w-full h-10 pl-3 pr-10 rounded-lg border border-border-dark bg-slate-900 text-xs focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-600 text-white outline-none"
                    placeholder="Enroll student by ID..."
                    type="text"
                  />
                  <button className="absolute right-2 top-2 text-slate-500 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">person_add</span>
                  </button>
                </div>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
                  {roster.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 transition-all group border border-transparent hover:border-border-dark">
                      <div className="flex items-center gap-3">
                        <div
                          className="size-8 rounded-full bg-cover bg-center border border-border-dark"
                          style={{ backgroundImage: `url('${student.avatar}')` }}
                        ></div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">{student.name}</span>
                          <span className="text-[10px] text-slate-500">ID: {student.id}</span>
                        </div>
                      </div>
                      <button className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
