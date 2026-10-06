"use client";

import React, { useState, useEffect } from "react";
import { Car, ChevronLeft, Search, Filter, ShieldCheck } from "lucide-react";
import { useVehicle } from "@/context/VehicleContext";

export default function HomeVehicleFilter() {
  const { setSelectedVehicle } = useVehicle();
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [selectedModelId, setSelectedModelId] = useState("");
  const [selectedTrimId, setSelectedTrimId] = useState("");
  const [selectedYearId, setSelectedYearId] = useState("");

  useEffect(() => {
    fetch("/api/vehicles")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBrands(data.data);
      })
      .catch(() => {});
  }, []);

  const activeBrand = brands.find((b) => b.id === selectedBrandId);
  const activeModel = activeBrand?.models?.find((m: any) => m.id === selectedModelId);
  const activeTrim = activeModel?.trims?.find((t: any) => t.id === selectedTrimId);

  const handleApplyFilter = () => {
    if (activeBrand && activeModel) {
      setSelectedVehicle({
        brandId: activeBrand.id,
        brandName: activeBrand.nameFa,
        modelId: activeModel.id,
        modelName: activeModel.nameFa,
        trimId: activeTrim?.id,
        trimName: activeTrim?.nameFa,
        yearId: selectedYearId || undefined,
        year: activeTrim?.years?.find((y: any) => y.id === selectedYearId)?.year,
      });

      const params = new URLSearchParams();
      if (activeTrim?.id) params.set("trimId", activeTrim.id);
      if (selectedYearId) params.set("yearId", selectedYearId);
      window.location.href = `/products?${params.toString()}`;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto -mt-16 sm:-mt-20 relative z-30 px-4">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              موتور جستجو و انطباق آبشن با خودروی شما
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              مشخصات خودرو را انتخاب کنید تا آبشن‌های ۱۰۰٪ سازگار با استاندارد فابریک فیلتر شوند
            </p>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Brand */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              ۱. برند خودرو
            </label>
            <select
              value={selectedBrandId}
              onChange={(e) => {
                setSelectedBrandId(e.target.value);
                setSelectedModelId("");
                setSelectedTrimId("");
                setSelectedYearId("");
              }}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-500"
            >
              <option value="">انتخاب برند خودرو...</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nameFa} ({b.nameEn})
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              ۲. مدل خودرو
            </label>
            <select
              disabled={!selectedBrandId}
              value={selectedModelId}
              onChange={(e) => {
                setSelectedModelId(e.target.value);
                setSelectedTrimId("");
                setSelectedYearId("");
              }}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-500 disabled:opacity-50"
            >
              <option value="">انتخاب مدل...</option>
              {activeBrand?.models?.map((m: any) => (
                <option key={m.id} value={m.id}>
                  {m.nameFa}
                </option>
              ))}
            </select>
          </div>

          {/* Trim */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              ۳. تیپ و مشخصات
            </label>
            <select
              disabled={!selectedModelId}
              value={selectedTrimId}
              onChange={(e) => {
                setSelectedTrimId(e.target.value);
                setSelectedYearId("");
              }}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-500 disabled:opacity-50"
            >
              <option value="">همه تیپ‌ها...</option>
              {activeModel?.trims?.map((t: any) => (
                <option key={t.id} value={t.id}>
                  {t.nameFa}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              ۴. سال تولید
            </label>
            <select
              disabled={!selectedTrimId}
              value={selectedYearId}
              onChange={(e) => setSelectedYearId(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-500 disabled:opacity-50"
            >
              <option value="">همه سال‌ها...</option>
              {activeTrim?.years?.map((y: any) => (
                <option key={y.id} value={y.id}>
                  مدل {y.year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>تضمین انطباق کانکتورها و سیم‌کشی فابریک کارخانه</span>
          </div>

          <button
            disabled={!selectedBrandId || !selectedModelId}
            onClick={handleApplyFilter}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Search className="w-4 h-4" />
            مشاهده آبشن‌های سازگار با این خودرو
          </button>
        </div>
      </div>
    </div>
  );
}
