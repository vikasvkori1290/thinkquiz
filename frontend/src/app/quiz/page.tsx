import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { QuizClient } from "./quiz-client";

export default async function QuizPage() {
  const supabase = await createClient();
  
  // 1. Fetch authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // If no user is logged in, securely redirect to login
  if (authError || !user) {
    redirect("/login");
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

  // 3. Hydrate the client component with real data
  return <QuizClient user={user} initialStats={userStats} />;
}
