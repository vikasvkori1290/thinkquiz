import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrainCircuit, History, Calendar, Trophy, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ThemeToggle } from "@/components/theme-toggle";
import { Navbar } from "@/components/navbar";

export default async function HistoryPage() {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Navbar user={user} />

      <main className="flex-1 flex flex-col items-center p-4 md:px-6 pt-24 md:pt-32 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <History className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Quiz History</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Review your past attempts and track your learning progress over time.
          </p>
        </div>

        {attempts && attempts.length > 0 ? (
          <div className="w-full space-y-4">
            {attempts.map((attempt) => {
              const isPerfect = attempt.score === 3;
              const isGood = attempt.score === 2;
              
              return (
                <Card key={attempt.id} className="w-full bg-card/60 backdrop-blur-md border-border/50 shadow-sm hover:border-primary/50 transition-colors overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isPerfect ? 'bg-[#fbcc45]/10 border border-[#fbcc45]/30' : isGood ? 'bg-primary/10 border border-primary/20' : 'bg-muted border border-border'}`}>
                        {isPerfect ? (
                          <Trophy className="w-6 h-6 text-[#fbcc45]" />
                        ) : isGood ? (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        ) : (
                          <XCircle className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-xl text-foreground capitalize">
                          {attempt.problem_slug.replace(/-/g, ' ')}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(attempt.completed_at), "MMM d, yyyy 'at' h:mm a")}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-2">
                      <div className="text-2xl font-bold font-mono">
                        {attempt.score}/3
                      </div>
                      {isPerfect ? (
                        <Badge variant="default" className="bg-[#fbcc45] text-black hover:bg-[#fbcc45]/90 border-none font-bold">Flawless</Badge>
                      ) : isGood ? (
                        <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 font-bold border-none">Good Effort</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground border-border font-medium">Review Needed</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="w-full bg-card/40 backdrop-blur-md border-border/50 shadow-sm p-12 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <History className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No quizzes taken yet</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Your history is empty. Go play a Socratic quiz to start building your learning record and earning XP!
            </p>
            <Link href="/quiz" passHref>
              <Button size="lg" className="font-semibold text-base px-8 h-12">
                Play Your First Quiz
              </Button>
            </Link>
          </Card>
        )}
      </main>
    </div>
  );
}
