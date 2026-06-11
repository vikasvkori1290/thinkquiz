import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-primary/10 rounded-full blur-[100px] absolute opacity-50"></div>
      </div>

      <div className="z-10 flex flex-col items-center text-center max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="relative mb-8">
          <BrainCircuit className="w-24 h-24 text-primary/80 animate-pulse" />
          <SearchX className="w-10 h-10 text-destructive absolute -bottom-2 -right-2" />
        </div>
        
        <h1 className="text-6xl font-extrabold tracking-tight mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4 tracking-tight">Out of Bounds</h2>
        <p className="text-muted-foreground mb-8 text-lg">
          It looks like you've wandered out of bounds. The page you are looking for doesn't exist or has been moved.
        </p>
        
        <Link href="/dashboard" passHref>
          <Button size="lg" className="font-semibold px-8 h-12 text-lg shadow-md hover:scale-105 transition-transform duration-200">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
