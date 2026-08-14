import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ArenaPlaceholder from './components/ArenaPlaceholder';
import SrsQueue from './components/SrsQueue';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import SettingsPage from './components/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userStats, setUserStats] = useState({
    streak: 14,
    xp: 2488,
    level: 12,
  });

  const handleStartQuiz = (mode) => {
    // When quiz starts, route to arena
    setActiveTab('arena');
  };

  const handleStartSrs = () => {
    setActiveTab('srs');
  };

  return (
    <div className="flex min-h-screen bg-[#121214] text-zinc-200">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header userStats={userStats} />

        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard onStartQuiz={handleStartQuiz} onStartSrs={handleStartSrs} />
          )}
          {activeTab === 'arena' && <ArenaPlaceholder />}
          {activeTab === 'srs' && <SrsQueue />}
          {activeTab === 'leaderboard' && <Leaderboard />}
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}
