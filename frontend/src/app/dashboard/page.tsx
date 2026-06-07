"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Flame, Loader2, Search, BrainCircuit } from "lucide-react";

export default function Dashboard() {
  const [isSearching, setIsSearching] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock Quiz State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const options = ["Sliding Window", "Two Pointers", "Hash Map", "Backtracking"];
  const correctAnswer = "Hash Map";

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowQuiz(false);
    setSelectedOption(null);
    
    // Simulate API Call
    setTimeout(() => {
      setIsSearching(false);
      setShowQuiz(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 max-w-6xl mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">ThinkQuiz</span>
          </div>

          {/* Center Section: Progress & Streak */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center max-w-md">
            <div className="flex-1 flex items-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">XP: 1250</span>
              <Progress value={65} className="h-2 w-full [&>div]:bg-accent" />
            </div>
            <div className="flex items-center gap-1.5 font-bold text-[hsl(var(--accent))] px-3 py-1 bg-accent/10 rounded-full">
              <Flame className="h-4 w-4 fill-current" />
              <span>12</span>
            </div>
          </div>

          {/* Right: Avatar */}
          <div className="flex items-center">
            <Avatar className="border-2 border-border h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">VK</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-4 pt-12 max-w-4xl mx-auto w-full">
        
        {/* Search Arena */}
        <div className="w-full max-w-2xl flex flex-col items-center gap-6 mb-12">
          <Tabs defaultValue="leetcode" className="w-full max-w-sm mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="leetcode">LeetCode Mode</TabsTrigger>
              <TabsTrigger value="concept">Concept Mode</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex w-full items-center space-x-2">
            <Input 
              type="text" 
              placeholder="e.g. Two Sum, Dynamic Programming..." 
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

        {/* Mock Quiz Engine */}
        {showQuiz && (
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-border shadow-sm">
              <CardHeader className="bg-muted/30 border-b pb-6 rounded-t-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-primary uppercase tracking-wider">Concept Quiz</span>
                  <span className="text-sm font-medium text-muted-foreground bg-background px-2 py-1 rounded border">Difficulty: Easy</span>
                </div>
                <CardTitle className="text-2xl leading-relaxed mt-2">
                  Which algorithmic pattern is best for solving "Two Sum" in O(n) time?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {options.map((option) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = option === correctAnswer;
                    const isWrongSelection = isSelected && !isCorrect;
                    
                    let buttonVariant: "default" | "outline" | "secondary" = "outline";
                    let buttonClass = "h-16 text-base justify-start px-6 font-medium transition-all hover:bg-muted";
                    
                    if (isSelected) {
                      if (isCorrect) {
                        buttonVariant = "default";
                        buttonClass = "h-16 text-base justify-start px-6 font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90";
                      } else {
                        buttonClass = "h-16 text-base justify-start px-6 font-medium transition-all border-accent border-2 bg-accent/5 text-foreground hover:bg-accent/10";
                      }
                    }

                    return (
                      <Button
                        key={option}
                        variant={buttonVariant}
                        className={buttonClass}
                        onClick={() => setSelectedOption(option)}
                        disabled={selectedOption === correctAnswer} // Disable after finding correct answer
                      >
                        {option}
                      </Button>
                    );
                  })}
                </div>

                {/* Feedback State */}
                {selectedOption && (
                  <div className={`mt-6 p-4 rounded-lg border flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300 ${
                    selectedOption === correctAnswer 
                      ? "bg-primary/10 border-primary/20 text-primary" 
                      : "bg-accent/10 border-accent/30 text-foreground"
                  }`}>
                    {selectedOption === correctAnswer ? (
                      <div className="font-semibold flex items-center gap-2">
                        🎉 Correct! A Hash Map allows us to look up the complement in O(1) time.
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="font-bold text-[hsl(var(--accent))] mix-blend-multiply dark:mix-blend-normal mb-1">Not quite!</span>
                        <span className="text-muted-foreground font-medium">
                          Hint: We need a way to look up previously seen numbers in O(1) time.
                        </span>
                      </div>
                    )}
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
