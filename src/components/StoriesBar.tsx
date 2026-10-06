"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Play, X, ExternalLink, ChevronRight, ChevronLeft } from "lucide-react";

export default function StoriesBar() {
  const [stories, setStories] = useState<any[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/admin/stories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setStories(data.data);
        } else {
          setStories([
            {
              id: "1",
              title: "تست شب دوربین ۳۶۰",
              mediaUrl: "/images/camera360.jpg",
              mediaType: "IMAGE",
              linkUrl: "/products",
            },
            {
              id: "2",
              title: "کروز کنترل دنا پلاس",
              mediaUrl: "/images/cruise.jpg",
              mediaType: "IMAGE",
              linkUrl: "/products",
            },
            {
              id: "3",
              title: "مانیتور ۱۲ اینچ تارا",
              mediaUrl: "/images/story-tara.jpg",
              mediaType: "IMAGE",
              linkUrl: "/products",
            },
            {
              id: "4",
              title: "کلاچ اتوماتیک هوشمند",
              mediaUrl: "/images/story-shahin.jpg",
              mediaType: "IMAGE",
              linkUrl: "/products",
            },
            {
              id: "5",
              title: "رادار نقطه کور توربو",
              mediaUrl: "/images/story-dena.jpg",
              mediaType: "IMAGE",
              linkUrl: "/products",
            },
            {
              id: "6",
              title: "تجهیز VIP خودرو",
              mediaUrl: "/images/story-vip.jpg",
              mediaType: "IMAGE",
              linkUrl: "/packages",
            },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const activeStory = activeStoryIndex !== null && stories[activeStoryIndex] ? stories[activeStoryIndex] : null;

  const handleNextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setProgress(0);
    } else {
      setActiveStoryIndex(null);
      setProgress(0);
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setProgress(0);
    }
  };

  // Auto-progress timer for active story
  useEffect(() => {
    if (activeStoryIndex === null) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const interval = 50; // update every 50ms
    const step = 100 / (5000 / interval); // 5 seconds per story

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextStory();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [activeStoryIndex, stories.length]);

  return (
    <>
      {/* Horizontal Story Bubbles */}
      <div className="w-full overflow-x-auto no-scrollbar py-3">
        <div className="flex items-center gap-3 sm:gap-4 px-1">
          {stories.map((story, idx) => (
            <button
              key={story.id || idx}
              type="button"
              onClick={() => {
                setActiveStoryIndex(idx);
                setProgress(0);
              }}
              className="flex flex-col items-center gap-1.5 sm:gap-2 group shrink-0 focus:outline-none w-16 sm:w-20"
            >
              {/* Outer Gradient Ring - Exactly 64px on mobile, 80px on desktop */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 group-hover:scale-105 active:scale-95 transition-transform duration-300 shadow-md shadow-amber-500/15 shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden p-0.5 bg-slate-950 flex items-center justify-center">
                  <img
                    src={story.mediaUrl}
                    alt={story.title}
                    className="w-full h-full object-cover rounded-full aspect-square group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-amber-500 transition-colors w-full truncate text-center block leading-tight px-0.5">
                {story.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Story Fullscreen Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fadeIn p-3 sm:p-4">
          <div className="relative w-full max-w-[360px] sm:max-w-sm h-[78vh] sm:h-[600px] max-h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex flex-col justify-between select-none">
            {/* Top Bar with Segments & Close Button */}
            <div className="relative z-20 p-3 sm:p-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent space-y-2.5">
              {/* Story Progress Indicators */}
              <div className="flex items-center gap-1.5 w-full">
                {stories.map((st, i) => (
                  <div
                    key={st.id || i}
                    className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden"
                  >
                    <div
                      className="h-full bg-amber-400 transition-all duration-75"
                      style={{
                        width:
                          i === activeStoryIndex
                            ? `${progress}%`
                            : i < (activeStoryIndex ?? 0)
                            ? "100%"
                            : "0%",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full p-0.5 bg-amber-500 overflow-hidden shrink-0">
                    <img
                      src={activeStory.mediaUrl}
                      alt={activeStory.title}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[190px]">
                    {activeStory.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStoryIndex(null)}
                  className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 active:scale-90 transition-all"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Media Content */}
            <div className="absolute inset-0 w-full h-full z-0">
              {activeStory.mediaType === "VIDEO" ? (
                <video
                  src={activeStory.mediaUrl}
                  autoPlay
                  loop
                  playsInline
                  controls={false}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeStory.mediaUrl}
                  alt={activeStory.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Tap Navigation Areas (Left / Right) */}
            <button
              type="button"
              onClick={handlePrevStory}
              aria-label="Previous Story"
              className="absolute left-0 top-16 bottom-24 w-1/3 z-10 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleNextStory}
              aria-label="Next Story"
              className="absolute right-0 top-16 bottom-24 w-1/3 z-10 focus:outline-none"
            />

            {/* Desktop Navigation Chevrons */}
            {activeStoryIndex !== null && activeStoryIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevStory}
                className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white items-center justify-center transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            {activeStoryIndex !== null && activeStoryIndex < stories.length - 1 && (
              <button
                type="button"
                onClick={handleNextStory}
                className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white items-center justify-center transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Bottom Action CTA */}
            <div className="relative z-20 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
              {activeStory.linkUrl ? (
                <Link
                  href={activeStory.linkUrl}
                  onClick={() => setActiveStoryIndex(null)}
                  className="w-full py-2.5 sm:py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xl transition-all"
                >
                  <span>مشاهده جزئیات و استعلام این آبشن</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <div className="text-center text-[11px] text-slate-400">
                  جهت استعلام این آبشن با کارشناسان ما تماس بگیرید
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
