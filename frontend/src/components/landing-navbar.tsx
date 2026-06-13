"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface LandingNavbarProps {
  user: any;
}

export function LandingNavbar({ user }: LandingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 w-full z-50 transition-[padding] duration-500 ease-in-out ${isScrolled ? "p-4" : "p-0"}`}>
      <header 
        className={`mx-auto transition-all duration-500 ease-in-out ${
          isScrolled 
            ? "max-w-4xl rounded-full border bg-background/80 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-white/5" 
            : "max-w-full border-b bg-background/95 backdrop-blur"
        } supports-[backdrop-filter]:bg-background/60`}
      >
        <div className={`container flex h-16 items-center justify-between transition-all duration-500 ease-in-out ${isScrolled ? "px-6" : "px-4"} max-w-6xl mx-auto w-full`}>
          {/* Logo */}
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">ThinkQuiz</span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Link href="/quiz" passHref className="text-sm font-medium hover:text-primary transition-colors">
              Quiz
            </Link>
            <Link href="/leaderboard" passHref className="text-sm font-medium hover:text-primary transition-colors">
              Leaderboard
            </Link>
            <CommandMenu />
            <ThemeToggle />
            
            {user ? (
              <Link href="/dashboard" passHref>
                <Avatar className="border-2 border-border h-9 w-9 hover:opacity-80 transition-opacity cursor-pointer">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {user.email?.substring(0, 2).toUpperCase() || "VK"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button className="hidden sm:flex font-medium">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
