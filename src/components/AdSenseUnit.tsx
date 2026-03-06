
"use client";

import { useEffect } from "react";

interface AdSenseUnitProps {
  slot: string;
}

/**
 * A reusable component for rendering Google AdSense Ad Units.
 * It handles the initialization of the adsbygoogle array.
 * Includes defensive checks to prevent "All 'ins' elements already have ads" errors
 * which often occur due to React StrictMode or rapid navigation.
 */
export function AdSenseUnit({ slot }: AdSenseUnitProps) {
  useEffect(() => {
    const pushAd = () => {
      try {
        if (typeof window !== "undefined" && (window as any).adsbygoogle) {
          // Find all ad elements that haven't been processed by Google yet
          // Google adds data-adsbygoogle-status="done" once an ad is filled.
          const unprocessedAds = document.querySelectorAll(
            'ins.adsbygoogle:not([data-adsbygoogle-status="done"])'
          );
          
          // Only push if there's actually an available slot to fill.
          // This prevents the "All 'ins' elements... already have ads" error.
          if (unprocessedAds.length > 0) {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          }
        }
      } catch (e) {
        // Fail silently if AdBlock is active or script hasn't loaded
      }
    };

    // Use a small timeout to let the DOM settle and to mitigate StrictMode double-execution in dev
    const timer = setTimeout(pushAd, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-[100px] overflow-hidden flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-7525000535202715"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
