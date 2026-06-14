import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Flame, BrainCircuit, Trophy, CheckCircle2 } from "lucide-react";
import { ThemeInput } from "react-activity-calendar";
import { format, subDays, formatDistanceToNow } from "date-fns";
import { ActivityGraphClient } from "./ActivityGraphClient";
import { AnalyticsChart } from "@/components/analytics-chart";
import { EditProfileModal } from "@/components/edit-profile-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // 1. Fetch user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 2. Fetch User Stats
  let userStats: any = { current_xp: 0, current_level: 1, current_streak: 0 };
  const { data: statsData } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (statsData) {
    userStats = statsData;
  }

  // 3. Fetch Quiz Attempts History
  const { data: quizAttempts } = await supabase
    .from('quiz_attempts')
    .select('completed_at, problem_slug, score')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false });

  const totalQuizzes = quizAttempts?.length || 0;

  // 4. Process Data for Analytics Chart (Cumulative XP over last 30 days)
  const today = new Date();
  
  // Sort attempts chronologically
  const chronologicalAttempts = quizAttempts ? [...quizAttempts].sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()) : [];

  let runningTotal = 0;
  const runningTotalByDate: Record<string, number> = {}; 

  chronologicalAttempts.forEach(attempt => {
    const xpEarned = attempt.score * 10;
    runningTotal += xpEarned;
    const dateStr = attempt.completed_at.substring(0, 10); // 'yyyy-MM-dd'
    runningTotalByDate[dateStr] = runningTotal;
  });

  let currentRunningTotal = 0;
  const thirtyDaysAgoStr = format(subDays(today, 29), 'yyyy-MM-dd');
  
  // Get baseline XP before the 30-day window
  Object.keys(runningTotalByDate).sort().forEach(dateStr => {
    if (dateStr < thirtyDaysAgoStr) {
      currentRunningTotal = runningTotalByDate[dateStr];
    }
  });

  const chartData = [];
  for (let i = 29; i >= 0; i--) {
    const d = subDays(today, i);
    const dateKey = format(d, 'yyyy-MM-dd');
    const displayDate = format(d, 'MMM dd');
    
    if (runningTotalByDate[dateKey] !== undefined) {
      currentRunningTotal = runningTotalByDate[dateKey];
    }
    
    chartData.push({
      date: displayDate,
      totalXp: currentRunningTotal
    });
  }

  // 5. Process Data for Activity Calendar
  const activityMap: Record<string, number> = {};
  for (let i = 0; i < 365; i++) {
    const d = subDays(today, i);
    activityMap[format(d, 'yyyy-MM-dd')] = 0;
  }

  if (quizAttempts) {
    quizAttempts.forEach((attempt) => {
      const dateStr = attempt.completed_at.substring(0, 10);
      if (activityMap[dateStr] !== undefined) {
        activityMap[dateStr] += 1;
      } else {
        activityMap[dateStr] = 1;
      }
    });
  }

  const calendarData = Object.entries(activityMap)
    .map(([date, count]) => {
      let level = 0;
      if (count === 1) level = 1;
      else if (count >= 2 && count <= 3) level = 2;
      else if (count >= 4 && count <= 6) level = 3;
      else if (count > 6) level = 4;
      return { date, count, level: level as 0 | 1 | 2 | 3 | 4 };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const explicitTheme: ThemeInput = {
    light: ['#f0f0f0', '#fceeb5', '#f3d371', '#e4b335', '#b2800d'],
    dark:  ['#222222', '#524317', '#8a7122', '#ceaa3b', '#fbcc45'],
  };

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
            <Link href="/history" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
              History
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
              Leaderboard
            </Link>
            <Link href="/quiz" className="hidden sm:flex items-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors">
              Play Quiz
            </Link>
            <CommandMenu />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 pt-12 max-w-6xl mx-auto w-full">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 w-full mb-12 relative">
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
              {userStats?.first_name ? userStats.first_name.charAt(0).toUpperCase() : user.email?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {userStats?.first_name ? `${userStats.first_name} ${userStats.last_name || ''}` : user.email}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {userStats?.username ? `@${userStats.username} • ` : ''}Joined {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <EditProfileModal 
                userEmail={user.email || ""} 
                userId={user.id} 
                initialStats={userStats} 
              />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-sm hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total XP</CardTitle>
              <Trophy className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{userStats.current_xp}</div>
              <p className="text-xs text-muted-foreground mt-1">Level {userStats.current_level}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-sm hover:border-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Streak</CardTitle>
              <Flame className="h-5 w-5 text-[hsl(var(--accent))] mix-blend-multiply dark:mix-blend-normal" style={{ color: "hsl(var(--accent))" }} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{userStats.current_streak}</div>
              <p className="text-xs text-muted-foreground mt-1">Days in a row</p>
            </CardContent>
          </Card>

          <Card className="bg-card/40 backdrop-blur-md border-border/50 shadow-sm hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Quizzes Played</CardTitle>
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalQuizzes}</div>
              <p className="text-xs text-muted-foreground mt-1">Total lifetime attempts</p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Calendar */}
        <Card className="w-full bg-card/40 backdrop-blur-md border-border/50 shadow-sm mb-6 overflow-hidden">
          <CardHeader>
            <CardTitle>Activity Graph</CardTitle>
            <CardDescription>Your quiz completions over the last year</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6 md:p-8 overflow-x-auto">
            <div className="min-w-max">
              <ActivityGraphClient 
                data={calendarData} 
                theme={explicitTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* Activity Chart */}
        <div className="w-full mb-12">
          <AnalyticsChart data={chartData} />
        </div>

        {/* Recent Submissions */}
        <Card className="w-full bg-card/40 backdrop-blur-md border-border/50 shadow-sm mb-12 overflow-hidden">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Your latest quiz completions</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {quizAttempts && quizAttempts.length > 0 ? (
                quizAttempts.slice(0, 10).map((attempt, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-lg">{attempt.problem_slug}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">
                          {formatDistanceToNow(new Date(attempt.completed_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                      <span className="font-bold text-[hsl(var(--accent))] mix-blend-multiply dark:mix-blend-normal text-lg">
                        +{attempt.score * 10} XP
                      </span>
                      <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-sm">
                        Score: {attempt.score}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-lg font-medium text-foreground">No recent submissions found.</p>
                  <p className="text-muted-foreground mt-1">Play a quiz to start earning XP!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
