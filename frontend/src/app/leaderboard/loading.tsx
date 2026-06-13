import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Trophy, BrainCircuit } from "lucide-react";
import Link from "next/link";

export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2 opacity-50">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">ThinkQuiz</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-9 w-9 rounded-full ml-2" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 pt-12 max-w-4xl mx-auto w-full">
        {/* Title Area */}
        <div className="text-center mb-10 w-full flex flex-col items-center">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/10">
            <Trophy className="w-10 h-10 text-primary/40" />
          </div>
          <Skeleton className="h-12 w-64 mb-4 mx-auto" />
          <Skeleton className="h-6 w-full max-w-xl mx-auto mb-2" />
          <Skeleton className="h-6 w-3/4 max-w-lg mx-auto" />
        </div>

        {/* Leaderboard Card */}
        <Card className="w-full bg-card/60 backdrop-blur-md border-border/50 shadow-xl overflow-hidden">
          {/* Table Header */}
          <div className="bg-muted/30 border-b border-border/50 px-6 py-4 flex items-center text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="w-16 text-center">Rank</div>
            <div className="flex-1 px-4">Scholar</div>
            <div className="w-24 text-center">Level</div>
            <div className="w-32 text-right">Total XP</div>
          </div>
          
          {/* Table Rows (Skeletons) */}
          <div className="divide-y divide-border/50">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex items-center px-6 py-4">
                <div className="w-16 flex justify-center">
                  <Skeleton className="h-6 w-8" />
                </div>
                
                <div className="flex-1 px-4 flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>
                
                <div className="w-24 flex justify-center">
                  <Skeleton className="h-5 w-12" />
                </div>
                
                <div className="w-32 flex justify-end">
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
