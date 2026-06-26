import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ThinkQuiz | The Ultimate Coding Interview Platform",
  description: "Master LeetCode and System Design through AI-guided Socratic quizzes, not just code dumps. Level up your engineering skills today.",
  openGraph: {
    title: "ThinkQuiz | The Ultimate Coding Interview Platform",
    description: "Master LeetCode and System Design through AI-guided Socratic quizzes. Level up your engineering skills today.",
    url: "https://thinkquiz.com",
    siteName: "ThinkQuiz",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ThinkQuiz Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ThinkQuiz",
  },
};

export const viewport: Viewport = {
  themeColor: "#eab308",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background text-foreground antialiased overflow-x-hidden")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
