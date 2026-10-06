"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  ShieldCheck,
  Cpu,
  Sparkles,
  PhoneCall,
  Search,
  CheckCircle,
  ArrowRight,
  Layers,
  ChevronLeft,
  Camera,
  Wrench,
  Award,
  Zap,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleSelectorModal from "@/components/VehicleSelectorModal";
import OrderRequestModal from "@/components/OrderRequestModal";
import ChatbotWidget from "@/components/ChatbotWidget";
import StoriesBar from "@/components/StoriesBar";
import HomeVehicleFilter from "@/components/HomeVehicleFilter";
import ProductCard from "@/components/ProductCard";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

export default function HomePage() {
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<any | null>(null);
  const [selectedPackageForOrder, setSelectedPackageForOrder] = useState<any | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetch("/api/products?featured=true")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setProducts(res.data);
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleOpenOrder = (prod?: any, pkg?: any) => {
    setSelectedProductForOrder(prod || null);
    setSelectedPackageForOrder(pkg || null);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <Header
        onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
        onOpenOrderModal={() => handleOpenOrder()}
      />

      <main className="flex-1">
        {/* 1. Hero Section (Automotive Studio Stage) */}
        <section className="relative w-full dark-stage py-20 lg:py-28 overflow-hidden border-b border-slate-200 dark:border-slate-800/80">
          {/* Subtle Ambient Light Effect */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  استاندارد کارخانه‌ای • بدون تداخل در سیم‌کشی فابریک
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.25]">
                  پلتفرم مهندسی و ارتقای <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-600">
                    آبشن‌های تخصصی خودرو
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                  جستجو، بررسی انطباق و درخواست استعلام و نصب آبشن‌های فابریک شامل کروز کنترل، مانیتورهای اندروید، دوربین ۳۶۰ درجه و کلاچ اتوماتیک بر اساس برند، مدل و سال خودرو با پشتیبانی کارشناسان فنی.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <button
                    onClick={() => handleOpenOrder()}
                    className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                  >
                    <PhoneCall className="w-4 h-4" />
                    درخواست استعلام و مشاوره فنی
                  </button>

                  <button
                    onClick={() => setIsVehicleModalOpen(true)}
                    className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 font-bold text-sm flex items-center gap-2 hover:border-amber-500/50 transition-all"
                  >
                    <Car className="w-4 h-4 text-amber-500" />
                    انتخاب خودروی من
                  </button>

                  <Link
                    href="/products"
                    className="px-5 py-3.5 rounded-2xl text-slate-300 hover:text-white font-bold text-sm flex items-center gap-1 transition-colors"
                  >
                    مشاهده کاتالوگ
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>گارانتی طلایی تعویض</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-500" />
                    <span>نصب سوکت به سوکت</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>بدون ابطال گارانتی</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Showcase Image */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto w-full max-w-md lg:max-w-none rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl shadow-black/80 group">
                  <img
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80"
                    alt="Luxury Automotive Option Engineering"
                    className="w-full h-[380px] sm:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute bottom-6 right-6 left-6 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="block text-[11px] text-amber-400 font-mono">FEATURED UPGRADE</span>
                      <strong className="text-sm text-white font-bold">تجهیز هوشمند کابین و دید ۳۶۰ درجه</strong>
                    </div>
                    <Link
                      href="/projects"
                      className="p-2.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive Vehicle Compatibility Engine Section */}
        <HomeVehicleFilter />

        {/* 3. Stories Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              استوری‌های معرفی و نصب زنده
            </h3>
            <span className="text-xs text-slate-400">کلیک برای مشاهده جزئیات</span>
          </div>
          <StoriesBar />
        </section>

        {/* 4. Main Option Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3">
              دسته‌بندی‌های تخصصی آبشن خودرو
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              انتخاب از میان تجهیزات استاندارد تایید شده توسط مهندسین الکترونیک خودرو
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: "سیستم‌های تصویری و مانیتور",
                desc: "مانیتورهای اندروید ۱۲ اینچ، IPS 2K ضد تابش",
                icon: Layers,
                link: "/products?category=multimedia",
                count: "۲۴ مدل سازگار",
              },
              {
                title: "کروز کنترل و لیمیتر",
                desc: "تثبیت سرعت با شبکه CAN و کلیدهای فابریک",
                icon: Zap,
                link: "/products?category=cruise-control",
                count: "۱۸ مدل خودرو",
              },
              {
                title: "دوربین ۳۶۰ درجه پرنده‌ای",
                desc: "دید سه‌بعدی بدون نقطه کور سنسور سونی استارلایت",
                icon: Camera,
                link: "/products?category=360-camera",
                count: "دید کامل شب",
              },
              {
                title: "کلاچ اتوماتیک و رفاهی",
                desc: "حذف پدال کلاچ در ترافیک با حفظ سیستم فابریک",
                icon: Cpu,
                link: "/products?category=comfort-convenience",
                count: "پشتیبانی ترافیک",
              },
            ].map((cat, idx) => (
              <Link
                key={idx}
                href={cat.link}
                className="group p-6 rounded-3xl bg-white dark:bg-[#111722] border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-xl dark:hover:shadow-amber-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1.5 group-hover:text-amber-500 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-amber-500 font-bold">{cat.count}</span>
                  <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. Featured Products Catalog */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-mono text-amber-500 font-bold">ENGINEERING SELECTION</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                جدیدترین و محبوب‌ترین آبشن‌های خودرو
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1"
            >
              مشاهده تمامی محصولات
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenOrder={(p) => handleOpenOrder(p)}
              />
            ))}
          </div>
        </section>

        {/* 6. Special Package Bundle Showcase */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 text-white shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                  پکیج پیشنهادی مهندسی
                </span>
                <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                  پکیج ارتقای جامع ایمنی و مولتی‌مدیا دنا پلاس
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  ترکیب کروز کنترل فابریک، دوربین ۳۶۰ درجه استارلایت و مانیتور با تخفیف نصب یکجا و همگام‌سازی کامل با کلیدهای غربیلک فرمان. بدون پرداخت آنلاین با مشاوره تخصصی در محل شما.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() =>
                      handleOpenOrder(undefined, {
                        id: "dena-bundle",
                        titleFa: "پکیج ارتقای دنا پلاس",
                      })
                    }
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    استعلام و ثبت درخواست پکیج
                  </button>
                  <Link
                    href="/packages"
                    className="text-xs font-bold text-slate-300 hover:text-white"
                  >
                    مشاهده سایر پکیج‌ها ←
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80"
                    alt="Dena Plus Package"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Before & After Interactive Showcase */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono text-amber-500 font-bold">BEFORE / AFTER SLIDER</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
              مقایسه بصری قبل و بعد از نصب آبشن
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              با کشیدن اسلایدر تفاوت جلوه داشبورد و ارتقای تکنولوژی خودرو را مشاهده کنید
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <BeforeAfterSlider
              beforeImage="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80"
              afterImage="https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&w=1000&q=80"
              beforeLabel="قبل از نصب: مانیتور و داشبورد فابریک ساده"
              afterLabel="بعد از نصب: مانیتور ۱۲ اینچ IPS و دوربین ۳۶۰ فعال"
            />
          </div>
        </section>

        {/* 8. Call to Action Lead Form Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-100 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-right">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                هنوز مطمئن نیستید کدام آبشن برای خودروی شما مناسب است؟
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                کافیست شماره تماس و مدل خودروی خود را اعلام کنید تا کارشناسان فنی ما برای مشاوره رایگان تخصصی در ساعات انتخابی با شما تماس بگیرند.
              </p>
            </div>

            <button
              onClick={() => handleOpenOrder()}
              className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 shrink-0 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <PhoneCall className="w-5 h-5" />
              درخواست مشاوره رایگان با کارشناس
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals & Floating AI Chatbot */}
      <VehicleSelectorModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />

      <OrderRequestModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={selectedProductForOrder}
        packageItem={selectedPackageForOrder}
      />

      <ChatbotWidget onOpenOrderModal={() => handleOpenOrder()} />
    </div>
  );
}
