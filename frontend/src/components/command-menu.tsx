"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BrainCircuit,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  Trophy,
  Settings,
  Search,
  Home,
  History
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { createClient } from "@/utils/supabase/client";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();
  const supabase = createClient();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button 
        className="flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
        onClick={() => setOpen(true)}
        title="Command Menu (⌘K)"
      >
        <Search className="h-5 w-5" />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/quiz"))}>
              <BrainCircuit className="mr-2 h-4 w-4" />
              <span>Play Quiz</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/leaderboard"))}>
              <Trophy className="mr-2 h-4 w-4" />
              <span>Leaderboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/history"))}>
              <History className="mr-2 h-4 w-4" />
              <span>History</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings & Actions">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light Theme</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark Theme</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>System Theme</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(async () => {
              try {
                await supabase.auth.signOut();
              } catch (e) {
                console.error("Error signing out:", e);
              } finally {
                router.push("/login");
                router.refresh();
              }
            })}>
              <LogOut className="mr-2 h-4 w-4 text-destructive" />
              <span className="text-destructive">Log Out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
