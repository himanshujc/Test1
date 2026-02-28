
"use client";

import { X } from "lucide-react";
import { useState } from "react";

export function AdBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative mx-4 my-2 p-3 bg-white border border-dashed border-gray-300 rounded-lg flex items-center justify-between text-[10px] text-gray-400 font-mono tracking-tighter overflow-hidden">
      <div className="flex flex-col">
        <span className="bg-gray-100 px-1 rounded inline-block w-fit mb-1">SPONSORED</span>
        <span className="text-gray-600 font-sans text-sm font-medium">Get 5% back on groceries today!</span>
      </div>
      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-sans text-xs font-bold">
        Learn More
      </div>
      <button 
        onClick={() => setVisible(false)}
        className="absolute top-1 right-1 p-0.5 hover:bg-gray-100 rounded-full"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
