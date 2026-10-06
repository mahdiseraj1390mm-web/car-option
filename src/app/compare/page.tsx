"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Scale, PhoneCall, ShieldCheck, Check, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleSelectorModal from "@/components/VehicleSelectorModal";
import OrderRequestModal from "@/components/OrderRequestModal";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function ComparePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data.length >= 2) {
          setProducts(res.data.slice(0, 3));
        }
      });
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
            <Scale className="w-4 h-4" />
            بررسی و تحلیل فنی
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            مقایسه تخصصی آبشن‌های خودرو
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            بررسی مشخصات، استانداردهای نصب و انطباق قطعات کنار یکدیگر
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111722] overflow-x-auto shadow-xl">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="p-5 font-black text-slate-400 w-1/4">ویژگی / عنوان آبشن</th>
                {products.map((p) => (
                  <th key={p.id} className="p-5 font-black text-slate-900 dark:text-white text-center">
                    <img
                      src={p.media?.[0]?.url}
                      alt={p.titleFa}
                      className="w-24 h-24 mx-auto object-cover rounded-xl mb-2"
                    />
                    <span className="line-clamp-2">{p.titleFa}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="p-5 font-bold text-slate-500">برند تولیدکننده</td>
                {products.map((p) => (
                  <td key={p.id} className="p-5 text-center font-bold text-amber-500">
                    {p.brand?.nameFa || "OEM"}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-5 font-bold text-slate-500">وضعیت استعلام / قیمت</td>
                {products.map((p) => (
                  <td key={p.id} className="p-5 text-center">
                    {p.priceStatus === "SHOW_PRICE" && p.price ? (
                      <span className="font-mono font-bold text-emerald-400">
                        {p.price.toLocaleString("fa-IR")} تومان
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 font-bold text-xs">
                        استعلام قیمت فنی
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-5 font-bold text-slate-500">گارانتی و ضمانت تعویض</td>
                {products.map((p) => (
                  <td key={p.id} className="p-5 text-center text-xs text-slate-400">
                    {p.warranty || "گارانتی طلایی تعویض"}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-5 font-bold text-slate-500">نوع و روش نصب</td>
                {products.map((p) => (
                  <td key={p.id} className="p-5 text-center text-xs text-slate-400">
                    {p.installation || "سوکت فابریک بدون سیم‌کشی"}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-5 font-bold text-slate-500">اقدام و ثبت درخواست</td>
                {products.map((p) => (
                  <td key={p.id} className="p-5 text-center">
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setIsOrderModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                    >
                      درخواست استعلام
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
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
        product={selectedProduct}
      />

      <ChatbotWidget onOpenOrderModal={() => setIsOrderModalOpen(true)} />
    </div>
  );
}
