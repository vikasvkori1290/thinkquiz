"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

interface NavbarProps {
  user?: any;
  children?: React.ReactNode;
}

export function Navbar({ user, children }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <BrainCircuit className="h-8 w-8 text-primary" />
          </Link>

          {/* Center Section (Injected via children) */}
          {children && (
            <div className="hidden md:flex items-center gap-6 flex-1 justify-center max-w-md">
              {children}
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Links */}
            <Link href="/history" passHref className="text-sm font-medium hover:text-primary transition-colors hidden md:block">
              History
            </Link>
            <Link href="/quiz" passHref className="text-sm font-medium hover:text-primary transition-colors hidden md:block">
              Quiz
            </Link>
            <Link href="/leaderboard" passHref className="text-sm font-medium hover:text-primary transition-colors hidden md:block">
              Leaderboard
            </Link>

            {/* Interactive Icons */}
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
              <Link href="/login" passHref>
                <Button className="hidden sm:flex font-medium">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden flex items-center">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                  <SheetTitle className="text-left mb-6 font-bold text-xl flex items-center gap-2">
                    <BrainCircuit className="h-8 w-8 text-primary" />
                  </SheetTitle>
                  <div className="flex flex-col gap-6">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-base font-medium hover:text-primary transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/quiz" onClick={() => setIsOpen(false)} className="text-base font-medium hover:text-primary transition-colors">
                      Play Quiz
                    </Link>
                    <Link href="/history" onClick={() => setIsOpen(false)} className="text-base font-medium hover:text-primary transition-colors">
                      History
                    </Link>
                    <Link href="/leaderboard" onClick={() => setIsOpen(false)} className="text-base font-medium hover:text-primary transition-colors">
                      Leaderboard
                    </Link>
                    {!user && (
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button className="w-full mt-4 font-medium">
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
