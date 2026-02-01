"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const admins = [
  {
    name: "Dr. Sarah Smith",
    id: "UID-8821-ADM",
    dept: "Computer Science",
    clearance: "Level 4: Full Root",
    lastAuth: "2023-11-21 14:02",
    initials: "SS",
    color: "bg-blue-500/20 text-primary border-blue-500/30",
  },
  {
    name: "Prof. John Doe",
    id: "UID-4102-ADM",
    dept: "Physics",
    clearance: "Level 2: Read Only",
    lastAuth: "2023-11-21 09:12",
    initials: "JD",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
];

const auditLogs = [
  { timestamp: "2023-11-24 14:22:01", user: "sarah.smith", action: "Biometric: Threshold → 85%", ip: "192.168.1.104" },
  { timestamp: "2023-11-24 11:05:43", user: "mark.west", action: "User: Provision (INS-9921)", ip: "192.168.1.112" },
  { timestamp: "2023-11-23 08:00:00", user: "system.daemon", action: "Routine: Daily Database Cleanup", ip: "local:127.0.0.1" },
  { timestamp: "2023-11-22 17:45:12", user: "sarah.smith", action: "Auth: Multi-Factor Enabled", ip: "192.168.1.104" },
];

export default function SettingsPage() {
  const [threshold, setThreshold] = useState(85);
  const [parallelProcessing, setParallelProcessing] = useState(true);
  const [antiSpoofing, setAntiSpoofing] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-4xl font-black tracking-tight">System Control</h1>
          <p className="text-gray-400 text-sm mt-1 max-w-xl">
            Configure biometric sensitivity, manage administrative credentials, and maintenance routines.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-card-dark border border-border-dark text-gray-300 text-sm font-bold hover:bg-gray-800 transition-all">
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            <span>Reset Changes</span>
          </button>
          <button className="flex items-center justify-center gap-2 h-11 px-8 rounded-xl bg-primary text-white text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-blue-600 transition-all">
            <span className="material-symbols-outlined text-[20px]">save</span>
            <span>Apply Updates</span>
          </button>
        </div>
      </div>

      <section className="bg-card-dark rounded-2xl border border-border-dark overflow-hidden shadow-2xl shadow-black/50">
        <div className="p-6 border-b border-border-dark flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-card-dark to-gray-900/40">
          <div>
            <h2 className="text-white text-lg font-bold">Administrative Access</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Control who can modify system parameters and access attendance logs.
            </p>
          </div>
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-500 text-xl">search</span>
            </div>
            <input
              className="block w-full pl-11 pr-4 py-2.5 border border-border-dark rounded-xl bg-background-dark/50 text-sm text-white placeholder-gray-600 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
              placeholder="Filter by name, role or ID..."
              type="text"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/50 border-b border-border-dark">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Admin Personnel
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Security Clearance
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Last Auth</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">
                  Modify
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/50">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full border flex items-center justify-center font-bold text-sm ${admin.color}`}>
                        {admin.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{admin.name}</p>
                        <p className="text-[11px] text-gray-500 font-mono uppercase">{admin.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{admin.dept}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter border ${
                      admin.clearance.includes("Root")
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {admin.clearance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">{admin.lastAuth}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-1">
                      <button className="text-gray-500 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-[18px]">edit_note</span>
                      </button>
                      <button className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-[18px]">person_remove</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-border-dark bg-gray-900/20">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white text-xs font-bold rounded-xl border border-border-dark hover:bg-gray-700 hover:border-gray-600 transition-all uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Provision New Admin</span>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-card-dark rounded-2xl border border-border-dark shadow-xl flex flex-col">
          <div className="p-6 border-b border-border-dark">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <span className="material-symbols-outlined text-primary block">fingerprint</span>
              </div>
              <div>
                <h2 className="text-white text-lg font-bold">Biometric Engine</h2>
                <p className="text-xs text-gray-500">Fine-tune recognition sensitivity and security protocols.</p>
              </div>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-10 flex-1">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-0.5">
                  <label className="text-sm font-bold text-gray-200 uppercase tracking-tight">
                    Confidence Threshold
                  </label>
                  <span className="text-xs text-gray-500">Minimum match score for validation</span>
                </div>
                <span className="text-2xl font-black text-primary font-mono">
                  {threshold}
                  <span className="text-xs ml-0.5">%</span>
                </span>
              </div>
              <input
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
                max="100"
                min="0"
                type="range"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-background-dark/30 border border-border-dark/50">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-white">Parallel Face Processing</span>
                  <span className="text-xs text-gray-500">Scan multiple identities in a single frame</span>
                </div>
                <button
                  onClick={() => setParallelProcessing(!parallelProcessing)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${parallelProcessing ? 'bg-primary' : 'bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${parallelProcessing ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-background-dark/30 border border-border-dark/50">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-white">Anti-Spoofing (Liveness)</span>
                  <span className="text-xs text-gray-500">Prevent photo or video replay attacks</span>
                </div>
                <button
                  onClick={() => setAntiSpoofing(!antiSpoofing)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${antiSpoofing ? 'bg-primary' : 'bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${antiSpoofing ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#1a0a0b] rounded-2xl border border-red-900/40 shadow-xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-red-900/20 bg-gradient-to-r from-[#1a0a0b] to-[#2d0f11]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <span className="material-symbols-outlined text-red-500 block">priority_high</span>
              </div>
              <div>
                <h2 className="text-red-400 text-lg font-bold">System Maintenance</h2>
                <p className="text-xs text-red-900/80">Destructive actions and environment overrides.</p>
              </div>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-4 flex-1">
            <div className="flex flex-col gap-3">
              <button className="group w-full flex items-center justify-between px-5 py-4 bg-black/40 border border-red-900/20 hover:border-red-500/50 rounded-xl transition-all text-left">
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-gray-300 group-hover:text-red-400 transition-colors">
                    Wipe Daily Cache
                  </span>
                  <span className="text-[11px] text-gray-600 mt-0.5">Clear all temporary check-in markers for today</span>
                </div>
                <span className="material-symbols-outlined text-gray-700 group-hover:text-red-500 transition-colors">
                  history_toggle_off
                </span>
              </button>
              <button className="group w-full flex items-center justify-between px-5 py-4 bg-black/40 border border-red-900/20 hover:border-blue-500/50 rounded-xl transition-all text-left">
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-gray-300 group-hover:text-blue-400 transition-colors">
                    Synthesize Mock Data
                  </span>
                  <span className="text-[11px] text-gray-600 mt-0.5">Inject 50 randomized profiles and logs</span>
                </div>
                <span className="material-symbols-outlined text-gray-700 group-hover:text-blue-500 transition-colors">
                  terminal
                </span>
              </button>
            </div>
            <div className="mt-auto pt-4">
              <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-600/10 border border-red-600/30 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-[0_0_15px_rgba(220,38,38,0.1)] uppercase text-xs font-black tracking-widest">
                <span className="material-symbols-outlined text-[20px]">dangerous</span>
                <span>Purge All System Data</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-card-dark rounded-2xl border border-border-dark overflow-hidden shadow-xl">
        <div className="p-6 border-b border-border-dark flex justify-between items-center bg-gray-900/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-400">policy</span>
            <h2 className="text-white text-lg font-bold">System Audit Logs</h2>
          </div>
          <button className="flex items-center gap-2 text-primary text-[11px] font-black uppercase tracking-widest hover:text-blue-400 transition-colors bg-blue-500/5 px-3 py-1.5 rounded-lg border border-primary/20">
            <span className="material-symbols-outlined text-sm">download</span>
            Export .CSV
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-background-dark/95 backdrop-blur-md z-10 border-b border-border-dark">
              <tr>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Event Timestamp
                </th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Origin User</th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Action Details
                </th>
                <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">
                  Source IP
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/30 text-xs font-mono">
              {auditLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-gray-500">{log.timestamp}</td>
                  <td className="px-6 py-4 text-blue-400 font-bold">{log.user}</td>
                  <td className="px-6 py-4 text-gray-400">{log.action}</td>
                  <td className="px-6 py-4 text-gray-600 text-right">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="flex flex-col items-center gap-2 pt-4 pb-8 text-center">
        <div className="flex items-center gap-4">
          <span className="w-12 h-px bg-border-dark"></span>
          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">End of Configuration</span>
          <span className="w-12 h-px bg-border-dark"></span>
        </div>
        <p className="text-[10px] text-gray-700 font-medium">
          UniFace Core Engine v2.9.4-stable • Last Security Audit: Nov 2023
        </p>
      </footer>
    </DashboardLayout>
  );
}
