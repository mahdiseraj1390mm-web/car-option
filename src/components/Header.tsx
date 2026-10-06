"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Car,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  PhoneCall,
  Layers,
  ChevronDown,
  ChevronLeft,
  Camera,
  MessageSquare,
  User,
  LogOut,
  Settings,
  Tv,
  ShieldCheck,
  Sparkles,
  Headphones,
  Zap,
  Home,
  Clock,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useVehicle } from "@/context/VehicleContext";
import UnifiedAuthModal from "@/components/UnifiedAuthModal";

// Category icon map helper
const getCategoryIcon = (iconName?: string) => {
  switch (iconName) {
    case "Tv":
      return <Tv className="w-4 h-4" />;
    case "ShieldCheck":
      return <ShieldCheck className="w-4 h-4" />;
    case "Sparkles":
      return <Sparkles className="w-4 h-4" />;
    case "Headphones":
      return <Headphones className="w-4 h-4" />;
    case "Zap":
      return <Zap className="w-4 h-4" />;
    default:
      return <Layers className="w-4 h-4" />;
  }
};

export default function Header({
  onOpenVehicleModal,
  onOpenOrderModal,
}: {
  onOpenVehicleModal: () => void;
  onOpenOrderModal: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const { selectedVehicle } = useVehicle();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [siteData, setSiteData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  // Robust refs for mouseleave debounce and outside click
  const megaMenuContainerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterMegaMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeaveMegaMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    // 300ms grace period so moving cursor diagonally or crossing borders never flickers
    closeTimerRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 300);
  };

  const handleToggleMegaMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsMegaMenuOpen((prev) => !prev);
  };

  // Close mega menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        megaMenuContainerRef.current &&
        !megaMenuContainerRef.current.contains(e.target as Node)
      ) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Current authenticated user state
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.length > 0) {
          setCategories(data.data);
        }
      })
      .catch(() => {});

    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSiteData(data.data);
        }
      })
      .catch(() => {});

    checkUserAuth();
  }, []);

  const checkUserAuth = () => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => {
        setCurrentUser(null);
      });
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    window.location.reload();
  };

  const setting = siteData?.setting;
  const activeCategory = categories[activeCategoryIndex] || categories[0];

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 dark:bg-[#0B0F15]/90 border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-200 shadow-sm">
        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo & Brand Identity */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                  <Car className="w-6 h-6 text-slate-950 font-bold" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                    CAR<span className="text-amber-500">OPTION</span>
                    <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      LUXURY
                    </span>
                  </span>
                  <span className="text-[11px] text-amber-500 font-bold">
                    {setting?.siteName || "پلتفرم تخصصی آپشن خودرو"} • مدیریت کاووسی
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="relative w-full"
              >
                <input
                  type="text"
                  placeholder="جستجوی نام آبشن، کروز، مانیتور، مدل خودرو..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-amber-500 transition-all text-sm"
                />
                <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
                <Link
                  href="/image-search"
                  title="جستجوی تصویری هوشمند قطعه"
                  className="absolute left-3 top-2.5 p-1 rounded-md text-slate-400 hover:text-amber-500 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </Link>
              </form>
            </div>

            {/* Actions: Garage, Auth/Profile, Theme, Order CTA */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Quick Vehicle Selector ("خودروی من") */}
              <button
                onClick={onOpenVehicleModal}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  selectedVehicle
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-500/50"
                }`}
              >
                <Car className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">
                  {selectedVehicle ? (
                    <>
                      خودرو:{" "}
                      <span className="text-amber-400 font-bold">
                        {selectedVehicle.modelName}
                      </span>
                    </>
                  ) : (
                    "انتخاب خودروی من"
                  )}
                </span>
                <span className="sm:hidden font-bold">
                  {selectedVehicle ? selectedVehicle.modelName : "انتخاب خودرو"}
                </span>
              </button>

              {/* UNIFIED AUTH BUTTON / USER PROFILE DROPDOWN */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold hover:bg-amber-500/20 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span className="max-w-[90px] truncate">{currentUser.fullName || currentUser.phone}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-[#111722] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs font-semibold space-y-1">
                      <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="block text-slate-400 text-[10px]">کاربر وارد شده:</span>
                        <strong className="text-slate-900 dark:text-white truncate block">
                          {currentUser.fullName || currentUser.phone}
                        </strong>
                      </div>

                      {currentUser.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 text-amber-500 font-black hover:bg-amber-500/20 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>ورود به پنل مدیریت</span>
                        </Link>
                      )}

                      <Link
                        href="/chat"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-amber-500" />
                        <span>پیام‌ها و پشتیبانی</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-right flex items-center gap-2 p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>خروج از حساب</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-amber-500 hover:border-amber-500/40 transition-all"
                >
                  <User className="w-4 h-4 text-amber-500" />
                  <span>ورود / ثبت‌نام</span>
                </button>
              )}

              {/* Dark/Light Mode Switcher */}
              <button
                onClick={toggleTheme}
                title="تغییر تم"
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* Order Request CTA (No Cart) */}
              <button
                onClick={onOpenOrderModal}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                درخواست استعلام
              </button>
            </div>
          </div>

          {/* Navigation Bar (Desktop Flyout Mega Menu - DIGIKALA STYLE) */}
          <nav className="hidden lg:flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 py-3 text-sm font-medium">
            <div className="flex items-center gap-8">
              {/* Flyout Mega Menu Trigger */}
              <div
                ref={megaMenuContainerRef}
                className="relative"
                onMouseEnter={handleMouseEnterMegaMenu}
                onMouseLeave={handleMouseLeaveMegaMenu}
              >
                <button
                  type="button"
                  onClick={handleToggleMegaMenu}
                  className={`flex items-center gap-2 transition-all font-bold px-3.5 py-1.5 rounded-xl border ${
                    isMegaMenuOpen
                      ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20"
                      : "text-slate-900 dark:text-white hover:text-amber-500 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <Layers className={`w-4 h-4 ${isMegaMenuOpen ? "text-slate-950" : "text-amber-500"}`} />
                  <span>دسته‌بندی آبشن‌ها</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isMegaMenuOpen ? "rotate-180 text-slate-950" : "text-slate-400"
                    }`}
                  />
                </button>

                {/* DIGIKALA STYLE 2-COLUMN FLYOUT DRAWER WITH HOVER BRIDGE */}
                {isMegaMenuOpen && categories.length > 0 && (
                  <div
                    className="absolute top-full right-0 pt-2 z-50 animate-fadeIn"
                    onMouseEnter={handleMouseEnterMegaMenu}
                    onMouseLeave={handleMouseLeaveMegaMenu}
                  >
                    {/* Safe Invisible Bridge spanning top 12px */}
                    <div className="absolute top-0 right-0 left-0 h-3 bg-transparent" />

                    <div className="w-[800px] h-[400px] bg-white dark:bg-[#111722] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex overflow-hidden ring-1 ring-black/5">
                      {/* Right Column: Main Category List (Tabs) */}
                      <div className="w-64 border-l border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0B0F15] p-3 overflow-y-auto space-y-1">
                        {categories.map((cat, idx) => (
                          <div
                            key={cat.id}
                            onMouseEnter={() => setActiveCategoryIndex(idx)}
                            className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer text-xs font-bold transition-all ${
                              activeCategoryIndex === idx
                                ? "bg-white dark:bg-[#111722] text-amber-500 shadow-sm border border-slate-200/60 dark:border-slate-800 font-black"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className={
                                  activeCategoryIndex === idx ? "text-amber-500" : "text-slate-400"
                                }
                              >
                                {getCategoryIcon(cat.icon)}
                              </span>
                              <span className="truncate">{cat.nameFa}</span>
                            </div>
                            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                        ))}
                      </div>

                      {/* Left Column: Subcategories & Items */}
                      <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                            <Link
                              href={`/products?category=${activeCategory?.slug}`}
                              onClick={() => setIsMegaMenuOpen(false)}
                              className="text-sm font-black text-slate-900 dark:text-white hover:text-amber-500 flex items-center gap-2"
                            >
                              <span>همه آبشن‌های {activeCategory?.nameFa}</span>
                              <ChevronLeft className="w-4 h-4 text-amber-500" />
                            </Link>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {activeCategory?.children?.length || 0} زیرمجموعه تخصصی
                            </span>
                          </div>

                          {/* Subcategory Grid */}
                          <div className="grid grid-cols-2 gap-3.5">
                            {activeCategory?.children?.map((sub: any) => (
                              <Link
                                key={sub.id}
                                href={`/products?category=${sub.slug}`}
                                onClick={() => setIsMegaMenuOpen(false)}
                                className="group p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-amber-500/40 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-amber-500/5 transition-all flex items-center justify-between text-xs"
                              >
                                <span className="text-slate-700 dark:text-slate-300 font-semibold group-hover:text-amber-500">
                                  {sub.nameFa}
                                </span>
                                <ChevronLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-1 transition-transform" />
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Quick Help */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                          <span>نیاز به راهنمایی سازگاری با مدل خودرو دارید؟</span>
                          <button
                            onClick={() => {
                              setIsMegaMenuOpen(false);
                              onOpenVehicleModal();
                            }}
                            className="text-amber-500 font-bold hover:underline"
                          >
                            انتخاب خودروی من ←
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/products"
                className="text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
              >
                تمامی آبشن‌ها
              </Link>
              <Link
                href="/packages"
                className="text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
              >
                پکیج‌های تجهیز خودرو
              </Link>
              <Link
                href="/compare"
                className="text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
              >
                مقایسه محصولات
              </Link>
              <Link
                href="/projects"
                className="text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
              >
                گالری قبل و بعد (Before/After)
              </Link>
              <Link
                href="/tracking"
                className="text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors flex items-center gap-1 font-semibold"
              >
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                پیگیری سفارش
              </Link>
              <Link
                href="/image-search"
                className="text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-1"
              >
                <Camera className="w-3.5 h-3.5" />
                جستجو با عکس
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                مدیریت: کاووسی
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>مشاوره و پشتیبانی:</span>
                <a
                  href={`tel:${setting?.phone || "09133332737"}`}
                  className="font-bold text-slate-900 dark:text-white hover:text-amber-500 tracking-wider font-mono text-sm dir-ltr"
                >
                  {setting?.phone || "09133332737"}
                </a>
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Drawer Menu (Optimized Native App Experience) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-out Drawer from Right (RTL Standard) */}
            <div className="relative mr-auto w-[85%] max-w-sm h-full bg-slate-950 text-white shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-800 z-10 transition-transform duration-300">
              <div className="p-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-black text-sm text-white">منوی تخصصی آپشن خودرو</div>
                      <div className="text-[11px] text-amber-500 font-bold">مدیریت: کاووسی</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
                    aria-label="بستن منو"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Auth Quick Card */}
                <div className="py-4 space-y-3">
                  {currentUser ? (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400">
                          {currentUser.fullName || currentUser.phone}
                        </span>
                        <button onClick={handleLogout} className="text-rose-400 hover:underline">
                          خروج از حساب
                        </button>
                      </div>
                      {currentUser.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-amber-500 font-bold hover:underline"
                        >
                          → ورود به پنل مدیریت سایت
                        </Link>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full text-right py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-500/5 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center justify-between hover:bg-amber-500/30 transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-400" />
                        ورود به حساب کاربری / ثبت‌نام
                      </span>
                      <ChevronLeft className="w-4 h-4 text-amber-400" />
                    </button>
                  )}

                  {/* Vehicle Garage Action */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenVehicleModal();
                    }}
                    className="w-full text-right py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs flex items-center justify-between hover:border-amber-500/40 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-amber-500" />
                      {selectedVehicle
                        ? `خودرو: ${selectedVehicle.brandName} ${selectedVehicle.modelName}`
                        : "انتخاب خودروی من (فیلتر هوشمند)"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                      {selectedVehicle ? "تغییر" : "انتخاب"}
                    </span>
                  </button>

                  {/* Navigation Links */}
                  <div className="pt-2 space-y-1.5 text-xs font-semibold">
                    <Link
                      href="/products"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-amber-400 transition-colors"
                    >
                      <span>کاتالوگ کامل آبشن‌ها</span>
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </Link>

                    {/* Mobile Accordion Categories */}
                    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden divide-y divide-slate-800/80 my-2">
                      <div className="p-3 bg-slate-900 flex items-center justify-between">
                        <span className="text-xs font-black text-amber-400 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-amber-500" />
                          دسته‌بندی تجهیزات
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {categories.length} شاخه
                        </span>
                      </div>

                      {categories.map((c) => {
                        const isExpanded = expandedMobileCategory === c.id;
                        return (
                          <div key={c.id} className="text-xs">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedMobileCategory(isExpanded ? null : c.id)
                              }
                              className={`w-full flex items-center justify-between p-3 transition-colors font-bold ${
                                isExpanded
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "text-slate-300 hover:bg-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={isExpanded ? "text-amber-500" : "text-slate-400"}>
                                  {getCategoryIcon(c.icon)}
                                </span>
                                <span>{c.nameFa}</span>
                              </div>
                              <ChevronDown
                                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                  isExpanded ? "rotate-180 text-amber-500" : ""
                                }`}
                              />
                            </button>

                            {isExpanded && (
                              <div className="p-2 bg-slate-950 space-y-1 border-t border-slate-800">
                                <Link
                                  href={`/products?category=${c.slug}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block p-2 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-xs"
                                >
                                  ← همه محصولات {c.nameFa}
                                </Link>
                                {c.children?.map((sub: any) => (
                                  <Link
                                    key={sub.id}
                                    href={`/products?category=${sub.slug}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-900 text-xs"
                                  >
                                    <span>{sub.nameFa}</span>
                                    <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <Link
                      href="/packages"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-amber-400 transition-colors"
                    >
                      <span>پکیج‌های مهندسی تجهیز</span>
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </Link>
                    <Link
                      href="/projects"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-amber-400 transition-colors"
                    >
                      <span>پروژه‌ها و اسلایدر قبل/بعد</span>
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </Link>
                    <Link
                      href="/tracking"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-900 text-amber-400 font-bold border border-slate-800"
                    >
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        پیگیری آنلاین سفارشات
                      </span>
                      <ChevronLeft className="w-4 h-4 text-amber-500" />
                    </Link>
                    <Link
                      href="/image-search"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-900 text-amber-400 font-bold transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-amber-500" />
                        جستجوی هوشمند با تصویر قطعه
                      </span>
                      <ChevronLeft className="w-4 h-4 text-amber-500" />
                    </Link>
                    <Link
                      href="/chat"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-amber-400 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        گفتگوی آنلاین با پشتیبانی
                      </span>
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Drawer Footer CTA */}
              <div className="p-6 border-t border-slate-800 space-y-3 bg-slate-950">
                <a
                  href="tel:09133332737"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono flex items-center justify-center gap-2 hover:border-amber-500/50"
                >
                  <PhoneCall className="w-4 h-4 text-amber-500" />
                  <span>تماس: ۰۹۱۳۳۳۳۲۷۳۷</span>
                </a>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenOrderModal();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  درخواست استعلام و مشاوره فنی
                </button>
              </div>
            </div>
          </div>
        )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Floating Bottom Bar for Standard Native Mobile Experience */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B0F15]/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/90 px-4 py-2 flex items-center justify-around shadow-2xl">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>خانه</span>
        </Link>
        <button
          onClick={() => {
            setIsMobileMenuOpen(true);
            setExpandedMobileCategory(categories[0]?.id || null);
          }}
          className="flex flex-col items-center gap-1 text-[10px] text-amber-500 font-bold transition-colors"
        >
          <Layers className="w-5 h-5 text-amber-500" />
          <span>دسته‌ها</span>
        </button>
        <button
          onClick={onOpenVehicleModal}
          className="flex flex-col items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors"
        >
          <Car className="w-5 h-5" />
          <span>خودروی من</span>
        </button>
        <Link
          href="/chat"
          className="flex flex-col items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          <span>مشاوره</span>
        </Link>
        <button
          onClick={onOpenOrderModal}
          className="flex flex-col items-center gap-1 text-[10px] text-amber-500 font-bold transition-colors"
        >
          <PhoneCall className="w-5 h-5" />
          <span>استعلام</span>
        </button>
      </div>

      {/* Unified Auth Modal */}
      <UnifiedAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={() => checkUserAuth()}
      />
    </>
  );
}
