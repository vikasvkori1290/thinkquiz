"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, BrainCircuit, KeyRound } from "lucide-react";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check if the user is actually in a recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setErrorMsg("Your password reset link is invalid or has expired. Please request a new one.");
      }
    };
    checkSession();
  }, [supabase.auth]);

  const handleUpdatePassword = async () => {
    setLoading(true);
    setErrorMsg("");
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      // Password updated successfully
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 bg-grid-pattern">
      <Card className="w-full max-w-md shadow-xl border-border/50 bg-card/40 backdrop-blur-md">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Update Password
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {errorMsg && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                {errorMsg}
              </div>
            )}
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="New Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-background/50"
                required
                minLength={6}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full h-12 text-base font-semibold" 
            onClick={handleUpdatePassword}
            disabled={loading || !password || password.length < 6}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            Update Password
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
