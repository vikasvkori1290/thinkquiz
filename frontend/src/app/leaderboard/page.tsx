import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BrainCircuit, Trophy, Medal, Star } from "lucide-react";
import { CommandMenu } from "@/components/command-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  
  // 1. Fetch user (just for top navbar avatar, optional for leaderboard but good for consistent navbar)
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Fetch Top 10 Users by XP
  const { data: topUsers } = await supabase
    .from('user_stats')
    .select('user_id, current_xp, level, username, first_name')
    .order('current_xp', { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 max-w-6xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">ThinkQuiz</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/quiz" className="text-sm font-medium hover:text-primary transition-colors">
              Play Quiz
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
              Profile
            </Link>
            {user && (
              <Link href="/dashboard" passHref>
                <Avatar className="border-2 border-border h-9 w-9 cursor-pointer hover:border-primary transition-colors ml-2">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {user.email?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
            <CommandMenu />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 pt-12 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Global Leaderboard</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The top 10 most dedicated scholars on ThinkQuiz. Compete in daily quizzes to earn XP, rank up, and cement your legacy.
          </p>
        </div>

        <Card className="w-full bg-card/60 backdrop-blur-md border-border/50 shadow-xl overflow-hidden">
          <div className="bg-muted/30 border-b border-border/50 px-6 py-4 flex items-center text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="w-16 text-center">Rank</div>
            <div className="flex-1 px-4">Scholar</div>
            <div className="w-24 text-center">Level</div>
            <div className="w-32 text-right">Total XP</div>
          </div>
          
          <div className="divide-y divide-border/50">
            {topUsers && topUsers.length > 0 ? (
              topUsers.map((stat, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;
                
                // Styling for Top 3
                let rankColor = "text-muted-foreground";
                let rowBg = "hover:bg-muted/30 transition-colors";
                let Icon = Star;
                
                if (rank === 1) {
                  rankColor = "text-[#fbcc45] drop-shadow-[0_0_8px_rgba(251,204,69,0.5)]";
                  rowBg = "bg-[#fbcc45]/5 hover:bg-[#fbcc45]/10 border-l-4 border-l-[#fbcc45] transition-colors";
                  Icon = Trophy;
                } else if (rank === 2) {
                  rankColor = "text-[#C0C0C0] drop-shadow-[0_0_8px_rgba(192,192,192,0.4)]";
                  rowBg = "bg-[#C0C0C0]/5 hover:bg-[#C0C0C0]/10 border-l-4 border-l-[#C0C0C0] transition-colors";
                  Icon = Medal;
                } else if (rank === 3) {
                  rankColor = "text-[#CD7F32] drop-shadow-[0_0_8px_rgba(205,127,50,0.4)]";
                  rowBg = "bg-[#CD7F32]/5 hover:bg-[#CD7F32]/10 border-l-4 border-l-[#CD7F32] transition-colors";
                  Icon = Medal;
                }

                // Generate a consistent pseudo-username using the first 5 chars of UUID
                const shortId = stat.user_id.substring(0, 5).toUpperCase();
                
                // Prioritize username, then first_name, then fallback to Scholar #ID
                let displayName = `Scholar #${shortId}`;
                let initials = shortId.substring(0, 2);
                
                if (stat.username) {
                  displayName = `@${stat.username}`;
                  initials = stat.username.substring(0, 2).toUpperCase();
                } else if (stat.first_name) {
                  displayName = stat.first_name;
                  initials = stat.first_name.substring(0, 2).toUpperCase();
                }

                return (
                  <div key={stat.user_id} className={`flex items-center px-6 py-4 ${rowBg}`}>
                    <div className={`w-16 text-center flex justify-center font-bold text-lg ${rankColor}`}>
                      {isTop3 ? <Icon className="w-7 h-7" /> : <span className="text-xl">#{rank}</span>}
                    </div>
                    
                    <div className="flex-1 px-4 flex items-center gap-3">
                      <Avatar className={`h-10 w-10 border ${isTop3 ? 'border-background shadow-md' : 'border-border'}`}>
                        <AvatarFallback className={`${rank === 1 ? 'bg-[#fbcc45]/20 text-[#fbcc45]' : rank === 2 ? 'bg-[#C0C0C0]/20 text-[#C0C0C0]' : rank === 3 ? 'bg-[#CD7F32]/20 text-[#CD7F32]' : 'bg-primary/10 text-primary'} font-semibold`}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`font-semibold ${isTop3 ? 'text-foreground text-lg' : 'text-foreground/90'}`}>
                        {displayName}
                      </span>
                      {user && user.id === stat.user_id && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                          You
                        </span>
                      )}
                    </div>
                    
                    <div className="w-24 text-center font-medium text-muted-foreground">
                      Lv. {stat.level}
                    </div>
                    
                    <div className={`w-32 text-right font-bold text-xl ${isTop3 ? rankColor : 'text-[hsl(var(--accent))] mix-blend-multiply dark:mix-blend-normal'}`}>
                      {stat.current_xp.toLocaleString()}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                No users found on the leaderboard yet. Be the first to play!
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
