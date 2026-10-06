"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, PhoneCall, Check, ArrowRight, Eye, Scale } from "lucide-react";
import { useVehicle } from "@/context/VehicleContext";

export default function ProductCard({
  product,
  onOpenOrder,
}: {
  product: any;
  onOpenOrder: (product: any) => void;
}) {
  const { selectedVehicle } = useVehicle();
  const primaryMedia =
    product.media?.find((m: any) => m.isPrimary)?.url ||
    product.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1541348263662-e0c82661210e?auto=format&fit=crop&w=600&q=80";

  // Check if compatible with user's selected vehicle
  const isCompatible = selectedVehicle
    ? product.compatibilities?.some(
        (c: any) =>
          c.trim?.modelId === selectedVehicle.modelId ||
          c.trimId === selectedVehicle.trimId
      )
    : false;

  return (
    <div className="group relative bg-white dark:bg-[#111722] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl dark:hover:shadow-amber-500/5 flex flex-col justify-between">
      {/* Top Media & Badges */}
      <div>
        <div className="relative w-full h-52 overflow-hidden bg-slate-950">
          <img
            src={primaryMedia}
            alt={product.titleFa}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            {product.isFeatured && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow-md">
                پیشنهاد مهندسی
              </span>
            )}
            {selectedVehicle && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md ${
                  isCompatible
                    ? "bg-emerald-500 text-slate-950 flex items-center gap-1"
                    : "bg-slate-800/90 text-slate-300"
                }`}
              >
                {isCompatible ? (
                  <>
                    <Check className="w-3 h-3" />
                    سازگار با {selectedVehicle.modelName}
                  </>
                ) : (
                  "نیاز به بررسی سازگاری"
                )}
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/60 text-slate-300 backdrop-blur-sm">
              {product.brand?.nameFa || "OEM"}
            </span>
          </div>
        </div>

        {/* Content Info */}
        <div className="p-5 space-y-3">
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2 leading-snug">
              {product.titleFa}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.shortDesc}
          </p>

          {/* Guarantee / Warranty Tag */}
          {product.warranty && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{product.warranty}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer & Order Action */}
      <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-2 space-y-3">
        {/* Price Status */}
        <div className="flex items-center justify-between pt-3">
          <span className="text-[11px] text-slate-400">وضعیت استعلام:</span>
          <div>
            {product.priceStatus === "SHOW_PRICE" && product.price ? (
              <div className="text-left font-mono">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {product.price.toLocaleString("fa-IR")}
                </span>
                <span className="text-[10px] text-slate-400 mr-1">تومان</span>
              </div>
            ) : product.priceStatus === "INQUIRY" ? (
              <span className="text-xs font-bold text-amber-500 px-2 py-0.5 rounded bg-amber-500/10">
                استعلام قیمت فنی
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                تماس و هماهنگی
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons (Request Lead - NO CART) */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-400 text-slate-700 dark:text-slate-300 text-xs font-bold text-center flex items-center justify-center gap-1 transition-colors"
          >
            جزئیات فنی
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </Link>

          <button
            onClick={() => onOpenOrder(product)}
            className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            درخواست سفارش
          </button>
        </div>
      </div>
    </div>
  );
}
