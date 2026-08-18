import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import QuizGenerator from './components/QuizGenerator';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'quiz'

  if (view === 'quiz') {
    return <QuizGenerator onGoHome={() => setView('landing')} />;
  }

  return <LandingPage onOpenQuiz={() => setView('quiz')} />;
}
