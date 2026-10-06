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

            {/* Social Links (Iranian + Global Messengers with exact branded icons) */}
            <div className="pt-2">
              <span className="block text-xs text-slate-500 mb-2 font-semibold">
                پیام‌رسان‌ها و ارتباط مستقیم با مدیریت:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/989133332737"
                  target="_blank"
                  rel="noreferrer"
                  title="واتساپ مدیریت (۰۹۱۳۳۳۳۲۷۳۷)"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all border border-[#25D366]/30 text-xs font-bold"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>واتساپ</span>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/caroption_channel"
                  target="_blank"
                  rel="noreferrer"
                  title="کانال تلگرام"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white transition-all border border-[#229ED9]/30 text-xs font-bold"
                >
                  <Send className="w-4 h-4" />
                  <span>تلگرام</span>
                </a>

                {/* Eitaa */}
                <a
                  href="https://eitaa.com/caroption"
                  target="_blank"
                  rel="noreferrer"
                  title="کانال رسمی ایتا"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E86726]/10 text-[#E86726] hover:bg-[#E86726] hover:text-white transition-all border border-[#E86726]/30 text-xs font-bold"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E86726]" />
                  <span>ایتا (Eitaa)</span>
                </a>

                {/* Rubika */}
                <a
                  href="https://rubika.ir/caroption"
                  target="_blank"
                  rel="noreferrer"
                  title="کانال روبیکا"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7C3AED]/10 text-[#A78BFA] hover:bg-[#7C3AED] hover:text-white transition-all border border-[#7C3AED]/30 text-xs font-bold"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA]" />
                  <span>روبیکا</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/caroption_ir"
                  target="_blank"
                  rel="noreferrer"
                  title="اینستاگرام رسمی"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C] hover:text-white transition-all border border-[#E1306C]/30 text-xs font-bold"
                >
                  <Instagram className="w-4 h-4" />
                  <span>اینستاگرام</span>
                </a>
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
