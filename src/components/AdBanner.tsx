
"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { AdSenseUnit } from "./AdSenseUnit";

export function AdBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative mx-4 my-2 p-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden group">
      <div className="flex items-center justify-between px-3 py-1 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-white bg-gray-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">Ads</span>
          <span className="text-[10px] text-muted-foreground font-medium">Google AdSense</span>
        </div>
        <button 
          onClick={() => setVisible(false)}
          className="p-1 text-muted-foreground hover:bg-muted rounded-full transition-colors"
          aria-label="Close ad"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      
      <div className="p-2">
        {/* Your official AdSense Ad Unit */}
        <AdSenseUnit slot="3927802258" />
      </div>
    </div>
  );
}
