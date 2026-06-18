"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Flame, Loader2, Search, BrainCircuit, ArrowRight, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface UserStats {
  current_xp: number;
  current_level: number;
  current_streak: number;
}

interface QuizClientProps {
  user: any;
  initialStats: UserStats;
  completedTodaySlugs?: string[];
}

export function QuizClient({ user, initialStats, completedTodaySlugs = [] }: QuizClientProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"leetcode" | "concept">("leetcode");
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // Real Quiz State
  const [quizData, setQuizData] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // Hydrate local state with initialStats passed from server
  const [gamificationResult, setGamificationResult] = useState<{
    new_xp: number;
    new_level: number;
    streak: number;
    leveled_up: boolean;
  }>({
    new_xp: initialStats.current_xp,
    new_level: initialStats.current_level,
    streak: initialStats.current_streak,
    leveled_up: false
  });
  
  const router = useRouter();
  const supabase = createClient();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setQuizData(null);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsRevealed(false);
    setScore(0);
    setXpEarned(0);
    setIsFinished(false);
    setSearchError(null);
    
    try {
      const formattedSlug = searchQuery.trim().toLowerCase().replace(/\s+/g, '-');
      const payload = searchMode === "leetcode" 
        ? { leetcode_slug: formattedSlug, concept_topic: null }
        : { leetcode_slug: null, concept_topic: searchQuery };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || "Failed to generate quiz");
      }

      // Final UI check: does the generated slug match a completed one?
      if (completedTodaySlugs.includes(data.id_or_concept)) {
         setSearchError("Cooldown: You have already completed this topic today. Please try a different topic.");
         setIsSearching(false);
         setSearchQuery("");
         return;
      }
      
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid quiz data received from server");
      }

      // Randomly shuffle the options for every question
      data.questions.forEach((q: any) => {
        q.options.sort(() => Math.random() - 0.5);
      });

      setQuizData(data);
    } catch (err: any) {
      console.error(err);
      setSearchError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleOptionSelect = (option: any) => {
    if (selectedOption || isRevealed) return;
    setSelectedOption(option);
    
    if (option.is_correct) {
      setScore(prev => prev + 1);
      setXpEarned(prev => prev + 10);
    } else {
      setXpEarned(prev => prev - 5);
    }
  };

  const handleRevealAnswer = () => {
    if (selectedOption || isRevealed) return;
    setIsRevealed(true);
    const correctOption = quizData.questions[currentQuestionIndex].options.find((o: any) => o.is_correct);
    setSelectedOption(correctOption);
    // +0 XP for revealing
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsRevealed(false);
    } else {
      setIsFinished(true);
      try {
        const payload = {
          user_id: user.id,
          quiz_id_or_concept: quizData.id_or_concept,
          score: score,
          xp_earned: xpEarned
        };

        const { data: { session } } = await supabase.auth.getSession();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/submit`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
          },
          body: JSON.stringify(payload)
        });
        
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 403) {
            alert(data.detail || "Cooldown: You have already completed this topic today.");
            router.push("/dashboard");
            return;
          }
          throw new Error(data.detail || "Failed to submit quiz to server");
        }
        
        // Optimistic UI Update: the server returns the updated XP, streak, etc.
        setGamificationResult({
          new_xp: data.new_xp,
          new_level: data.new_level,
          streak: data.streak,
          leveled_up: data.leveled_up
        });
        
        if (data.leveled_up || score === quizData.questions.length) {
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Failed to submit quiz results.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 max-w-6xl mx-auto w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">ThinkQuiz</span>
          </Link>

          {/* Center Section: Progress & Streak */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center max-w-md">
            <div className="flex-1 flex items-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                XP: {gamificationResult.new_xp}
              </span>
              <Progress value={(gamificationResult.new_xp % 100)} className="h-2 w-full [&>div]:bg-accent" />
            </div>
            <div className="flex items-center gap-1.5 font-bold text-[hsl(var(--accent))] px-3 py-1 bg-accent/10 rounded-full">
              <Flame className="h-4 w-4 fill-current" />
              <span>{gamificationResult.streak}</span>
            </div>
          </div>

          {/* Right: Avatar */}
          <div className="flex items-center gap-4">
            <Link href="/history" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
              History
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
              Leaderboard
            </Link>
            <Link href="/dashboard">
              <Avatar className="border-2 border-border h-9 w-9 cursor-pointer hover:border-primary transition-colors">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {user?.email?.substring(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <CommandMenu />
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/login");
              }}
              title="Sign Out"
            >
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-4 pt-12 max-w-4xl mx-auto w-full">
        {/* Search Arena */}
        <div className="w-full max-w-2xl flex flex-col items-center gap-6 mb-12">
          <Tabs defaultValue="leetcode" className="w-full max-w-sm mx-auto" onValueChange={(v) => setSearchMode(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="leetcode">LeetCode Mode</TabsTrigger>
              <TabsTrigger value="concept">Concept Mode</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex w-full items-center space-x-2">
            <Input 
              type="text" 
              placeholder={searchMode === "leetcode" ? "e.g. two-sum" : "e.g. Dynamic Programming"} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="h-12 text-lg shadow-sm"
            />
            <Button 
              type="submit" 
              size="lg" 
              className="h-12 px-8 shadow-sm" 
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Inline Error Message */}
          {searchError && (
            <div className="w-full p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {searchError}
            </div>
          )}
        </div>

        {/* Skeleton Loading State */}
        {isSearching && (
          <div className="w-full max-w-2xl animate-in fade-in duration-500">
            <Card className="border-border shadow-sm">
              <CardHeader className="bg-muted/30 border-b pb-6 rounded-t-lg">
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-4/5 mt-2" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quiz Engine */}
        {quizData && !isFinished && (
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-border shadow-sm">
              <CardHeader className="bg-muted/30 border-b pb-6 rounded-t-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-primary uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} of {quizData.questions.length}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground bg-background px-2 py-1 rounded border">
                    {quizData.id_or_concept}
                  </span>
                </div>
                <CardTitle className="text-2xl leading-relaxed mt-2">
                  {quizData.questions[currentQuestionIndex].question_text}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col gap-3">
                  {quizData.questions[currentQuestionIndex].options.map((option: any, index: number) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option.is_correct;
                    
                    let buttonVariant: "default" | "outline" | "secondary" = "outline";
                    let buttonClass = "h-auto py-4 text-base justify-start px-6 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:bg-muted text-left whitespace-normal";
                    
                    if (selectedOption) {
                      if (isCorrect) {
                        buttonVariant = "default";
                        buttonClass = "h-auto py-4 text-base justify-start px-6 font-medium transition-all bg-primary text-primary-foreground";
                      } else if (isSelected) {
                        buttonClass = "h-auto py-4 text-base justify-start px-6 font-medium transition-all border-accent border-2 bg-accent/5 text-foreground";
                      } else {
                        buttonClass += " opacity-50";
                      }
                    }

                    return (
                      <Button
                        key={index}
                        variant={buttonVariant}
                        className={buttonClass}
                        onClick={() => handleOptionSelect(option)}
                        disabled={selectedOption !== null} // Disable all after a selection
                      >
                        {option.option_text}
                      </Button>
                    );
                  })}
                  {!selectedOption && !isRevealed && (
                    <Button 
                      variant="ghost" 
                      className="mt-2 text-muted-foreground hover:text-foreground font-medium" 
                      onClick={handleRevealAnswer}
                    >
                      Reveal Answer (0 XP)
                    </Button>
                  )}
                </div>

                {/* Feedback State & Next Button */}
                {(selectedOption || isRevealed) && (
                  <div className="mt-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className={`p-4 rounded-lg border flex items-start gap-3 ${
                      isRevealed 
                        ? "bg-muted border-border text-foreground" 
                        : selectedOption?.is_correct 
                          ? "bg-primary/10 border-primary/20 text-primary" 
                          : "bg-accent/10 border-accent/30 text-foreground"
                    }`}>
                      {isRevealed ? (
                        <div className="font-semibold flex items-center gap-2">
                          👀 Answer Revealed! <span className="text-muted-foreground">0 XP</span>
                        </div>
                      ) : selectedOption?.is_correct ? (
                        <div className="font-semibold flex items-center gap-2">
                          🎉 Correct! <span className="text-green-500 font-bold ml-1">+10 XP</span> {selectedOption.hint_if_wrong && <span className="text-muted-foreground ml-2 font-normal">{selectedOption.hint_if_wrong}</span>}
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-bold text-[hsl(var(--accent))] mix-blend-multiply dark:mix-blend-normal mb-1">Not quite! <span className="text-red-500 ml-1">-5 XP</span></span>
                          <span className="text-muted-foreground font-medium">
                            Hint: {selectedOption?.hint_if_wrong}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Button onClick={handleNextQuestion} className="w-full h-12 text-lg">
                      {currentQuestionIndex < quizData.questions.length - 1 ? "Next Question" : "Finish Quiz"} 
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Completion Screen */}
        {quizData && isFinished && (
          <div className="w-full max-w-2xl animate-in zoom-in-95 duration-700">
            <Card className="border-primary/40 shadow-xl shadow-primary/10 overflow-hidden relative bg-card/60 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none"></div>
              <CardContent className="p-12 flex flex-col items-center text-center relative z-10">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-6 animate-bounce">
                  <span className="text-5xl">🏆</span>
                </div>
                
                <h2 className="text-4xl font-extrabold tracking-tight mb-2">Quiz Completed!</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  You scored <strong className="text-foreground">{score}</strong> out of {quizData.questions.length} on <strong className="text-foreground">{quizData.id_or_concept}</strong>.
                </p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-10">
                  <div className={`flex flex-col items-center p-4 rounded-xl border border-border/50 ${xpEarned >= 0 ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                    <span className={`text-3xl font-black drop-shadow-sm mb-1 ${xpEarned >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {xpEarned >= 0 ? "+" : ""}{xpEarned} XP
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total XP Gained</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-muted/50 border border-border/50">
                    <span className="text-3xl font-black text-primary drop-shadow-sm mb-1 flex items-center gap-1">
                      {gamificationResult.streak} <Flame className="h-6 w-6" />
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Day Streak</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  {searchMode === "leetcode" && (
                    <Button 
                      size="lg" 
                      className="h-12 px-8 font-semibold shadow-md w-full sm:w-auto bg-[#fbcc45] text-black hover:bg-[#fbcc45]/90"
                      onClick={() => window.open(`https://leetcode.com/problems/${quizData.id_or_concept}`, "_blank")}
                    >
                      Solve on LeetCode
                    </Button>
                  )}
                  <Link href="/dashboard" passHref>
                    <Button size="lg" variant={searchMode === "leetcode" ? "outline" : "default"} className="h-12 px-8 font-semibold shadow-md w-full sm:w-auto">
                      Return to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
