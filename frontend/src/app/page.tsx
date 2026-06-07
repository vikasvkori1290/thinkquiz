import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Design System Verification</h1>
        <p className="text-lg text-muted-foreground">
          Verifying the ThinkQuiz color palette and component library.
        </p>
      </div>

      <div className="flex items-center gap-4 border p-8 rounded-lg bg-card shadow-sm">
        {/* Primary Action Button (Blue) */}
        <Button variant="default" size="lg">
          Primary Action
        </Button>

        {/* Accent/Gamification Button (Yellow) */}
        <Button variant="outline" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 hover:text-accent-foreground border-transparent">
          Gamification Accent
        </Button>
      </div>
    </main>
  );
}
