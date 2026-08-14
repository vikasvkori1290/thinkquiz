import React from 'react';
import { Settings, Shield, Bell, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-500" />
          <span>Account Settings</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1">Manage your credentials, preferences, and account data.</p>
      </div>

      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-2xl p-6 space-y-6 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-white mb-1">Preferences</h3>
          <p className="text-xs text-zinc-400">Configure quiz difficulty defaults and AI provider preferences.</p>
        </div>

        <div className="border-t border-[#232326] pt-6">
          <h3 className="text-sm font-bold text-rose-500 mb-1">Danger Zone</h3>
          <p className="text-xs text-zinc-400 mb-4">Permanently purge your account, XP, daily streak history, and Spaced Repetition queue.</p>
          <button className="bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all">
            <Trash2 className="w-4 h-4" />
            <span>Delete Account Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
}
