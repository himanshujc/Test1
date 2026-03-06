
"use client";

import { X, ExternalLink } from "lucide-react";
import { useState } from "react";

export function AdBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative mx-4 my-2 p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-between overflow-hidden group">
      <div className="flex flex-col gap-1 pr-8">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-white bg-gray-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">Ads</span>
          <span className="text-[10px] text-muted-foreground font-medium">Google AdSense</span>
        </div>
        <h3 className="text-sm font-bold text-foreground">Save 15% on Car Insurance</h3>
        <p className="text-[11px] text-muted-foreground line-clamp-1">Compare quotes from top providers and save money today.</p>
      </div>
      
      <div className="shrink-0">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg group-hover:bg-primary/90 transition-colors">
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>

      <button 
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 p-1 text-muted-foreground hover:bg-muted rounded-full transition-colors"
        aria-label="Close ad"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
