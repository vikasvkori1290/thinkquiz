import React, { useState } from 'react';
import { Brain, Search, Sparkles, Code2, Lightbulb, ChevronRight, CheckCircle2, RefreshCw, Cpu, Layers } from 'lucide-react';

export default function QuizGenerator({ onGoHome }) {
  const [problemInput, setProblemInput] = useState('15');
  const [difficulty, setDifficulty] = useState('Medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [activeProvider, setActiveProvider] = useState('Google Gemini 2.5');

  // Mock generated Socratic quiz data
  const mockQuiz = {
    title: '3Sum',
    number: '15',
    difficulty: 'Medium',
    description:
      'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.',
    codeSnippet: `def threeSum(nums: List[int]) -> List[List[int]]:
    res = set()
    n = len(nums)
    
    # Naive 3-pointer brute force approach
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                if nums[i] + nums[j] + nums[k] == 0:
                    res.add(tuple(sorted([nums[i], nums[j], nums[k]])))
                    
    return list(res)`,
    questionText:
      'What is the primary architectural and algorithmic flaw of utilizing the naive 3-pointer brute force approach shown above?',
    options: [
      {
        id: 0,
        text: 'It relies on a set() for deduplication, which is structurally invalid in Python for tuple objects.',
      },
      {
        id: 1,
        text: 'The time complexity is O(N³), making it highly inefficient and prone to Time Limit Exceeded (TLE) errors for large datasets.',
      },
      {
        id: 2,
        text: 'Sorting the triplet inside the innermost loop alters the original array indices, leading to incorrect sum calculations.',
      },
      {
        id: 3,
        text: 'It fails to handle edge cases where the input array contains negative numbers.',
      },
    ],
    hint: '💡 Socratic AI Hint: Consider how sorting the array prior to iteration allows two pointers to converge from opposite ends in O(N²) time instead of nested triple loops.',
  };

  const handleGenerate = (e) => {
    e?.preventDefault();
    setIsGenerating(true);
    setSelectedOption(null);
    setShowHint(false);

    // Rotate provider to demonstrate 3-API traffic controller
    const providers = ['Google Gemini 2.5', 'Groq (Llama-3.3)', 'OpenAI GPT-4o-mini'];
    const nextProv = providers[Math.floor(Math.random() * providers.length)];

    setTimeout(() => {
      setActiveProvider(nextProv);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white font-sans selection:bg-amber-500 selection:text-black relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#17140b_1px,transparent_1px),linear-gradient(to_bottom,#17140b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between relative z-20 border-b border-zinc-900">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Brain className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Code<span className="text-amber-400">Soch</span>
          </span>
        </div>

        {/* Traffic Controller AI Status Badge */}
        <div className="hidden sm:flex items-center gap-3 bg-[#0c0d12] border border-amber-500/30 px-4 py-2 rounded-full text-xs text-zinc-300">
          <Cpu className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-mono text-amber-400 font-bold">3-API Traffic Engine:</span>
          <span className="text-zinc-400 font-mono">Gemini • Groq • OpenAI</span>
        </div>

        <button
          onClick={onGoHome}
          className="text-xs font-mono font-bold text-zinc-400 hover:text-amber-400 uppercase tracking-wider transition-colors"
        >
          ← Back to Home
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-8 py-10 space-y-10 relative z-10">
        {/* LeetCode Quiz Generator Form Card */}
        <div className="bg-[#0c0d12] border border-amber-500/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(245,158,11,0.08)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Socratic Generator</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                LeetCode Socratic Quiz Section
              </h1>
              <p className="text-xs text-zinc-400 mt-1 font-normal">
                Enter any LeetCode problem number or slug to synthesize AI-guided Socratic questions.
              </p>
            </div>

            {/* Provider Pill */}
            <div className="flex items-center gap-2 bg-[#12131a] border border-zinc-800 px-3.5 py-1.5 rounded-lg text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-zinc-400">Active AI:</span>
              <span className="text-amber-400 font-bold">{activeProvider}</span>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Input Box */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/70" />
              <input
                type="text"
                value={problemInput}
                onChange={(e) => setProblemInput(e.target.value)}
                placeholder="Enter LeetCode Problem # or Slug (e.g., 15, two-sum, 3sum)"
                className="w-full bg-[#14151c] border border-zinc-800 focus:border-amber-500 rounded-xl pl-11 pr-4 py-3.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
              />
            </div>

            {/* Difficulty Selector */}
            <div className="md:col-span-3 flex items-center bg-[#14151c] border border-zinc-800 rounded-xl p-1.5 gap-1">
              {['Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                    difficulty === diff
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Generate Button */}
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black text-xs font-black font-mono uppercase py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Generate Quiz</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Generated Socratic Quiz Display */}
        <div className="space-y-6">
          {/* Quiz Top Metadata Bar */}
          <div className="flex items-center justify-between bg-[#0c0d12] border border-zinc-800 px-6 py-4 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-md">
                LeetCode #{mockQuiz.number}
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">{mockQuiz.title}</h2>
              <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full border border-zinc-700">
                {mockQuiz.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
              <span>Question 1 of 3</span>
              <span className="text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                AI Provider: {activeProvider}
              </span>
            </div>
          </div>

          {/* Main Quiz Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Problem & Code Snippet */}
            <div className="lg:col-span-5 space-y-6">
              {/* Problem Description */}
              <div className="bg-[#0c0d12] border border-zinc-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                  Problem Description
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                  {mockQuiz.description}
                </p>
              </div>

              {/* Code Snippet Box */}
              <div className="bg-[#0c0d12] border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="bg-[#12131a] px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    <span>Approach: Naive Brute Force</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Python3</span>
                </div>
                <pre className="p-5 text-xs font-mono text-amber-200/90 leading-relaxed overflow-x-auto bg-[#08090d]">
                  <code>{mockQuiz.codeSnippet}</code>
                </pre>
              </div>
            </div>

            {/* Right Column: Socratic Question & Choice Cards */}
            <div className="lg:col-span-7 space-y-6">
              {/* Socratic Inquiry Banner */}
              <div className="bg-[#0c0d12] border border-amber-500/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(245,158,11,0.05)] space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 tracking-wider uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Socratic Inquiry</span>
                </div>
                <h2 className="text-lg font-bold text-white leading-snug">
                  {mockQuiz.questionText}
                </h2>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-3">
                {mockQuiz.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  const optionLetters = ['A', 'B', 'C', 'D'];
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                          : 'bg-[#0c0d12] border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-[#101118]'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 text-black'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {optionLetters[opt.id]}
                      </div>
                      <p className="text-xs leading-relaxed font-normal pt-1 flex-1">{opt.text}</p>
                    </div>
                  );
                })}
              </div>

              {/* Socratic Hint & Action Buttons */}
              <div className="space-y-4 pt-2">
                {/* Hint Toggle Button */}
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>{showHint ? 'Hide Socratic Hint' : '💡 Reveal AI Socratic Hint'}</span>
                </button>

                {/* Collapsible Socratic Hint Box */}
                {showHint && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs font-mono text-amber-300 leading-relaxed shadow-inner">
                    {mockQuiz.hint}
                  </div>
                )}

                {/* Submit Action */}
                <div className="flex items-center justify-end pt-2">
                  <button
                    disabled={selectedOption === null}
                    className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black text-xs font-black font-mono uppercase px-8 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95"
                  >
                    <span>Submit Answer</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
