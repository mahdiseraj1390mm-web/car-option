"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Camera, Upload, Sparkles, Check, ArrowRight, PhoneCall, RefreshCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import VehicleSelectorModal from "@/components/VehicleSelectorModal";
import OrderRequestModal from "@/components/OrderRequestModal";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function ImageSearchPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any | null>(null);

  // Modals
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<any | null>(null);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    performSearch(file);
  };

  const performSearch = async (file: File) => {
    setIsSearching(true);
    setResults([]);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/search/image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setResults(data.results);
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] text-slate-900 dark:text-slate-100">
      <Header
        onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">
            <Camera className="w-4 h-4" />
            سیستم تطبیق هوشمند بصری قطعات
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            جستجوی آبشن با تصویر
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            عکس قطعه، مانیتور، دوربین یا کلیدهای فرمان خودروی خود را آپلود کنید تا سیستم آبشن‌های مشابه و سازگار را پیدا کند.
          </p>
        </div>

        {/* Upload Dropzone */}
        <div className="max-w-xl mx-auto">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
            }}
            className="p-8 sm:p-12 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111722] hover:border-amber-500 transition-colors text-center space-y-4"
          >
            {previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Uploaded"
                  className="w-48 h-48 mx-auto object-cover rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setResults([]);
                    setAnalysis(null);
                  }}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1 mx-auto"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  آپلود تصویر دیگر
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <label className="cursor-pointer px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-block shadow-lg shadow-amber-500/20">
                    انتخاب تصویر از گالری / دوربین
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
                      }}
                    />
                  </label>
                  <span className="block text-xs text-slate-400 mt-2">
                    یا عکس قطعه را اینجا بکشید و رها کنید
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="text-center py-10 space-y-3">
            <Sparkles className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-sm font-bold">هوش مصنوعی در حال آنالیز ویژگی‌های بصری و تطابق با کاتالوگ آبشن‌ها است...</p>
          </div>
        )}

        {/* Analysis Details */}
        {analysis && (
          <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400">الگوی تشخیص داده شده: </span>
              <strong className="text-amber-500 font-bold">
                {analysis.detectedKeywords.join(" • ")}
              </strong>
            </div>
            <span className="font-mono text-emerald-500 font-bold">
              تطابق: {(analysis.confidence * 100).toFixed(0)}%
            </span>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white border-r-2 border-amber-500 pr-3">
              آبشن‌های مطابق با تصویر شما:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenOrder={(p) => {
                    setSelectedProductForOrder(p);
                    setIsOrderModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      <OrderRequestModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={selectedProductForOrder}
      />

      <VehicleSelectorModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />

      <ChatbotWidget onOpenOrderModal={() => setIsOrderModalOpen(true)} />
    </div>
  );
}
