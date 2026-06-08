"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, BrainCircuit } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
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
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      setShowOtpInput(true);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'signup' });
    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
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
            {showOtpInput ? "Verify your email" : "Welcome back"}
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {showOtpInput 
              ? `We sent a 6-digit code to ${email}`
              : "Sign in to your ThinkQuiz account"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showOtpInput ? (
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
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Input 
                type="text" 
                placeholder="6-digit code" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="h-12 text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-4">
          {!showOtpInput ? (
            <>
              <Button 
                className="w-full h-12 text-base font-semibold" 
                onClick={handleSignIn}
                disabled={loading || !email || !password}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                Sign In
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12 text-base font-medium" 
                onClick={handleSignUp}
                disabled={loading || !email || !password}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                Create an Account
              </Button>
            </>
          ) : (
            <Button 
              className="w-full h-12 text-base font-semibold" 
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 6}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              Verify Code
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
