import React from 'react';
import { Search, Flame, Trophy, Bell } from 'lucide-react';

export default function Header({ userStats = { streak: 14, xp: 2488 } }) {
  return (
    <header className="h-20 border-b border-[#232326] bg-[#121214]/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search questions, topics"
          className="w-full bg-[#1C1C1F] border border-[#2A2A2E] rounded-full pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-all"
        />
      </div>

      {/* User Stats & Badges */}
      <div className="flex items-center gap-4">
        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 bg-[#1C1C1F] border border-[#2A2A2E] px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-400 shadow-inner">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{userStats.streak}</span>
        </div>

        {/* XP Pill */}
        <div className="flex items-center gap-1.5 bg-[#1C1C1F] border border-[#2A2A2E] px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-400 shadow-inner">
          <Trophy className="w-4 h-4 text-emerald-500" />
          <span>{userStats.xp.toLocaleString()} XP</span>
        </div>

        {/* Notifications Bell */}
        <button className="w-9 h-9 rounded-full bg-[#1C1C1F] border border-[#2A2A2E] flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        {/* User Profile Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-md cursor-pointer hover:scale-105 transition-transform">
          <div className="w-full h-full bg-[#161618] rounded-full flex items-center justify-center text-xs font-bold text-amber-400">
            AA
          </div>
        </div>
      </div>
    </header>
  );
}
