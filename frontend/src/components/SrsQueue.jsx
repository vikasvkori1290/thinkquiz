import React from 'react';
import { Archive, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function SrsQueue() {
  const dueItems = [
    { id: 1, topic: 'LeetCode #15: 3Sum', type: 'Algorithm', interval: '1 Day', ease: 2.5 },
    { id: 2, topic: 'React Reconciliation & Fiber Tree', type: 'Web Dev', interval: '3 Days', ease: 2.6 },
    { id: 3, topic: 'MongoDB Indexing & B-Trees', type: 'Database', interval: '2 Days', ease: 2.4 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Archive className="w-5 h-5 text-amber-500" />
            <span>Spaced Repetition Queue (SM-2 Engine)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Review weak topics automatically scheduled to prevent memory decay.
          </p>
        </div>
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
          3 Items Due Today
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {dueItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#1C1C1F] border border-[#2A2A2E] hover:border-amber-500/30 rounded-xl p-5 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{item.topic}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                  <span className="bg-[#232326] px-2 py-0.5 rounded text-[10px] text-zinc-300">
                    {item.type}
                  </span>
                  <span>Interval: {item.interval}</span>
                  <span>Easiness: {item.ease}</span>
                </div>
              </div>
            </div>

            <button className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Review Now</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
