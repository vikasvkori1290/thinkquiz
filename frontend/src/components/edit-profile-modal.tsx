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
import { createClient } from "@/utils/supabase/client";
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
  const supabase = createClient();
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
      // 1. Check if all required gamification fields are filled
      const allFieldsFilled = 
        formData.first_name.trim() !== "" &&
        formData.last_name.trim() !== "" &&
        formData.username.trim() !== "" &&
        formData.mobile_number.trim() !== "" &&
        formData.linkedin_url.trim() !== "" &&
        formData.github_url.trim() !== "" &&
        formData.leetcode_url.trim() !== "";

      const hasBonusBeenAwarded = initialStats?.profile_bonus_awarded === true;
      const willAwardBonus = allFieldsFilled && !hasBonusBeenAwarded;

      // 2. Prepare payload
      let newXp = initialStats?.current_xp || 0;
      let newLevel = initialStats?.level || 1;
      
      if (willAwardBonus) {
        newXp += 10;
        newLevel = Math.floor(newXp / 100) + 1;
      }

      const payload = {
        ...formData,
        current_xp: newXp,
        level: newLevel,
        profile_bonus_awarded: willAwardBonus ? true : initialStats?.profile_bonus_awarded || false,
      };

      // 3. Update Database
      const { error } = await supabase
        .from('user_stats')
        .update(payload)
        .eq('user_id', userId);

      if (error) throw error;

      // 4. Update parent state
      router.refresh();

      // 5. Trigger gamification logic
      if (willAwardBonus) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        toast({
          title: "🎉 Profile Complete!",
          description: "You've earned +10 XP for fully completing your profile!",
          className: "bg-primary text-primary-foreground border-none",
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile details have been saved successfully.",
        });
      }

      setIsOpen(false);
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
            Complete your profile to unlock a <strong className="text-[hsl(var(--accent))] mix-blend-multiply dark:mix-blend-normal drop-shadow-sm">+10 XP Gamification Bonus</strong>!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          
          <div className="space-y-4">
            {/* Read-only Email */}
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

            <div className="space-y-2 pt-2 border-t border-border/50">
              <Label className="text-primary font-semibold tracking-wider text-xs uppercase">Social Links</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input id="linkedin_url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/in/johndoe" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input id="github_url" name="github_url" value={formData.github_url} onChange={handleChange} placeholder="https://github.com/johndoe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leetcode_url">LeetCode URL</Label>
              <Input id="leetcode_url" name="leetcode_url" value={formData.leetcode_url} onChange={handleChange} placeholder="https://leetcode.com/u/johndoe" />
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
