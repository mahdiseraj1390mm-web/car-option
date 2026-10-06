"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  PhoneCall,
  ShieldCheck,
  AlertCircle,
  Package,
  Car,
  ChevronLeft,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Calendar,
  User,
  Phone,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [trackingCode, setTrackingCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const handleSearch = async (codeToSearch?: string) => {
    const code = (codeToSearch || trackingCode).trim();
    if (!code) {
      setErrorMsg("لطفاً کد رهگیری خود را وارد نمایید (مثال: OPT-12345)");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/orders?trackingCode=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setOrderData(data.data);
      } else {
        setOrderData(null);
        setErrorMsg(data.error || "درخواستی با این کد رهگیری در سامانه یافت نشد.");
      }
    } catch (err) {
      setOrderData(null);
      setErrorMsg("خطای ارتباط با سرور. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  // Status mapping
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "NEW":
        return {
          step: 1,
          title: "ثبت اولیه در سامانه",
          desc: "درخواست استعلام شما ثبت گردیده و در صف بررسی کارشناسان فنی قرار دارد.",
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        };
      case "UNDER_REVIEW":
        return {
          step: 2,
          title: "بررسی مهندسی و سازگاری خودرو",
          desc: "کارشناس تخصصی در حال تطبیق سیم‌کشی، سال و تیپ خودرو با آپشن انتخابی است.",
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        };
      case "CONTACTED":
        return {
          step: 3,
          title: "تماس کارشناس و مشاوره فنی",
          desc: "کارشناس فنی جهت ارائه توضیحات تکمیلی و استعلام قیمت نهایی با شما تماس گرفته است.",
          color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
        };
      case "WAITING_CUSTOMER":
        return {
          step: 4,
          title: "هماهنگی نوبت نصب / ارسال",
          desc: "در انتظار تایید نهایی زمان حضور در مرکز خدمات یا تحویل قطعه فابریک.",
          color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        };
      case "COMPLETED":
        return {
          step: 5,
          title: "تکمیل نصب و فعال‌سازی گارانتی",
          desc: "نصب با استاندارد سوکت فابریک انجام شده و گارانتی تعویض طلایی فعال گردید.",
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        };
      case "CANCELLED":
        return {
          step: 0,
          title: "درخواست لغو شده",
          desc: "این درخواست بنا به هماهنگی متقاضی یا عدم سازگاری فنی قطعه لغو گردید.",
          color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
        };
      default:
        return {
          step: 1,
          title: "در حال پردازش",
          desc: "درخواست شما توسط تیم مهندسی در حال پیگیری است.",
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        };
    }
  };

  const steps = [
    { num: 1, label: "ثبت اولیه استعلام", desc: "دریافت کد رهگیری" },
    { num: 2, label: "کارشناسی فنی", desc: "بررسی سازگاری فابریک" },
    { num: 3, label: "تماس و مشاوره", desc: "پاسخ به سوالات فنی" },
    { num: 4, label: "رزرو نوبت نصب", desc: "هماهنگی زمان مرکز" },
    { num: 5, label: "تحویل و گارانتی طلایی", desc: "نصب بدون تداخل سیم‌کشی" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] text-slate-900 dark:text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      <Header
        onOpenVehicleModal={() => {}}
        onOpenOrderModal={() => {}}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-amber-500">
            صفحه اصلی
          </Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-slate-200 font-bold">
            پیگیری وضعیت استعلام و درخواست سفارش
          </span>
        </div>

        {/* Hero Banner & Search Bar */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-[#111722] to-slate-950 text-white border border-slate-800 shadow-2xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            سامانه یکپارچه رهگیری آنلاین درخواست
          </div>

          <h1 className="text-2xl sm:text-3xl font-black">
            پیگیری آنلاین <span className="text-amber-500">استعلام و نوبت نصب</span> آبشن
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            کد رهگیری صادر شده هنگام ثبت درخواست (به عنوان مثال{" "}
            <span className="font-mono text-amber-400 font-bold">OPT-82143</span>) را وارد کنید تا
            مراحل بررسی فنی، مشاوره کارشناس و هماهنگی زمان نصب را لحظه‌به‌لحظه مشاهده نمایید.
          </p>

          {/* Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="max-w-md mx-auto flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-700/80 focus-within:border-amber-500 transition-all shadow-xl"
          >
            <input
              type="text"
              dir="ltr"
              placeholder="OPT-XXXXX"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? "در حال استعلام..." : "رهگیری"}</span>
            </button>
          </form>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Details Result */}
        {orderData && (
          <div className="space-y-8 animate-fadeIn">
            {/* Status Card & Stepper */}
            {(() => {
              const currentStatus = getStatusInfo(orderData.status);
              return (
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111722] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
                  {/* Status Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400 block mb-1">کد اختصاصی رهگیری:</span>
                      <strong className="text-2xl font-black font-mono text-amber-500 tracking-wider">
                        {orderData.trackingCode}
                      </strong>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-2 rounded-2xl border text-xs font-black ${currentStatus.color}`}>
                        {currentStatus.title}
                      </div>
                    </div>
                  </div>

                  {/* Visual Stepper */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider">
                      مراحل پیشرفت فرآیند مهندسی:
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                      {steps.map((st) => {
                        const isDone = currentStatus.step >= st.num;
                        const isCurrent = currentStatus.step === st.num;

                        return (
                          <div
                            key={st.num}
                            className={`p-4 rounded-2xl border transition-all text-right relative flex flex-col justify-between ${
                              isCurrent
                                ? "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30"
                                : isDone
                                ? "bg-emerald-500/5 border-emerald-500/20 text-slate-800 dark:text-slate-200"
                                : "bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/80 text-slate-400 opacity-60"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-mono text-xs font-black">گام ۰{st.num}</span>
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Clock className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <strong className="block text-xs font-black mb-1">{st.label}</strong>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">{st.desc}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Detailed Note */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong className="text-amber-500 font-bold block mb-1">توضیحات وضعیت فعلی:</strong>
                    {currentStatus.desc}
                    {orderData.adminNotes && (
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-500">
                        <strong>یادداشت کارشناس: </strong>
                        <span>{orderData.adminNotes}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Request Summary & Product Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product / Option Card */}
              <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111722] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-slate-400 flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-500" />
                  آبشن یا تجهیز درخواستی
                </h3>

                {orderData.product ? (
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                    {orderData.product.media?.[0]?.url && (
                      <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0">
                        <img
                          src={orderData.product.media[0].url}
                          alt={orderData.product.titleFa}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-2 text-right flex-1">
                      <span className="font-mono text-xs text-amber-500 font-bold">
                        {orderData.product.sku}
                      </span>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {orderData.product.titleFa}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {orderData.product.shortDesc}
                      </p>
                      <Link
                        href={`/products/${orderData.product.slug}`}
                        className="text-xs text-amber-500 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        مشاهده مشخصات فنی کامل قطعه ←
                      </Link>
                    </div>
                  </div>
                ) : orderData.package ? (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-bold">
                      پکیج جامع تجهیز
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      {orderData.package.titleFa}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {orderData.package.description}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-400">
                    درخواست مشاوره عمومی و استعلام سازگاری قطعات با خودرو
                  </div>
                )}
              </div>

              {/* Applicant & Vehicle Info */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111722] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-slate-400 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-500" />
                  مشخصات متقاضی و خودرو
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">نام متقاضی:</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{orderData.customerName}</strong>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">خودروی ثبت‌شده:</span>
                    <strong className="text-amber-500 font-bold">
                      {orderData.vehicleInfo || "مشخص نشده"}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">روش ارتباط ترجیحی:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {orderData.preferredContact === "PHONE"
                        ? "تماس تلفنی"
                        : orderData.preferredContact === "TELEGRAM"
                        ? "تلگرام"
                        : orderData.preferredContact === "EITAA"
                        ? "ایتا"
                        : "واتساپ"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">تاریخ ثبت:</span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {new Date(orderData.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/chat"
                    className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-800"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    گفتگوی آنلاین با کارشناس مسئول
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F15] flex items-center justify-center text-sm text-slate-400">
          در حال بارگذاری سامانه رهگیری...
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}
