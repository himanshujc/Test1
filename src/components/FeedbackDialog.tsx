"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send } from "lucide-react";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const subject = encodeURIComponent("PocketTrack Support Request");
    const body = encodeURIComponent(message);
    const mailtoUrl = `mailto:himanshu.chhatbar@gmail.com?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoUrl;
    
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-2">
            <Mail className="w-6 h-6" />
            <DialogTitle className="text-xl font-headline font-bold">Email Support</DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Need help with PocketTrack? Send us a message and we'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="support-message">How can we help you?</Label>
            <Textarea 
              id="support-message" 
              placeholder="Describe your issue or question here..." 
              className="min-h-[150px] resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" className="w-full gap-2 h-12 text-lg font-headline">
              <Send className="w-4 h-4" />
              Open Email Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
