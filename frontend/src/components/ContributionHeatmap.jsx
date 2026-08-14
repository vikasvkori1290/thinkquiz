import React from 'react';

export default function ContributionHeatmap() {
  // Generate mock 52 weeks x 7 days dataset
  const weeks = 36;
  const daysPerWeek = 7;

  // Level 0 to 4 colors matching dark theme
  const getTileColor = (val) => {
    switch (val) {
      case 1:
        return 'bg-[#392911]';
      case 2:
        return 'bg-[#785419]';
      case 3:
        return 'bg-[#b8801d]';
      case 4:
        return 'bg-amber-500';
      default:
        return 'bg-[#232326]';
    }
  };

  // Generate deterministic activity pattern
  const grid = Array.from({ length: weeks }, (_, wIdx) =>
    Array.from({ length: daysPerWeek }, (_, dIdx) => {
      const randomVal = (wIdx * 7 + dIdx) % 7;
      if (randomVal === 0) return 0;
      if (randomVal === 1 || randomVal === 2) return 1;
      if (randomVal === 3) return 2;
      if (randomVal === 4) return 3;
      return 4;
    })
  );

  return (
    <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
          <span>📅</span>
          <span>Quiz Activity</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Less</span>
          <div className="flex gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#232326]"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#392911]"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#785419]"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#b8801d]"></span>
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1.5 min-w-max">
          {grid.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((val, dIdx) => (
                <div
                  key={dIdx}
                  className={`w-3 h-3 rounded-sm ${getTileColor(val)} hover:ring-1 hover:ring-amber-400 transition-all cursor-pointer`}
                  title={`Activity Level ${val}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
