"use client";

import React from "react";
import { MapPin, X, Navigation, Phone, Clock, ExternalLink } from "lucide-react";

export default function MapModal({
  isOpen,
  onClose,
  setting,
}: {
  isOpen: boolean;
  onClose: () => void;
  setting?: any;
}) {
  if (!isOpen) return null;

  const lat = setting?.mapLat || 35.7412;
  const lng = setting?.mapLng || 51.4289;
  const address =
    setting?.address || "تهران، خیابان شریعتی، نرسیده به پل سیدخندان، مجتمع تخصصی خودرو طبقه ۱";

  // Navigation Links
  const neshanUrl = `https://neshan.org/maps/@${lat},${lng},16z`;
  const baladUrl = `https://balad.ir/location?latitude=${lat}&longitude=${lng}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111722] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black">نقشه و موقعیت استودیو نصب و شوروم</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                موقعیت جغرافیایی و راه‌های دسترسی سریع
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Map Canvas / Embed */}
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-900">
          <iframe
            title="Location Map"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${
              lat - 0.008
            }%2C${lng + 0.01}%2C${lat + 0.008}&layer=mapnik&marker=${lat}%2C${lng}`}
            className="w-full h-full border-0 filter contrast-125"
          />
          <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md text-[11px] text-white flex items-center gap-2 border border-slate-800 font-mono">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>مختصات: {lat.toFixed(4)}, {lng.toFixed(4)}</span>
          </div>
        </div>

        {/* Address and Contact Details */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs sm:text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>{address}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>پذیرش حضوری خودرو با هماهنگی قبلی</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-mono text-slate-300">021-88992211</span>
            </div>
          </div>
        </div>

        {/* Quick Navigation Buttons (Neshan, Balad, Google) */}
        <div>
          <span className="block text-xs font-bold text-slate-500 mb-2">
            مسیریابی مستقیم با اپلیکیشن‌ها:
          </span>
          <div className="grid grid-cols-3 gap-3">
            <a
              href={neshanUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 font-bold text-xs text-center border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              مسیریابی با نشان
            </a>
            <a
              href={baladUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 font-bold text-xs text-center border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              مسیریابی با بلد
            </a>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 font-bold text-xs text-center border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              گوگل مپ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
