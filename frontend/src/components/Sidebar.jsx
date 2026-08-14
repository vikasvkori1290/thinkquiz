import React from 'react';
import { LayoutGrid, Gamepad2, Archive, BarChart3, User, Settings, BrainCircuit } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'arena', label: 'Arena', icon: Gamepad2 },
    { id: 'srs', label: 'SRS Queue', icon: Archive },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
  ];

  const bottomItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#161618] border-r border-[#232326] flex flex-col h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-1">
            ThinkQuiz
          </h1>
          <p className="text-xs text-amber-500/80 font-medium tracking-wide">Socratic AI</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#222226] text-white border border-[#2F2F34] shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1C1C1F]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-500' : 'text-zinc-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-[#232326] space-y-1.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#222226] text-white border border-[#2F2F34]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1C1C1F]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-500' : 'text-zinc-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
