"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, Search, Car, SlidersHorizontal, Check, RefreshCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import VehicleSelectorModal from "@/components/VehicleSelectorModal";
import OrderRequestModal from "@/components/OrderRequestModal";
import ChatbotWidget from "@/components/ChatbotWidget";
import { useVehicle } from "@/context/VehicleContext";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialQuery = searchParams.get("q") || "";

  const { selectedVehicle } = useVehicle();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [onlyCompatible, setOnlyCompatible] = useState(!!selectedVehicle);
  const [sortBy, setSortBy] = useState("latest");

  // Modals
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCat) params.set("category", selectedCat);
    if (searchQuery) params.set("q", searchQuery);
    if (onlyCompatible && selectedVehicle?.trimId) {
      params.set("trimId", selectedVehicle.trimId);
    }
    if (sortBy) params.set("sort", sortBy);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .finally(() => setLoading(false));
  }, [selectedCat, searchQuery, onlyCompatible, selectedVehicle, sortBy]);

  const handleOpenOrder = (prod?: any) => {
    setSelectedProductForOrder(prod || null);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            کاتالوگ تخصصی آبشن‌های خودرو
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            مشاهده، بررسی مشخصات و ثبت استعلام بدون نیاز به پرداخت آنلاین
          </p>
        </div>

        {/* Selected Vehicle Badge */}
        {selectedVehicle && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <Car className="w-4 h-4 text-amber-500" />
            <span>فیلتر فعال خودرو:</span>
            <strong className="text-amber-500 font-bold">
              {selectedVehicle.brandName} - {selectedVehicle.modelName}
            </strong>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111722] border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="font-black text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                فیلترهای پیشرفته
              </span>
              {(selectedCat || searchQuery || onlyCompatible) && (
                <button
                  onClick={() => {
                    setSelectedCat("");
                    setSearchQuery("");
                    setOnlyCompatible(false);
                  }}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1"
                >
                  <RefreshCcw className="w-3 h-3" />
                  پاکسازی
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">
                جستجو در مشخصات
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="کروز، مانیتور، دوربین..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Vehicle Compatibility Toggle */}
            {selectedVehicle && (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyCompatible}
                    onChange={(e) => setOnlyCompatible(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>فقط آبشن‌های سازگار با خودروی من</span>
                </label>
                <span className="block text-[11px] text-slate-400 pr-6">
                  {selectedVehicle.brandName} {selectedVehicle.modelName}
                </span>
              </div>
            )}

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">
                دسته‌بندی‌ها
              </label>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCat("")}
                  className={`w-full text-right px-3 py-2 rounded-xl transition-colors ${
                    !selectedCat
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  همه دسته‌بندی‌ها
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCat(c.slug)}
                    className={`w-full text-right px-3 py-2 rounded-xl transition-colors ${
                      selectedCat === c.slug
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {c.nameFa}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#111722] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <span>تعداد نتایج:</span>
              <strong className="text-slate-900 dark:text-white font-mono">
                {products.length} محصول
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">مرتب‌سازی:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="latest">جدیدترین</option>
                <option value="popular">محبوب‌ترین</option>
                <option value="rating">بالاترین امتیاز</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#111722] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                هیچ محصولی با فیلترهای انتخابی یافت نشد.
              </p>
              <p className="text-xs text-slate-400">
                می‌توانید فیلترها را تغییر دهید یا مستقیماً درخواست مشاوره تلفنی ثبت کنید.
              </p>
              <button
                onClick={() => handleOpenOrder()}
                className="mt-3 px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                ثبت استعلام اختصاصی با کارشناس
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onOpenOrder={(item) => handleOpenOrder(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <VehicleSelectorModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />

      <OrderRequestModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={selectedProductForOrder}
      />

      <ChatbotWidget onOpenOrderModal={() => handleOpenOrder()} />
    </div>
  );
}

export default function ProductsPage() {
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] text-slate-900 dark:text-slate-100">
      <Header
        onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
      />
      <main className="flex-1">
        <Suspense fallback={<div className="p-20 text-center">در حال بارگذاری کاتالوگ...</div>}>
          <ProductsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
