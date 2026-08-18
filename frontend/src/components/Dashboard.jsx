import React from 'react';
import { Code2, Globe, AlertTriangle, ChevronRight, BrainCircuit } from 'lucide-react';
import ContributionHeatmap from './ContributionHeatmap';

export default function Dashboard({ onStartQuiz, onStartSrs }) {
  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Progress Banner */}
      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-2xl p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <BrainCircuit className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-xs text-zinc-400 mt-1 font-medium">Ready for your next Socratic quiz session?</p>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-72 hidden sm:block">
          <div className="flex justify-between text-xs text-zinc-400 font-medium mb-1.5">
            <span>Level 12</span>
            <span>2,488 XP</span>
          </div>
          <div className="w-full bg-[#2A2A2E] h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full w-[78%] transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          </div>
        </div>
      </div>

      {/* Action Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LeetCode Socratic Quiz Card */}
        <div
          onClick={() => onStartQuiz('leetcode')}
          className="bg-[#1C1C1F] border border-[#2A2A2E] hover:border-amber-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:scale-[1.01] group shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
                ALGORITHMS
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              LeetCode Quiz
            </h3>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Test your logic with Socratic AI prompts.
            </p>
          </div>
        </div>

        {/* System Design Quiz Card */}
        <div
          onClick={() => onStartQuiz('webdev')}
          className="bg-[#1C1C1F] border border-[#2A2A2E] hover:border-emerald-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:scale-[1.01] group shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                WEB DEV
              </span>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
              Web Dev Quiz
            </h3>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              Review core concepts & architecture.
            </p>
          </div>
        </div>

        {/* Daily Review SRS Card */}
        <div className="bg-[#1C1C1F] border border-amber-500/50 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2 text-amber-500">
              <AlertTriangle className="w-5 h-5 fill-amber-500/20" />
              <h3 className="text-sm font-bold text-white">Daily Review</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              Spaced Repetition review items.
            </p>
          </div>

          <button
            onClick={onStartSrs}
            className="mt-5 w-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <span>Start SRS Session</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quiz Activity Heatmap Card */}
      <ContributionHeatmap />
    </div>
  );
}

