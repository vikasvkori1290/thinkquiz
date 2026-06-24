"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, BrainCircuit } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      setShowVerificationMessage(true);
      setLoading(false);
    }
  };

  const handleResendLink = async () => {
    setResendLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Verification link resent! Please check your inbox and spam folder.");
    }
    setResendLoading(false);
  };

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {showVerificationMessage 
              ? "Check your email" 
              : isSignUpMode 
                ? "Create an Account" 
                : "Welcome back"}
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {showVerificationMessage 
              ? `We sent a verification link to ${email}`
              : isSignUpMode
                ? "Enter your email below to create your account"
                : "Sign in to your ThinkQuiz account"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showVerificationMessage ? (
            <>
              <div className="space-y-2">
                <Input 
                  type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
                {!isSignUpMode && (
                  <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-center space-y-3">
              <p className="text-foreground font-medium">
                Verify your account by clicking the link sent to your email.
              </p>
              <p className="text-sm text-muted-foreground">
                You can close this window. Once verified, simply sign in!
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-4">
          {!showVerificationMessage ? (
            <>
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
                {isSignUpMode ? "Already have an account? Sign in" : "Need an account? Sign up"}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="default" 
                className="w-full h-12 font-semibold"
                onClick={handleResendLink}
                disabled={resendLoading}
              >
                {resendLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                Resend Verification Link
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12 font-semibold border-border mt-2"
                onClick={() => {
                  setShowVerificationMessage(false);
                  setIsSignUpMode(false);
                }}
              >
                Return to Sign In
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
