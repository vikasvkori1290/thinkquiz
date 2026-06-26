import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2 opacity-50">
            <BrainCircuit className="h-8 w-8 text-primary" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24 hidden sm:block" />
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 pt-12 max-w-6xl mx-auto w-full">
        {/* Profile Header Skeleton */}
        <div className="flex flex-col md:flex-row items-center gap-6 w-full mb-12 relative">
          <Skeleton className="h-24 w-24 rounded-full border-4 border-background shadow-xl" />
          <div className="text-center md:text-left flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
              <div className="flex flex-col items-center md:items-start w-full">
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>
          </div>
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card/40 backdrop-blur-md border-border/50 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity Calendar Skeleton */}
        <Card className="w-full bg-card/40 backdrop-blur-md border-border/50 shadow-sm mb-12 overflow-hidden">
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="flex justify-center p-6 md:p-8">
            <Skeleton className="w-full h-40 rounded-lg" />
          </CardContent>
        </Card>

        {/* Recent Submissions Skeleton */}
        <Card className="w-full bg-card/40 backdrop-blur-md border-border/50 shadow-sm mb-12 overflow-hidden">
          <CardHeader className="border-b bg-muted/20">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
