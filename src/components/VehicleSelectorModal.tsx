"use client";

import React, { useState, useEffect } from "react";
import { Car, X, Check, ChevronLeft, RefreshCcw } from "lucide-react";
import { useVehicle } from "@/context/VehicleContext";

export default function VehicleSelectorModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { selectedVehicle, setSelectedVehicle, clearVehicle } = useVehicle();
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [selectedTrim, setSelectedTrim] = useState<any | null>(null);
  const [selectedYear, setSelectedYear] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/vehicles")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setBrands(data.data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (selectedBrand && selectedModel) {
      setSelectedVehicle({
        brandId: selectedBrand.id,
        brandName: selectedBrand.nameFa,
        modelId: selectedModel.id,
        modelName: selectedModel.nameFa,
        trimId: selectedTrim?.id,
        trimName: selectedTrim?.nameFa,
        yearId: selectedYear?.id,
        year: selectedYear?.year,
      });
      onClose();
    }
  };

  const handleReset = () => {
    clearVehicle();
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedTrim(null);
    setSelectedYear(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111722] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black">انتخاب خودروی من</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                با انتخاب خودرو، تمام آبشن‌های سازگار و شرایط نصب فیلتر می‌شوند
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Selected Summary */}
        {selectedVehicle && (
          <div className="my-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Check className="w-4 h-4 text-amber-500" />
              <span>خودروی ذخیره شده فعلی:</span>
              <strong className="text-amber-500 font-bold">
                {selectedVehicle.brandName} - {selectedVehicle.modelName}
                {selectedVehicle.trimName ? ` (${selectedVehicle.trimName})` : ""}
                {selectedVehicle.year ? ` - مدل ${selectedVehicle.year}` : ""}
              </strong>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-rose-500 hover:underline flex items-center gap-1"
            >
              <RefreshCcw className="w-3 h-3" />
              حذف انتخاب
            </button>
          </div>
        )}

        {/* Step-by-step Selection */}
        <div className="py-4 space-y-5">
          {/* 1. Brand Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              ۱. برند خودرو
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBrand(b);
                    setSelectedModel(null);
                    setSelectedTrim(null);
                    setSelectedYear(null);
                  }}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold text-center transition-all ${
                    selectedBrand?.id === b.id
                      ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400"
                  }`}
                >
                  {b.nameFa}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Model Selection */}
          {selectedBrand && (
            <div className="animate-fadeIn">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                ۲. مدل خودرو ({selectedBrand.nameFa})
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {selectedBrand.models?.map((m: any) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModel(m);
                      setSelectedTrim(null);
                      setSelectedYear(null);
                    }}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold text-center transition-all ${
                      selectedModel?.id === m.id
                        ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-400"
                    }`}
                  >
                    {m.nameFa}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Trim Selection */}
          {selectedModel && selectedModel.trims?.length > 0 && (
            <div className="animate-fadeIn">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                ۳. تیپ و مشخصات
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedModel.trims.map((t: any) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTrim(t);
                      setSelectedYear(null);
                    }}
                    className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                      selectedTrim?.id === t.id
                        ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-400"
                    }`}
                  >
                    {t.nameFa}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Year Selection */}
          {selectedTrim && selectedTrim.years?.length > 0 && (
            <div className="animate-fadeIn">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                ۴. سال تولید خودرو
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedTrim.years.map((y: any) => (
                  <button
                    key={y.id}
                    onClick={() => setSelectedYear(y)}
                    className={`px-4 py-2 rounded-xl border text-xs font-semibold font-mono transition-all ${
                      selectedYear?.id === y.id
                        ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-400"
                    }`}
                  >
                    مدل {y.year}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            انصراف
          </button>
          <button
            disabled={!selectedModel}
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-amber-500 disabled:opacity-50 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/25 hover:bg-amber-400 transition-all"
          >
            تایید و مشاهده آبشن‌های سازگار
          </button>
        </div>
      </div>
    </div>
  );
}
