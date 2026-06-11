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
import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"leetcode" | "concept">("leetcode");
  
  // Real Quiz State
  const [quizData, setQuizData] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [gamificationResult, setGamificationResult] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        
        // Fetch initial gamification stats
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${user.id}/stats`)
          .then(res => res.ok ? res.json() : null)
          .then(stats => {
            if (stats) {
              setGamificationResult({
                new_xp: stats.current_xp,
                new_level: stats.current_level,
                streak: stats.streak_days,
                leveled_up: false
              });
            } else {
              setGamificationResult({ new_xp: 0, new_level: 1, streak: 0, leveled_up: false });
            }
          })
          .catch(console.error);
      }
    });
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setQuizData(null);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
    setGamificationResult(null);
    
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
      
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid quiz data received from server");
      }

      // Randomly shuffle the options for every question so the answer isn't always first!
      data.questions.forEach((q: any) => {
        q.options.sort(() => Math.random() - 0.5);
      });

      setQuizData(data);
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleOptionSelect = (option: any) => {
    if (selectedOption) return; // Prevent double clicking
    setSelectedOption(option);
  };

  const handleNextQuestion = async () => {
    // Determine if we just scored
    const earnedPoint = selectedOption?.is_correct ? 1 : 0;
    const currentScore = score + earnedPoint;
    setScore(currentScore);

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      // Quiz Finished! Submit results
      setIsFinished(true);
      try {
        const payload = {
          user_id: user?.id || "a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6", // Using your real UUID!
          quiz_id_or_concept: quizData.id_or_concept,
          score: currentScore
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        setGamificationResult(data);
        if (data.leveled_up || currentScore === quizData.questions.length) {
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
        alert(`🎉 Quiz Complete! Score: ${currentScore}/${quizData.questions.length}\n🔥 You now have ${data.new_xp} XP!\n⚡ Streak: ${data.streak} days\n${data.leveled_up ? '🌟 YOU LEVELED UP!' : ''}`);
      } catch (err) {
        console.error(err);
        alert("Failed to submit quiz results.");
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
                XP: {gamificationResult ? gamificationResult.new_xp : "???"}
              </span>
              <Progress value={65} className="h-2 w-full [&>div]:bg-accent" />
            </div>
            <div className="flex items-center gap-1.5 font-bold text-[hsl(var(--accent))] px-3 py-1 bg-accent/10 rounded-full">
              <Flame className="h-4 w-4 fill-current" />
              <span>{gamificationResult ? gamificationResult.streak : "???"}</span>
            </div>
          </div>

          {/* Right: Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="border-2 border-border h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {user?.email?.substring(0, 2).toUpperCase() || "VK"}
              </AvatarFallback>
            </Avatar>
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
                    const isWrongSelection = isSelected && !isCorrect;
                    
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
                </div>

                {/* Feedback State & Next Button */}
                {selectedOption && (
                  <div className="mt-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className={`p-4 rounded-lg border flex items-start gap-3 ${
                      selectedOption.is_correct 
                        ? "bg-primary/10 border-primary/20 text-primary" 
                        : "bg-accent/10 border-accent/30 text-foreground"
                    }`}>
                      {selectedOption.is_correct ? (
                        <div className="font-semibold flex items-center gap-2">
                          🎉 Correct! {selectedOption.hint_if_wrong || "Great job!"}
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-bold text-[hsl(var(--accent))] mix-blend-multiply dark:mix-blend-normal mb-1">Not quite!</span>
                          <span className="text-muted-foreground font-medium">
                            Hint: {selectedOption.hint_if_wrong}
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
      </main>
    </div>
  );
}
