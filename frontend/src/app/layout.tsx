import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ThinkQuiz",
  description: "Socratic AI Learning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background text-foreground antialiased")}>
        {children}
      </body>
    </html>
  );
}
