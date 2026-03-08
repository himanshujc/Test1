
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, EyeOff, Database, ServerCrash } from "lucide-react";

interface PrivacyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyDialog({ open, onOpenChange }: PrivacyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-2">
            <ShieldCheck className="w-6 h-6" />
            <DialogTitle className="text-xl font-headline font-bold">Privacy Center</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <Lock className="w-4 h-4" />
              <h4>Zero-Server Policy</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              PocketTrack operates on a "Local First" principle. Your financial data is stored exclusively on your device's local storage. We do not transmit, store, or see your transactions on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <EyeOff className="w-4 h-4" />
              <h4>No Third-Party Data Sharing</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Because we don't collect your transaction data, we have nothing to sell or share with third parties. Your privacy is protected by design, not just by promise.
            </p>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <Database className="w-4 h-4" />
              <h4>Data Ownership</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You own 100% of your data. You can export your expenses to CSV at any time or choose to clear all data from your device through the Settings menu.
            </p>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <ServerCrash className="w-4 h-4" />
              <h4>Analytics & Ads</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use Google AdSense to support the app. AdSense may use cookies to serve personalized ads based on your web browsing history (not your data in this app). You can manage your ad preferences through Google's Ad Settings.
            </p>
          </section>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-[10px] text-muted-foreground text-center italic">
              Last Updated: May 2024. PocketTrack is committed to maintaining the highest standards of financial privacy for our users.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
