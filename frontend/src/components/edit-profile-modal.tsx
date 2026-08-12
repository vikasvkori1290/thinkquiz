"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit3, Loader2 } from "lucide-react";
import { apiFetch } from "@/utils/auth";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

interface EditProfileModalProps {
  userEmail: string;
  userId: string;
  initialStats: any;
}

export function EditProfileModal({ userEmail, userId, initialStats }: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    first_name: initialStats?.first_name || "",
    last_name: initialStats?.last_name || "",
    username: initialStats?.username || "",
    mobile_number: initialStats?.mobile_number || "",
    linkedin_url: initialStats?.linkedin_url || "",
    github_url: initialStats?.github_url || "",
    leetcode_url: initialStats?.leetcode_url || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await apiFetch("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to update profile.");
      }

      toast({
        title: "Profile Updated",
        description: "Your profile details have been saved successfully to MongoDB.",
      });

      setIsOpen(false);
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 px-4 font-medium border-border/50 hover:bg-muted/50 hover:border-primary/50 transition-colors">
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-md border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Edit Profile</DialogTitle>
          <DialogDescription>
            Update your account details stored securely in MongoDB.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
              <Input id="email" value={userEmail} disabled className="bg-muted/50 opacity-80" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Doe" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile_number">Mobile Number</Label>
                <Input id="mobile_number" name="mobile_number" value={formData.mobile_number} onChange={handleChange} placeholder="+1 (555) 000-0000" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border/50">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="font-semibold shadow-md px-6">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
