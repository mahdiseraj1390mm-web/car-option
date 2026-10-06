"use client";

import React, { useState } from "react";
import { PhoneCall, X, CheckCircle, ShieldCheck, Clock, Send, MessageCircle } from "lucide-react";
import { useVehicle } from "@/context/VehicleContext";

export default function OrderRequestModal({
  isOpen,
  onClose,
  product,
  packageItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  packageItem?: any;
}) {
  const { selectedVehicle } = useVehicle();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState(
    selectedVehicle
      ? `${selectedVehicle.brandName} ${selectedVehicle.modelName} ${selectedVehicle.trimName || ""} ${selectedVehicle.year ? `مدل ${selectedVehicle.year}` : ""}`.trim()
      : ""
  );
  const [preferredContact, setPreferredContact] = useState("PHONE");
  const [bestTimeToCall, setBestTimeToCall] = useState("صبح (۹ الی ۱۳)");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          productId: product?.id,
          packageId: packageItem?.id,
          vehicleInfo,
          description,
          preferredContact,
          bestTimeToCall,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedCode(data.trackingCode);
      } else {
        setErrorMsg(data.error || "خطا در ثبت درخواست");
      }
    } catch (err) {
      setErrorMsg("خطای ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmittedCode(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111722] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute left-6 top-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedCode ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center ring-8 ring-emerald-500/5">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black">درخواست با موفقیت ثبت شد</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              اطلاعات شما با موفقیت برای کارشناسان فنی ارسال گردید. برای هماهنگی و بررسی دقیق سازگاری قطعه با شما تماس گرفته خواهد شد.
            </p>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 max-w-xs mx-auto">
              <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">کد پیگیری شما:</span>
              <strong className="text-xl font-mono text-amber-500 font-black tracking-widest">
                {submittedCode}
              </strong>
            </div>
            <button
              onClick={handleClose}
              className="mt-4 px-8 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20"
            >
              متوجه شدم و بستن
            </button>
          </div>
        ) : (
          /* Order Form */
          <div>
            <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black">
                  {product
                    ? `استعلام و سفارش ${product.titleFa}`
                    : packageItem
                    ? `درخواست پکیج ${packageItem.titleFa}`
                    : "درخواست مشاوره فنی و استعلام آبشن"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  این پلتفرم بدون پرداخت مستقیم است؛ ارتباط و هماهنگی از طریق کارشناس انجام می‌شود.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="py-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                  نام و نام خانوادگی *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: علیرضا محمدی"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                  شماره موبایل جهت هماهنگی *
                </label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="0912xxxxxxx"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono text-left"
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                  مدل و سال خودرو (جهت بررسی سازگاری فنی)
                </label>
                <input
                  type="text"
                  placeholder="مثال: دنا پلاس توربو اتوماتیک مدل ۱۴۰۳"
                  value={vehicleInfo}
                  onChange={(e) => setVehicleInfo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                    روش ارتباط ترجیحی
                  </label>
                  <select
                    value={preferredContact}
                    onChange={(e) => setPreferredContact(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="PHONE">تماس تلفنی</option>
                    <option value="TELEGRAM">پیام در تلگرام</option>
                    <option value="EITAA">پیام در ایتا</option>
                    <option value="WHATSAPP">پیام در واتساپ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                    بهترین زمان تماس
                  </label>
                  <select
                    value={bestTimeToCall}
                    onChange={(e) => setBestTimeToCall(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="صبح (۹ الی ۱۳)">صبح (۹ الی ۱۳)</option>
                    <option value="عصر (۱۴ الی ۱۹)">عصر (۱۴ الی ۱۹)</option>
                    <option value="شب (۱۹ الی ۲۱)">شب (۱۹ الی ۲۱)</option>
                    <option value="هر زمان">در اولین فرصت ممکن</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                  توضیحات یا سوالات فنی (اختیاری)
                </label>
                <textarea
                  rows={2}
                  placeholder="آیا نیاز به نصب در محل دارید یا سوال خاصی درباره گارانتی دارید؟"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "در حال ثبت درخواست..." : "ارسال درخواست و دریافت کد پیگیری"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
