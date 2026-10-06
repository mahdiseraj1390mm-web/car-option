"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleSelectorModal from "@/components/VehicleSelectorModal";
import OrderRequestModal from "@/components/OrderRequestModal";
import ChatbotWidget from "@/components/ChatbotWidget";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { Wrench, PhoneCall } from "lucide-react";

export default function ProjectsPage() {
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setProjects(data.data);
        } else {
          setProjects([
            {
              id: "p1",
              title: "تجهیز کامل تارا اتوماتیک V4 به سیستم مانیتور خازنی و دوربین ۳۶۰ درجه",
              vehicleName: "تارا اتوماتیک V4",
              description: "ارتقای سیستم چندرسانه‌ای با مانیتور ۱۲ اینچ IPS و دوربین ۳۶۰ درجه سونی با کالیبراسیون دقیق بدون تداخل در سیستم برق فابریک خودرو.",
              beforeImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80",
              afterImage: "https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&w=1000&q=80",
            },
            {
              id: "p2",
              title: "نصب کروز کنترل فابریک و کلیدهای فرمان دنا پلاس توربو",
              vehicleName: "دنا پلاس توربو",
              description: "فعال‌سازی سیستم کروز کنترل با کلیدهای فابریک روی غربیلک فرمان و اتصال مستقیم به ایسیو خودرو بدون سیم‌کشی اضافه.",
              beforeImage: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80",
              afterImage: "https://images.unsplash.com/photo-1541348263662-e0c82661210e?auto=format&fit=crop&w=1000&q=80",
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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">
            <Wrench className="w-4 h-4" />
            پروژه‌های مهندسی اجرا شده در استودیو
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            گالری قبل و بعد از نصب (Before / After)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            تفاوت ظاهری و فنی ارتقای خودروهای مشتریان را با اسلایدر تعاملی مقایسه کنید.
          </p>
        </div>

        <div className="space-y-10">
          {projects.map((proj, idx) => (
            <div
              key={proj.id}
              className="p-8 rounded-3xl bg-white dark:bg-[#111722] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-amber-500 font-bold">
                      پروژه #{idx + 101}
                    </span>
                    {proj.vehicleName && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                        {proj.vehicleName}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {proj.title}
                  </h2>
                  {proj.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0 self-start sm:self-auto shadow-lg shadow-amber-500/20"
                >
                  <PhoneCall className="w-4 h-4" />
                  درخواست اجرای مشابه برای خودروی من
                </button>
              </div>

              <BeforeAfterSlider
                beforeImage={proj.beforeImage || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80"}
                afterImage={proj.afterImage || proj.coverImage || "https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&w=1000&q=80"}
                beforeLabel="نمای اولیه فابریک قبل از نصب"
                afterLabel="نمای نهایی بعد از ارتقای تخصصی"
              />
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
      />

      <ChatbotWidget onOpenOrderModal={() => setIsOrderModalOpen(true)} />
    </div>
  );
}
