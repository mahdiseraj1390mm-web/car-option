"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play, X, ExternalLink } from "lucide-react";

export default function StoriesBar() {
  const [stories, setStories] = useState<any[]>([]);
  const [activeStory, setActiveStory] = useState<any | null>(null);

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
              mediaUrl: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
              mediaType: "IMAGE",
              linkUrl: "/products/sony-starvis-360-camera-system",
            },
            {
              id: "2",
              title: "کروز کنترل دنا پلاس",
              mediaUrl: "https://images.unsplash.com/photo-1541348263662-e0c82661210e?auto=format&fit=crop&w=800&q=80",
              mediaType: "IMAGE",
              linkUrl: "/products/dena-plus-oem-cruise-control",
            },
            {
              id: "3",
              title: "مانیتور ۱۲ اینچ تارا",
              mediaUrl: "https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&w=800&q=80",
              mediaType: "IMAGE",
              linkUrl: "/products/tara-android-headunit-12inch",
            },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Horizontal Story Bubbles */}
      <div className="w-full overflow-x-auto no-scrollbar py-4">
        <div className="flex items-center gap-4 px-2">
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="flex flex-col items-center gap-2 group shrink-0 focus:outline-none"
            >
              <div className="w-18 h-18 sm:w-20 sm:h-20 p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-amber-500/10">
                <div className="w-full h-full rounded-full overflow-hidden p-0.5 bg-slate-950">
                  <img
                    src={story.mediaUrl}
                    alt={story.title}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-amber-500 transition-colors max-w-[85px] truncate text-center">
                {story.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Story Fullscreen Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn p-4">
          <div className="relative w-full max-w-sm h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex flex-col justify-between">
            {/* Top Bar */}
            <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
              <span className="text-sm font-bold text-white">{activeStory.title}</span>
              <button
                onClick={() => setActiveStory(null)}
                className="p-1 rounded-full bg-black/50 text-white hover:bg-black/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Content */}
            {activeStory.mediaType === "VIDEO" ? (
              <video
                src={activeStory.mediaUrl}
                autoPlay
                loop
                playsInline
                controls
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <img
                src={activeStory.mediaUrl}
                alt={activeStory.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Bottom Action CTA */}
            {activeStory.linkUrl && (
              <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <Link
                  href={activeStory.linkUrl}
                  onClick={() => setActiveStory(null)}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xl transition-all"
                >
                  مشاهده جزئیات و استعلام این آبشن
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
