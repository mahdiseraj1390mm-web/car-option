"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, PhoneCall, Check, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleSelectorModal from "@/components/VehicleSelectorModal";
import OrderRequestModal from "@/components/OrderRequestModal";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/admin/packages")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setPackages(data.data);
        } else {
          setPackages([
            {
              id: "dena-master",
              titleFa: "پکیج مهندسی ارتقای کامل ایمنی و آسایش دنا پلاس",
              slug: "dena-plus-master-package",
              description:
                "تجمیع کروز کنترل فابریک، مانیتور ۱۲ اینچ اندروید و دوربین ۳۶۰ درجه به همراه نصب همزمان و تنظیمات تخصصی با تخفیف ویژه پکیج",
              image:
                "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80",
              priceStatus: "INQUIRY",
              items: [
                "کروز کنترل فابریک با لیمیتر سرعت",
                "دوربین ۳۶۰ درجه سه‌بعدی سونی استارلایت",
                "کالیبراسیون تخصصی و نصب سوکت به سوکت",
              ],
            },
            {
              id: "tara-tech",
              titleFa: "پکیج مالتی‌مدیا و دستیار رانندگی تارا اتوماتیک V4",
              slug: "tara-multimedia-package",
              description:
                "ارتقای مانیتور به نسخه خازنی 2K، دوربین دنده عقب دید در شب و سنسورهای راداری فابریک بدون ابطال گارانتی کارخانه",
              image:
                "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1000&q=80",
              priceStatus: "INQUIRY",
              items: [
                "مانیتور ۱۲ اینچ رم ۸ گیگابایت",
                "سیستم رهیاب آفلاین و آنلاین",
                "گارانتی طلایی تعویض ۲۴ ماهه",
              ],
            },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] text-slate-900 dark:text-slate-100">
      <Header
        onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">
            <Package className="w-4 h-4" />
            تجهیز تجمیعی و اقتصادی خودرو
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            پکیج‌های اختصاصی آبشن خودرو
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            با انتخاب پکیج‌ها، چندین آبشن سازگار به صورت هماهنگ بر روی خودروی شما نصب می‌شوند و از تخفیف تجمیعی بهره‌مند می‌شوید.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-3xl bg-white dark:bg-[#111722] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={pkg.image}
                    alt={pkg.titleFa}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950">
                      پکیج تایید شده
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {pkg.titleFa}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {pkg.description}
                  </p>

                  {pkg.items && pkg.items.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        تجهیزات و خدمات موجود در این پکیج:
                      </span>
                      {pkg.items.map((it: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <Check className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>{it}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setIsOrderModalOpen(true);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <PhoneCall className="w-4 h-4" />
                  درخواست استعلام قیمت و نصب پکیج
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      <VehicleSelectorModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />

      <OrderRequestModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        packageItem={selectedPackage}
      />

      <ChatbotWidget onOpenOrderModal={() => setIsOrderModalOpen(true)} />
    </div>
  );
}
