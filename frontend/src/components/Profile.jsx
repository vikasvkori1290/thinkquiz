import React from 'react';
import { User, Award, Flame, Trophy, CheckCircle } from 'lucide-react';

export default function Profile() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-6 bg-[#1C1C1F] border border-[#2A2A2E] rounded-2xl p-6 shadow-sm">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-md">
          <div className="w-full h-full bg-[#161618] rounded-2xl flex items-center justify-center text-xl font-bold text-amber-400">
            AA
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Algorithm Architect</h2>
          <p className="text-xs text-zinc-400 mt-0.5">@algorithm_architect • Level 12</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              14 Day Streak
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              2,488 XP
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Profile Completion Bonus (+10 XP)</h3>
        <div className="w-full bg-[#2A2A2E] h-2 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full rounded-full w-full" />
        </div>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle className="w-4 h-4" /> Profile Details 100% Completed
          </span>
          <span>+10 XP Claimed</span>
        </div>
      </div>
    </div>
  );
}
