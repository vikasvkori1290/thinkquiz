import React from 'react';
import { Gamepad2 } from 'lucide-react';

export default function ArenaPlaceholder() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 border border-dashed border-[#2A2A2E] rounded-2xl bg-[#161618]/50">
      <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-zinc-500 mb-4">
        <Gamepad2 className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-zinc-300">Arena Section</h2>
      <p className="text-xs text-zinc-500 max-w-sm mt-1">
        This section is reserved for live Socratic quiz sessions. Select a mode from the Dashboard to launch.
      </p>
    </div>
  );
}
