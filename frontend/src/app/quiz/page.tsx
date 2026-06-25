import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { QuizClient } from "./quiz-client";

export default async function QuizPage(props: { searchParams: Promise<{ topic?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  
  // 1. Fetch authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // If no user is logged in, securely redirect to login
  if (authError || !user) {
    redirect("/login");
  }

  // Anti-Farming Security: Check if they are trying to replay a completed quiz via URL
  if (searchParams.topic) {
    const today = new Date().toISOString().split('T')[0];
    const { data: recentAttempt } = await supabase
      .from('quiz_attempts')
      .select('id, completed_at')
      .eq('user_id', user.id)
      .eq('problem_slug', searchParams.topic)
      .gte('completed_at', today)
      .limit(1)
      .single();
      
    if (recentAttempt) {
      redirect("/dashboard");
    }
  }

  // 2. Fetch user's live stats from `user_stats` table
  let userStats = { current_xp: 0, current_level: 1, current_streak: 0 };
  
  const { data: statsData, error: statsError } = await supabase
    .from('user_stats')
    .select('current_xp, current_level, current_streak')
    .eq('user_id', user.id)
    .single();

  if (statsData) {
    userStats = statsData;
  }

  // 3. Fetch all topics completed today to block search
  const today = new Date().toISOString().split('T')[0];
  const { data: todayAttempts } = await supabase
    .from('quiz_attempts')
    .select('problem_slug')
    .eq('user_id', user.id)
    .gte('completed_at', today);
    
  const completedTodaySlugs = todayAttempts?.map(a => a.problem_slug) || [];

  // 4. Hydrate the client component with real data
  return <QuizClient user={user} initialStats={userStats} completedTodaySlugs={completedTodaySlugs} />;
}
