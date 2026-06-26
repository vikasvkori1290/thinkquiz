import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/50 backdrop-blur-md">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="flex flex-col items-start col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity mb-4">
              <BrainCircuit className="h-8 w-8 text-primary" />
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Master System Design and LeetCode through AI-guided Socratic quizzes, not just code dumps.
            </p>
            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                Twitter
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                GitHub
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                LinkedIn
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">LeetCode Mode</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">System Design Mode</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Interview Guides</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">System Design Crash Course</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Community Discord</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} ThinkQuiz. All rights reserved.</p>
          <p className="flex items-center">
            Built with <span className="text-red-500 mx-1">❤</span> for developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
