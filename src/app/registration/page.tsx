"use client";

import React from "react";
import Link from "next/link";

export default function FaceRegistrationPage() {
  return (
    <div className="bg-[#05080f] font-display text-slate-200 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-panel-dark rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col border border-white/5">
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#0d131f]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">person_add</span>
              Register New Student Face
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-light tracking-wide">
              STUDENT ID: <span className="text-primary font-mono">2024-CS-089</span> •{" "}
              <span className="text-slate-200">Alex Morgan</span>
            </p>
          </div>
          <Link href="/students" className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <span className="material-symbols-outlined">close</span>
          </Link>
        </div>

        <div className="bg-[#0d131f] px-8 py-5 border-b border-white/5">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-2 group">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="material-symbols-outlined text-lg font-bold">check</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">Preparation</span>
            </div>
            <div className="h-px w-full bg-emerald-500/30 mx-4"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white neon-glow">
                <span className="text-sm font-bold">02</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Biometric Capture</span>
            </div>
            <div className="h-px w-full bg-white/10 mx-4"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 text-slate-500 border border-white/10">
                <span className="text-sm font-bold">03</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Review & Save</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[540px]">
          <div className="flex-1 p-8 bg-[#0a0f18] flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="relative w-full max-w-xl aspect-[4/3] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-80"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCPAXGAM9kM18DaRCJ-4WWqyoJjyR8RNMZDxq0qG4xjd8fSt05ryFc6IQbiBq6oV7QUnVTL2Z1nrzwjdCULB-ZMo19rAXi7Tl247kcjVMcsNPAi_oyv8kTdBuLMKtdny9c5vIB_uWLA0RHC0Ax9LK7cvHkCtHjjq6vwy3HcaIIv4iitu2yM6Yyi6zUoxIkjvIWfUQxSS9bfcmJZUG2kYBCmB_KIgFI9Q5rIwyJGnScWtW0HAMHSLe0iD4vosZCO3GjUaINpXy4uzXc')",
                }}
              ></div>
              <div className="absolute inset-0 face-guide-overlay pointer-events-none"></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-52 h-72 border border-primary/40 rounded-[50%] relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full neon-glow"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 border-2 border-primary rounded-full"></div>
                  <div className="absolute w-full h-[1px] bg-primary/50 scan-line shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                  <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-primary/60 rounded-tl-lg"></div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-primary/60 rounded-tr-lg"></div>
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-primary/60 rounded-bl-lg"></div>
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-primary/60 rounded-br-lg"></div>
                </div>
              </div>

              <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                <div className="glass-panel bg-black/40 text-white text-[10px] font-bold tracking-widest px-4 py-2 rounded-lg flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  STREAMING LIVE
                </div>
                <div className="glass-panel bg-black/40 text-slate-300 text-[10px] px-3 py-2 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">verified_user</span>
                  SECURE CHANNEL
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="flex flex-wrap gap-3 justify-center">
                  <div className="glass-panel bg-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-2 border-emerald-500/30">
                    <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
                    <span className="text-emerald-50 text-xs font-medium">Face Detected</span>
                  </div>
                  <div className="glass-panel bg-white/5 px-4 py-2 rounded-xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400 text-base">wb_sunny</span>
                    <span className="text-slate-200 text-xs font-medium">Lighting: Optimal</span>
                  </div>
                  <div className="glass-panel bg-white/5 px-4 py-2 rounded-xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">center_focus_strong</span>
                    <span className="text-slate-200 text-xs font-medium">Centered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[400px] p-8 flex flex-col gap-8 bg-[#0d131f] border-l border-white/5">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Capture Progress</h3>
                <span className="text-primary text-sm font-black font-mono">30%</span>
              </div>
              <div className="rounded-full bg-white/5 h-2 overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full bg-primary neon-glow transition-all duration-700 ease-out relative"
                  style={{ width: "30%" }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/20"></div>
                </div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <span className="text-slate-300 font-bold">03</span> / 10 Frames
                </span>
                <span>ETA: ~04s</span>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex gap-4">
              <div className="bg-primary/20 p-2 rounded-lg h-fit">
                <span className="material-symbols-outlined text-primary text-xl">face_retouching_natural</span>
              </div>
              <div>
                <p className="text-sm text-slate-100 font-semibold">Maintain neutral expression</p>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Ensure eyes are open and look directly into the camera lens. Avoid tilting your head.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Validated Frames</label>
              <div className="grid grid-cols-4 gap-3">
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDMKklgEapwBa2GSanID8byCwJiAbRb6QGyF5-VXxn3L6XLhBB6vxlI9oj6O72SevbwzkLKmT_GqbSGEtVXURjd_k81Ys0iA6nmZD9LsLtXwr5Qp-FQ8IfU73QcXiMRAQZd1IyddEcXc5frXykHXHQKz_ooG5w4-08MZQiajtpr3KoE6VBA2Pt9GYEzollF_KLeVziiUjvyEx7BvVtFe692UxeQjN31cN0Xem2VzusqTHHwWvmi_nSYmWAjvZyxrGQhAHCFqfYDTxM",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCJtq7EFK7VsCl_pUbNjQKrfPALlEtODvSWSO97bbjJ8vGMB9Y27vz0kLuOU9clLpdWgT1pTgl3FgKbpYzti-MbA6W-slFmOW-pmW35-0hLimd_FXLQjQvY0U-UPYBxQdGsBRTGtyu99UKYxCVOm9DiNPq7W-ZjdmFKlK_rU75J_Z3fwDRbfXszgrVmENDaIrnLszR1NQyBNlf86DbAUSNSHuc7QwwJayvnYU88Yd68xWpHLLo4BuHbydPgUua2Q1lA4f6O-5SZwk0",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCZhX01A1uYEfi6DDS7z7Z2gOrVP-kPOzvN4QgNED82IGq6DCj9vMX8F1EJZXljv-GWj56k93RvTA2Maj7Ywno2rFNJBuTb7il-qpm5oKujUahki0W68vhaEg3lU65HI171D45rWiOE6K9OC13JzotykbxieMYVCF4mmlPEwxC3fe9Pz9BjLzKcwMpX4C5dh9oZuMNJURfjRlWR3myd2Br5Ktbb6P-jVpNDz7sPY5LEXNO0OpoMR475WEnDBMzNA7GHL4JDav_WE5k",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden border border-emerald-500/50 relative group cursor-pointer shadow-lg shadow-emerald-500/5"
                  >
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${src}')` }}></div>
                    <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-0.5 rounded-lg">
                      <span className="material-symbols-outlined text-[12px] block font-bold">check</span>
                    </div>
                  </div>
                ))}
                <div className="aspect-square rounded-xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center group hover:border-white/20 transition-colors">
                  <span className="material-symbols-outlined text-white/10 group-hover:text-white/20 transition-colors text-2xl">
                    sensors
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <button className="w-full h-14 rounded-2xl bg-primary hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] relative overflow-hidden">
                <span className="material-symbols-outlined animate-spin text-xl">sync</span>
                AI ANALYSIS IN PROGRESS
              </button>
              <div className="flex gap-3">
                <button className="flex-1 h-12 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-semibold text-sm transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">pause</span>
                  Pause
                </button>
                <button className="flex-1 h-12 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 font-semibold text-sm transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">cancel</span>
                  Terminate
                </button>
              </div>
              <div className="text-center">
                <a
                  className="text-[11px] text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-1.5 group"
                  href="#"
                >
                  <span className="material-symbols-outlined text-[14px]">upload_file</span>
                  <span className="border-b border-slate-700 group-hover:border-primary pb-0.5">
                    Switch to manual photo upload
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
