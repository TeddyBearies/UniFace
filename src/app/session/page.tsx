"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const presentStudents = [
  {
    name: "Alice Smith",
    id: "2023001",
    time: "10:02 AM",
    conf: "98%",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbcSWQmQo0c0EZQKFuj_ZtcaYyMwL2ju5nn2ndwgJCS-vFng0erEMu9Hk2NqlYwPwXChulUWVuQHoerH3Gzgb2LTkIOaxRBk_P4zBXLwfM0tnC8FwJu6SdMD4GvmH-jiZKjqlP5MZZHy3c1FtQjavmE2P7dHpjOn-O59hJtNtMwSni-JejmeVDbvRCgMtzxWSfXayRsESF7es9zH4qkASZsMQQ2DGdB3agtp62lVKyuIkBDAB4NRreKMmVoyUVLH0gOEeTsnokVdg",
  },
  {
    name: "John Doe",
    id: "2023004",
    time: "10:03 AM",
    conf: "89%",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFfioSif--phk93dlG2W4JA1Zm4fr7uiJvrs1cRTSfKt7crPhAV2TylLvrtdwb1873ZhcsZysAkqoEWmhRVHBpzPpK7X5nuOzGWyLzputP4tJQYgab2ioUlJnEIVhM3WHXooqp1h7IGK0TphZLKa1U1k867cFo9LKNKfu2XVaH5qfTviFbaA8FdF45SgW3_Bjb_6MFd3IUnVrDBQI0Blj2zzYGNvsM-j1MoH4XL7Cm121E0vs6zlpyjsF-FC6jssw0Sp0zXKEIZxE",
  },
  {
    name: "Michael K.",
    id: "2023012",
    time: "10:05 AM",
    conf: "92%",
    avatar: "MK",
  },
  {
    name: "Sarah Connor",
    id: "2023089",
    time: "10:05 AM",
    conf: "95%",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqDs1UOvBF79h4fJX857OoNyfq0EXxzgYtXtT2sJZ3ZAxIxgmVi9elaaci-ghw_TvWvn87QYp39gBbK5qsTYyjdCW3FSarWcqU0rbhixhXAggyvxEmpUUKmB1tqK4PQ8FCuk1ZdVJwcb6En_XdA7EZpHPjw9WOc0dt7F-K87aSxzXU1BFCkc5fqGcT25daUyg8YRG-Sv-n9DkJx-AfqBvZT3ua5CpMAg8EC_mpkdXeudz--GGz00KQZqrhe9z_7_Vya8szggisFoQ",
  },
  {
    name: "Emily Blunt",
    id: "2023091",
    time: "10:06 AM",
    conf: "78%",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHRKpe76BlDRDz8FI3zwC8SRemrgNXEh4IYllhZeL_GGXDpjuMs_7dcKFJBK7jHuxEkoccDazuNlDOVtanp8Sb_hqzRlTf7GtPym15A7TJoQEU2gBo7SfLi_-zD1-6OCinjApjfk06MU6N9B9rTFmUHjpQeabimOX400kLiL1b4proPOrNGpmwh4vVUIX96zZShP6-hnyKXOky5kZy1r6wsCKHLyO17Ie6a2i1WxexG1KtW56N0pPfHGohjs28pMexWSZQpMkQy2w",
  },
];

export default function LiveSessionPage() {
  const [confidence, setConfidence] = useState(85);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-white tracking-light text-2xl md:text-[32px] font-bold leading-tight">
            CS101 - Introduction to Algorithms
          </h1>
          <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2.5 py-1 rounded border border-green-500/30">
            ACTIVE SESSION
          </span>
        </div>
        <p className="text-gray-400 text-sm font-normal leading-normal">Lecture Hall B2 • Started at 10:00 AM</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px]">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          <div className="bg-[#111827] rounded-xl p-4 shadow-xl border border-[#1f2937] flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-3 w-full md:w-auto flex-1">
              <div className="relative w-full md:w-56">
                <select className="w-full h-11 rounded-lg border border-[#374151] bg-[#1f2937] text-white px-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none">
                  <option>CS101 - Intro to Algo</option>
                  <option>CS202 - Data Structures</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none text-xl">
                  expand_more
                </span>
              </div>
              <div className="relative w-full md:w-44">
                <input
                  className="w-full h-11 rounded-lg border border-[#374151] bg-[#1f2937] text-white px-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  type="date"
                  defaultValue="2023-10-24"
                />
              </div>
            </div>
            <div className="flex flex-col w-full md:w-72 gap-2">
              <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <span>Confidence Threshold</span>
                <span className="text-primary">{confidence}%</span>
              </div>
              <div className="flex h-2 w-full items-center rounded-full bg-[#1f2937] relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidence}
                  onChange={(e) => setConfidence(parseInt(e.target.value))}
                  className="w-full h-full appearance-none bg-transparent cursor-pointer z-10"
                />
                <div
                  className="absolute h-full rounded-full bg-primary"
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="relative w-full bg-black rounded-xl overflow-hidden aspect-video shadow-2xl ring-1 ring-white/10 group">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70 scale-105"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAPmWHK9UYniuGvnfOuoqq51wwO3RgIvqg8eKJCzIMXIgMje4IYrbbBVkIp88LIXZ1SyA4jEZBUNCLNcLLWMnCfeb4iYV_1uABCIbkqOOiZPU-tTQz4jQYNraJ2n1iC8K8cQemN60fcZwxNEqfNw03VBeROHxDIovht-_g-jly2KWD_VCMYwe_4tIza2azST5oieiCfNudd6WW_3e0SI9T01aMeaG92SxkHi3mN57FGuL7Q3df_pCocz-GnDhgILLChzP1rriUQDI')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
            <div className="absolute top-5 left-5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-2 shadow-lg animate-pulse">
              <span className="size-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]"></span> LIVE FEED
            </div>

            {/* Simulated Detections */}
            <div className="absolute top-[35%] left-[20%] w-[12%] h-[22%] border-2 border-primary rounded-md shadow-[0_0_15px_rgba(19,91,236,0.6)]">
              <div className="absolute -top-10 left-0 bg-primary text-white text-[11px] font-bold px-2 py-1.5 rounded-t-md whitespace-nowrap shadow-lg flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Alice Smith</span>
                <span className="bg-white/20 px-1 rounded text-[10px]">98%</span>
              </div>
            </div>
            <div className="absolute top-[40%] left-[55%] w-[10%] h-[18%] border-2 border-primary rounded-md shadow-[0_0_15px_rgba(19,91,236,0.6)]">
              <div className="absolute -top-10 left-0 bg-primary text-white text-[11px] font-bold px-2 py-1.5 rounded-t-md whitespace-nowrap shadow-lg flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>John Doe</span>
                <span className="bg-white/20 px-1 rounded text-[10px]">89%</span>
              </div>
            </div>
            <div className="absolute top-[30%] right-[15%] w-[9%] h-[16%] border-2 border-amber-500 rounded-md shadow-[0_0_15px_rgba(245,158,11,0.6)]">
              <div className="absolute -top-10 left-0 bg-amber-500 text-white text-[11px] font-bold px-2 py-1.5 rounded-t-md whitespace-nowrap shadow-lg flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">help</span>
                <span>Unknown</span>
                <span className="bg-white/20 px-1 rounded text-[10px]">42%</span>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
              <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <div className="flex -space-x-2">
                  <div className="size-6 rounded-full border border-black bg-gray-500"></div>
                  <div className="size-6 rounded-full border border-black bg-gray-600"></div>
                  <div className="size-6 rounded-full border border-black bg-gray-700"></div>
                </div>
                <span className="text-white text-xs font-medium">3 active detections</span>
              </div>
              <div className="flex gap-2">
                <button className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-lg backdrop-blur-md transition-all border border-white/10">
                  <span className="material-symbols-outlined text-xl">settings_overscan</span>
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-lg backdrop-blur-md transition-all border border-white/10">
                  <span className="material-symbols-outlined text-xl">screenshot_region</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="flex-1 bg-[#1f2937] border border-[#374151] hover:bg-[#374151] text-white h-14 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all">
              <span className="material-symbols-outlined text-red-500">videocam_off</span>
              Stop Camera
            </button>
            <button className="flex-[2] bg-primary hover:bg-blue-700 text-white h-14 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg transition-all shadow-blue-900/40">
              <span className="material-symbols-outlined">stop_circle</span>
              End Attendance Session
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 h-full">
          <div className="bg-[#111827] rounded-xl border border-[#1f2937] shadow-2xl flex flex-col h-full overflow-hidden">
            <div className="flex border-b border-[#1f2937] bg-[#0d121b]/50">
              <button className="flex-1 py-5 text-sm font-bold border-b-2 border-primary text-primary transition-colors flex items-center justify-center gap-2">
                Present
                <span className="bg-primary/20 text-primary text-xs px-2.5 py-0.5 rounded-full border border-primary/30">
                  12
                </span>
              </button>
              <button className="flex-1 py-5 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2">
                Unknown
                <span className="bg-amber-900/30 text-amber-500 text-xs px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  1
                </span>
              </button>
              <button className="flex-1 py-5 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2">
                Missing
                <span className="bg-gray-800 text-gray-400 text-xs px-2.5 py-0.5 rounded-full border border-gray-700">
                  45
                </span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#1f2937] shadow-md z-10">
                  <tr>
                    <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Student Information
                    </th>
                    <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">
                      Time
                    </th>
                    <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">
                      Conf.
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2937]">
                  {presentStudents.map((student, idx) => (
                    <tr
                      key={student.id}
                      className={`hover:bg-primary/10 transition-colors group cursor-pointer border-l-4 ${
                        idx === 2 ? "bg-primary/5 border-primary" : "border-transparent hover:border-primary"
                      }`}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          {student.avatar.startsWith("http") ? (
                            <div
                              className="ring-2 ring-primary/30 rounded-full size-10 bg-cover bg-center"
                              style={{ backgroundImage: `url('${student.avatar}')` }}
                            ></div>
                          ) : (
                            <div className="bg-primary text-white rounded-full size-10 flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/20">
                              {student.avatar}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-400">ID: {student.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right text-sm text-gray-300">{student.time}</td>
                      <td className="py-4 px-5 text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold border ${
                          parseInt(student.conf) >= 85
                            ? "bg-green-900/30 text-green-400 border-green-500/30"
                            : "bg-amber-900/30 text-amber-500 border-amber-500/30"
                        }`}>
                          {student.conf}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-[#0d121b] border-t border-[#1f2937] grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-[#1f2937] p-3 rounded-lg border border-[#374151] flex flex-col items-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</span>
                <span className="text-xl font-bold text-white">57</span>
              </div>
              <div className="bg-[#1f2937] p-3 rounded-lg border border-green-500/20 flex flex-col items-center">
                <span className="text-[10px] text-green-500/70 font-bold uppercase tracking-wider">Present</span>
                <span className="text-xl font-bold text-green-400">12</span>
              </div>
              <div className="bg-[#1f2937] p-3 rounded-lg border border-amber-500/20 flex flex-col items-center">
                <span className="text-[10px] text-amber-500/70 font-bold uppercase tracking-wider">Unknown</span>
                <span className="text-xl font-bold text-amber-400">1</span>
              </div>
              <div className="bg-[#1f2937] p-3 rounded-lg border border-red-500/20 flex flex-col items-center">
                <span className="text-[10px] text-red-500/70 font-bold uppercase tracking-wider">Remaining</span>
                <span className="text-xl font-bold text-red-400">44</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
