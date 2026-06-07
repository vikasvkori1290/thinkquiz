import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Search, Trophy } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center md:py-32">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mb-6">
          Stop Copying. <span className="text-primary">Start Thinking.</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10">
          Master LeetCode and System Design through AI-guided Socratic quizzes, not just code dumps.
        </p>
        <Link href="/dashboard" passHref>
          <Button size="lg" className="text-lg px-8 py-6 h-auto font-semibold">
            Start Learning for Free
          </Button>
        </Link>
      </section>

      {/* How it Works Section */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            How it Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <Card className="flex flex-col items-center text-center p-6 border-border hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl">Input a Problem</CardTitle>
              </CardHeader>
              <CardDescription className="text-base">
                Search for any LeetCode problem or software engineering concept you want to master.
              </CardDescription>
            </Card>

            {/* Card 2 */}
            <Card className="flex flex-col items-center text-center p-6 border-border hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-6">
                <BrainCircuit className="w-8 h-8 text-[hsl(var(--accent))] mix-blend-multiply dark:mix-blend-normal" style={{ color: "hsl(var(--accent-foreground))" }} />
              </div>
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl">Socratic Guidance</CardTitle>
              </CardHeader>
              <CardDescription className="text-base">
                Our AI generates targeted questions and hints to guide you to the solution without giving it away.
              </CardDescription>
            </Card>

            {/* Card 3 */}
            <Card className="flex flex-col items-center text-center p-6 border-border hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl">Gamified Growth</CardTitle>
              </CardHeader>
              <CardDescription className="text-base">
                Earn XP, maintain daily streaks, and track your progress as you level up your skills.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
