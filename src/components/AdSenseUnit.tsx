
"use client";

import { useEffect } from "react";

interface AdSenseUnitProps {
  slot: string;
}

/**
 * A reusable component for rendering Google AdSense Ad Units.
 * It handles the initialization of the adsbygoogle array.
 */
export function AdSenseUnit({ slot }: AdSenseUnitProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Fail silently if AdBlock is active or script hasn't loaded
    }
  }, []);

  return (
    <div className="w-full min-h-[100px] overflow-hidden">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7525000535202715"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
