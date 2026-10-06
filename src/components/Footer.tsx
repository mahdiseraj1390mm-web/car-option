"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Car,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  Instagram,
  Radio,
  MessageCircle,
  Navigation,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch(() => {});
  }, []);

  const setting = data?.setting;
  const socials = data?.socialLinks || [];
  const hours = data?.workingHours || [];
  const isOpenNow = data?.isOpenNow;

  const lat = setting?.mapLat || 35.7412;
  const lng = setting?.mapLng || 51.4289;
  const address =
    setting?.address || "تهران، خیابان شریعتی، نرسیده به پل سیدخندان، مجتمع تخصصی خودرو طبقه ۱";

  // Navigation Links
  const neshanUrl = `https://neshan.org/maps/@${lat},${lng},16z`;
  const baladUrl = `https://balad.ir/location?latitude=${lat}&longitude=${lng}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-10 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* SECTION: VISUAL INTERACTIVE MAP IN FOOTER */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111722] border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  موقعیت جغرافیایی و استودیو نصب تخصصی
                </h3>
                <p className="text-xs text-slate-400">
                  {address}
                </p>
              </div>
            </div>

            {/* Direct Quick Navigation Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={neshanUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-bold text-xs border border-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                مسیریابی با نشان
              </a>
              <a
                href={baladUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-bold text-xs border border-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                مسیریابی با بلد
              </a>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-bold text-xs border border-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                گوگل مپ
              </a>
            </div>
          </div>

          {/* Map Embed Frame */}
          <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-slate-900">
            <iframe
              title="Location Map"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${
                lat - 0.008
              }%2C${lng + 0.01}%2C${lat + 0.008}&layer=mapnik&marker=${lat}%2C${lng}`}
              className="w-full h-full border-0 filter contrast-125"
            />
          </div>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                CAR<span className="text-amber-500">OPTION</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              مرکز مهندسی، مشاوره تخصصی و تجهیز انواع آبشن‌های فابریک و هوشمند خودروهای داخلی و وارداتی با استانداردهای کارخانه‌ای به مدیریت کاووسی.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-500 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>پلتفرم تخصصی آپشن خودرو — مدیریت: کاووسی</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base mb-4 border-r-2 border-amber-500 pr-2">
              دسترسی سریع
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products" className="hover:text-amber-400 transition-colors">
                  کاتالوگ کامل آبشن‌ها
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-amber-400 transition-colors">
                  پکیج‌های مهندسی تجهیز خودرو
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-amber-400 transition-colors">
                  پروژه‌های نصب‌شده و Before/After
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-amber-400 transition-colors">
                  مقایسه آنلاین مشخصات آبشن‌ها
                </Link>
              </li>
              <li>
                <Link href="/image-search" className="hover:text-amber-400 transition-colors">
                  جستجوی هوشمند با تصویر قطعه
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-amber-400 transition-colors font-bold text-amber-500">
                  پیگیری آنلاین وضعیت سفارش
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-amber-400 transition-colors">
                  سیستم پیام‌رسان داخلی و ارسال وویس
                </Link>
              </li>
            </ul>
          </div>

          {/* Working Hours (Live Status) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-bold text-base mb-4 border-r-2 border-amber-500 pr-2">
                ساعات کاری و پذیرش
              </h4>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isOpenNow
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}
              >
                {isOpenNow ? "اکنون باز است" : "اکنون بسته است"}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              {hours.map((h: any) => (
                <div key={h.id} className="flex items-center justify-between py-1 border-b border-slate-900">
                  <span>{h.dayName}:</span>
                  <span className="font-mono text-slate-300">
                    {h.isOpen ? `${h.openTime} الی ${h.closeTime}` : "تعطیل"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base mb-4 border-r-2 border-amber-500 pr-2">
              اطلاعات تماس
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-center mb-2">
                مدیریت مجموعه: جناب آقای کاووسی
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>شماره تماس و پشتیبانی:</span>
                <a
                  href={`tel:${setting?.phone || "09133332737"}`}
                  className="hover:text-amber-400 font-bold font-mono text-sm text-white"
                >
                  {setting?.phone || "09133332737"}
                </a>
              </div>
            </div>

            {/* Social Links (Iranian + Global) */}
            <div className="pt-2">
              <span className="block text-xs text-slate-500 mb-2 font-semibold">
                پیام‌رسان‌ها و شبکه‌های اجتماعی:
              </span>
              <div className="flex flex-wrap gap-2">
                {socials.map((s: any) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    title={s.title}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors border border-slate-800"
                  >
                    {s.platform === "INSTAGRAM" && <Instagram className="w-4 h-4" />}
                    {s.platform === "TELEGRAM" && <Send className="w-4 h-4" />}
                    {s.platform === "EITAA" && <MessageCircle className="w-4 h-4" />}
                    {s.platform === "RUBIKA" && <Radio className="w-4 h-4" />}
                    {s.platform === "WHATSAPP" && <Phone className="w-4 h-4" />}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© تمامی حقوق برای پلتفرم تخصصی آپشن خودرو (مدیریت کاووسی) محفوظ است.</p>
          <div className="flex items-center gap-4">
            <span className="text-amber-500 font-bold">مدیریت: کاووسی | ۰۹۱۳۳۳۳۲۷۳۷</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
