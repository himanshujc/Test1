"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send } from "lucide-react";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    const subject = encodeURIComponent("PocketTrack App Feedback");
    const body = encodeURIComponent(feedback);
    const mailtoUrl = `mailto:himanshu.chhatbar@gmail.com?subject=${subject}&body=${body}`;
    
    // Using window.location.href to trigger the default mail client
    window.location.href = mailtoUrl;
    
    setFeedback("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-2">
            <MessageSquare className="w-6 h-6" />
            <DialogTitle className="text-xl font-headline font-bold">Share Your Feedback</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Help us improve PocketTrack! Your suggestions, bug reports, and general feedback are invaluable for making this the best daily expense tracker.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="feedback-message">Your Message</Label>
            <Textarea 
              id="feedback-message" 
              placeholder="How can we improve PocketTrack?" 
              className="min-h-[150px] resize-none"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" className="w-full gap-2 h-12 text-lg font-headline">
              <Send className="w-4 h-4" />
              Send via Email
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
