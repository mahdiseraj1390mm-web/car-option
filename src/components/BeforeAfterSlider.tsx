"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "قبل از نصب (فابریک)",
  afterLabel = "بعد از نصب (تجهیز آپشنال)",
}: {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(position);
    },
    []
  );

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative w-full h-[360px] sm:h-[480px] rounded-3xl overflow-hidden select-none cursor-ew-resize border border-slate-200 dark:border-slate-800 shadow-2xl"
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt="After Installation"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 text-xs font-black backdrop-blur-sm">
        {afterLabel}
      </div>

      {/* Before Image (Foreground with Clip) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Before Installation"
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%" }}
        />
        <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-slate-900/90 text-white text-xs font-black backdrop-blur-sm">
          {beforeLabel}
        </div>
      </div>

      {/* Divider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_15px_rgba(212,175,55,0.8)] z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-slate-950 border-2 border-amber-500 flex items-center justify-center text-amber-500 shadow-xl">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
