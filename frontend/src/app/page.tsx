import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Search, Trophy, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-background bg-grid-pattern relative">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px] absolute top-[-100px] opacity-70 dark:opacity-40"></div>
      </div>

      {/* Top Navbar */}
      <Navbar user={user} />

      {/* Hero Section */}
      <main className="flex-1 relative z-10 pt-16">
        {/* Scrolling Banner */}
        <div className="w-full bg-primary/10 border-b border-primary/20 py-2 overflow-hidden flex whitespace-nowrap mb-4 backdrop-blur-sm">
          <div className="animate-marquee flex gap-8 items-center text-sm font-medium text-foreground">
            <span>🔥 NEW: Socratic AI mode is now in Beta! Master System Design with guided hints.</span>
            <span>⭐ Join 10,000+ developers leveling up their interview skills today.</span>
            <span>🚀 Weekly Leaderboard resets every Sunday - Compete for top spots!</span>
            {/* Duplicated for seamless loop */}
            <span aria-hidden="true">🔥 NEW: Socratic AI mode is now in Beta! Master System Design with guided hints.</span>
            <span aria-hidden="true">⭐ Join 10,000+ developers leveling up their interview skills today.</span>
            <span aria-hidden="true">🚀 Weekly Leaderboard resets every Sunday - Compete for top spots!</span>
          </div>
        </div>

        <section className="container mx-auto px-4 md:px-8 pt-4 pb-16 md:pt-12 md:pb-32 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left z-10">
            {/* Highlight Badge */}
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-6 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              The Ultimate Coding Interview Platform
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6">
              Stop Copying. <span className="text-primary block mt-2">Start Thinking.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-lg">
              Master LeetCode and System Design through AI-guided Socratic quizzes, not just code dumps.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <Link href="/quiz" passHref>
                <Button size="lg" className="text-lg px-8 py-6 h-auto font-semibold">
                  Start Learning for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column (Placeholder) */}
          <div className="relative w-full aspect-video lg:aspect-square max-h-[500px] rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm shadow-2xl flex items-center justify-center overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Dot grid pattern for placeholder */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

            <div className="z-10 flex flex-col items-center text-muted-foreground/60 text-center p-6 border border-dashed border-muted-foreground/20 rounded-xl m-8 bg-background/50 backdrop-blur-md">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BrainCircuit className="w-8 h-8 text-primary opacity-80" />
              </div>
              <p className="font-semibold text-lg text-foreground/80 mb-2">Interactive Demo Area</p>
              <p className="text-sm max-w-[250px]">
                This half of the screen is perfectly reserved for your future video or hover component.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <div className="border-y border-border/50 bg-muted/10 backdrop-blur-sm py-10 mb-16 relative z-10">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tighter">10K+</span>
                <span className="text-xs md:text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-2">Active Developers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tighter">500+</span>
                <span className="text-xs md:text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-2">LeetCode Patterns</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tighter">98%</span>
                <span className="text-xs md:text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-2">Interview Success</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tighter">24/7</span>
                <span className="text-xs md:text-sm text-muted-foreground font-semibold uppercase tracking-wider mt-2">Socratic AI Guide</span>
              </div>
            </div>
          </div>
        </div>

      {/* How it Works Section */}
      <section className="px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16 text-foreground tracking-tight">
            How it Works
          </h2>
          
          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 min-h-[500px]">
            
            {/* Bento Card 1: The Core Engine (Large Hero Card) */}
            <Card className="md:col-span-2 md:row-span-2 relative overflow-hidden group flex flex-col justify-end p-8 md:p-12 border-border/50 bg-card/40 backdrop-blur-md hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-primary/20">
              {/* Abstract Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>
              {/* Noise texture overlay */}
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
              
              {/* Massive faded icon */}
              <BrainCircuit className="absolute -top-10 -right-10 w-96 h-96 text-primary opacity-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-1000 ease-out pointer-events-none" />

              <div className="relative z-10 mt-32 md:mt-48">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 backdrop-blur-md border border-primary/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                  <BrainCircuit className="w-8 h-8 text-primary drop-shadow-md" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Socratic Guidance</h3>
                <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                  Our AI doesn't just give you the answer. It generates targeted, conversational hints that guide you to the solution organically, forcing you to think like a Senior Engineer.
                </p>
              </div>
            </Card>

            {/* Bento Card 2: Input a Problem (Top Right) */}
            <Card className="md:col-span-1 md:row-span-1 relative overflow-hidden group p-8 flex flex-col justify-between border-border/50 bg-card/40 backdrop-blur-md hover:border-primary/50 transition-all duration-500 shadow-md hover:-translate-y-1">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-2xl font-bold tracking-tight z-10 max-w-[120px]">Input a Problem</h3>
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center z-10 group-hover:bg-primary transition-colors duration-500 shrink-0">
                  <Search className="w-6 h-6 text-foreground group-hover:text-primary-foreground transition-colors duration-500" />
                </div>
              </div>
              <p className="text-muted-foreground z-10">
                Paste any LeetCode URL or System Design prompt to begin.
              </p>
              {/* Subtle background gradient */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500 pointer-events-none"></div>
            </Card>

            {/* Bento Card 3: Gamified Growth (Bottom Right) */}
            <Card className="md:col-span-1 md:row-span-1 relative overflow-hidden group p-8 flex flex-col justify-between border-border/50 bg-card/40 backdrop-blur-md hover:border-primary/50 transition-all duration-500 shadow-md hover:-translate-y-1">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-2xl font-bold tracking-tight z-10 max-w-[120px]">Gamified Growth</h3>
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center z-10 group-hover:bg-primary transition-colors duration-500 shrink-0">
                  <Trophy className="w-6 h-6 text-foreground group-hover:text-primary-foreground transition-colors duration-500" />
                </div>
              </div>
              <p className="text-muted-foreground z-10">
                Earn XP, maintain daily streaks, and watch your skills skyrocket.
              </p>
              {/* Subtle background gradient */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500 pointer-events-none"></div>
            </Card>

          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
