"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [role, setRole] = useState("admin");

  return (
    <div className="bg-background-dark font-display text-white antialiased h-screen overflow-hidden flex">
      {/* Left side: Hero Image */}
      <div className="relative hidden w-0 flex-1 lg:block h-full">
        <img
          alt="University campus library interior with students studying"
          className="absolute inset-0 h-full w-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7TApydCsXQewkzUfRTi0W-H-CwFXpdrSMKkaunSaGQjsK2SV-RYBoevV_-7epfhYsmL20iSmSO16Vvq-LM0uNC1MpzIFZcXRsfdN3Xk9Usxt8TadSaL_NsYPXBpNH70K3u8Km6fuB8EkKHEjYA_SukQM82lTutAczBkO1GdDAw_hvYOIkq8EzcQl8ptb5zVpc8TrTukMxcLTHykwj9eYPCoZlJ2SbAH3TTIT113QrxrUwOPOY707_LjoPbNfSgDx4TPZ4JUGg3Bc"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background-dark via-background-dark/80 to-transparent"></div>
        <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 right-0 p-16 text-white z-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex items-center justify-center size-12 rounded-2xl bg-primary/20 border border-primary/30 text-primary shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-400">Secure Campus Access</span>
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6 tracking-tight">
            Next-Gen <span className="text-blue-400">Attendance</span>
            <br />
            Management System
          </h1>
          <p className="text-xl text-slate-300 max-w-lg leading-relaxed font-light">
            Streamline academic operations with biometric security. Fast, accurate, and contactless face recognition
            technology.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-[600px] h-full overflow-y-auto bg-slate-950/50 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="mx-auto w-full max-w-sm lg:w-96 relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex items-center justify-center size-12 rounded-xl bg-gradient-to-br from-primary to-blue-700 text-white shadow-lg shadow-[0_0_25px_-5px_rgba(59,130,246,0.4)]">
              <span className="material-symbols-outlined text-2xl">face</span>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-white uppercase">
                FRAS <span className="text-blue-400 font-light">Admin</span>
              </h2>
            </div>
          </div>
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to the administrative command center.</p>
          </div>
          <div className="backdrop-blur-xl bg-slate-800/70 border border-white/10 p-8 rounded-2xl shadow-2xl">
            <form action="#" className="space-y-6" method="POST">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                  Identity Role
                </label>
                <div className="flex gap-3">
                  <label className="flex-1 cursor-pointer">
                    <input
                      checked={role === "admin"}
                      onChange={() => setRole("admin")}
                      className="peer sr-only"
                      name="role"
                      type="radio"
                      value="admin"
                    />
                    <div className="flex h-12 flex-col items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-400 peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-white transition-all">
                      <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                      <span className="text-[10px] font-bold uppercase">Admin</span>
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      checked={role === "instructor"}
                      onChange={() => setRole("instructor")}
                      className="peer sr-only"
                      name="role"
                      type="radio"
                      value="instructor"
                    />
                    <div className="flex h-12 flex-col items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-400 peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-white transition-all">
                      <span className="material-symbols-outlined text-xl">school</span>
                      <span className="text-[10px] font-bold uppercase">Staff</span>
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2" htmlFor="email">
                  Institutional Email
                </label>
                <div className="relative">
                  <input
                    autoComplete="email"
                    className="block w-full rounded-xl border-slate-700 bg-slate-900/50 py-3.5 pl-11 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all sm:text-sm"
                    id="email"
                    name="email"
                    placeholder="name@university.edu"
                    required
                    type="email"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="material-symbols-outlined text-slate-500 text-xl">alternate_email</span>
                  </div>
                </div>
              </div>
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2"
                  htmlFor="password"
                >
                  Security Key
                </label>
                <div className="relative">
                  <input
                    autoComplete="current-password"
                    className="block w-full rounded-xl border-slate-700 bg-slate-900/50 py-3.5 pl-11 pr-11 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all sm:text-sm"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="material-symbols-outlined text-slate-500 text-xl">lock</span>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-slate-500 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl">visibility_off</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary focus:ring-offset-slate-900"
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                  />
                  <label className="ml-2 block text-sm text-slate-400" htmlFor="remember-me">
                    Keep active session
                  </label>
                </div>
                <div className="text-sm">
                  <a className="font-medium text-blue-400 hover:text-blue-300 transition-colors" href="#">
                    Recovery
                  </a>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary px-4 py-4 text-sm font-bold text-white shadow-xl hover:bg-blue-500 hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.4)] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all active:scale-[0.98]"
              >
                Authorize Access
                <span className="material-symbols-outlined text-lg">login</span>
              </Link>
            </form>
          </div>
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4 px-1">
              <span className="h-px flex-1 bg-slate-800"></span>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Sandbox Access</span>
              <span className="h-px flex-1 bg-slate-800"></span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 flex justify-between items-center group hover:border-slate-700 transition-colors">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase">Admin Env</p>
                  <p className="text-xs font-mono text-slate-300">admin@uni.edu</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-500 uppercase">Secret</p>
                  <p className="text-xs font-mono text-blue-400">pass123</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 flex justify-between items-center group hover:border-slate-700 transition-colors">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase">Staff Env</p>
                  <p className="text-xs font-mono text-slate-300">proff@uni.edu</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-500 uppercase">Secret</p>
                  <p className="text-xs font-mono text-blue-400">pass123</p>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-12 text-center text-[10px] font-medium text-slate-600 uppercase tracking-widest">
            © 2024 University System Security • Encrypted End-to-End
          </p>
        </div>
      </div>
    </div>
  );
}
