import React from 'react';
import { BarChart3, Trophy, Flame, Shield } from 'lucide-react';

export default function Leaderboard() {
  const topUsers = [
    { rank: 1, name: 'Alex Rivera', username: 'arivera', xp: 4820, level: 24, streak: 32 },
    { rank: 2, name: 'Vikas Kori', username: 'vikasvkori', xp: 2488, level: 12, streak: 14 },
    { rank: 3, name: 'Elena Rostova', username: 'erostova', xp: 2210, level: 11, streak: 9 },
    { rank: 4, name: 'Marcus Chen', username: 'mchen', xp: 1980, level: 10, streak: 18 },
    { rank: 5, name: 'Sophia Patel', username: 'spatel', xp: 1750, level: 9, streak: 7 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-500" />
          <span>Global Developer Leaderboard</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Top intuitive algorithm developers ranked by XP and daily activity streaks.
        </p>
      </div>

      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#161618] border-b border-[#2A2A2E] text-zinc-400 font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">Developer</th>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4">Streak</th>
              <th className="px-6 py-4 text-right">Total XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232326]">
            {topUsers.map((u) => (
              <tr key={u.rank} className="hover:bg-[#222226]/50 transition-colors">
                <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                  {u.rank === 1 && <Trophy className="w-4 h-4 text-amber-400" />}
                  {u.rank === 2 && <Trophy className="w-4 h-4 text-zinc-400" />}
                  {u.rank === 3 && <Trophy className="w-4 h-4 text-amber-700" />}
                  <span>#{u.rank}</span>
                </td>
                <td className="px-6 py-4 font-medium text-white">
                  <div>{u.name}</div>
                  <div className="text-[10px] text-zinc-500">@{u.username}</div>
                </td>
                <td className="px-6 py-4 text-amber-400 font-semibold">
                  <span className="bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full text-[10px]">
                    Lvl {u.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-300 font-medium">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{u.streak} Days</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-extrabold text-emerald-400">
                  {u.xp.toLocaleString()} XP
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
