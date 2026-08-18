import React from 'react';
import { Flame, Trophy } from 'lucide-react';

export default function Header({ userStats = { streak: 14, xp: 2488 } }) {
  return (
    <header className="h-16 border-b border-[#232326] bg-[#121214]/80 backdrop-blur-md px-8 flex items-center justify-end sticky top-0 z-20">
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

        {/* User Profile Avatar */}
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-amber-500 to-amber-700 p-0.5 shadow-md cursor-pointer hover:scale-105 transition-transform">
          <div className="w-full h-full bg-[#161618] rounded-full flex items-center justify-center text-xs font-bold text-amber-400">
            AA
          </div>
        </div>
      </div>
    </header>
  );
}

