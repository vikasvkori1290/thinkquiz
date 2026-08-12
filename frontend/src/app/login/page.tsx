"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser, registerUser } from "@/utils/auth";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, BrainCircuit, Home } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  const getNextPath = () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("next") || "/dashboard";
    }
    return "/dashboard";
  };

  const handleSignIn = async () => {
    setLoading(true);
    setAuthError("");
    try {
      await loginUser(email, password);
      window.location.href = getNextPath();
    } catch (error: any) {
      setAuthError(error.message || "Failed to sign in");
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setAuthError("");
    try {
      await registerUser(email, password, username);
      window.location.href = getNextPath();
    } catch (error: any) {
      setAuthError(error.message || "Failed to register");
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setEmail("");
    setPassword("");
    setUsername("");
    setAuthError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-background/50 backdrop-blur-sm p-2 rounded-md"
      >
        <Home className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {isSignUpMode ? "Create an Account" : "Welcome back"}
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {isSignUpMode
              ? "Enter your details below to create your account"
              : "Sign in to your ThinkQuiz account"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSignUpMode && (
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Username (optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12"
                disabled={loading}
              />
            </div>
          )}
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
              disabled={loading}
            />
            {!isSignUpMode && (
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-4">
          {isSignUpMode ? (
            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={handleSignUp}
              disabled={loading || !email || !password}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              Create Account
            </Button>
          ) : (
            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={handleSignIn}
              disabled={loading || !email || !password}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              Sign In
            </Button>
          )}

          {authError && (
            <div className="text-sm font-medium text-destructive text-center mt-2">
              {authError}
            </div>
          )}

          <div className="relative my-2 w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-12 border-border"
            onClick={toggleMode}
            disabled={loading}
          >
            {isSignUpMode
              ? "Already have an account? Sign in"
              : "Need an account? Sign up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
