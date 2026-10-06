"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Wrench,
  PhoneCall,
  Check,
  CheckCircle,
  Car,
  ChevronLeft,
  Share2,
  Cpu,
  Layers,
  ArrowRight,
  MessageSquare,
  Mic,
  Volume2,
  Star,
  Send,
  User,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderRequestModal from "@/components/OrderRequestModal";
import VehicleSelectorModal from "@/components/VehicleSelectorModal";
import ChatbotWidget from "@/components/ChatbotWidget";
import { useVehicle } from "@/context/VehicleContext";

export default function ProductDetailClient({
  product,
  specsObj,
  featuresArr,
}: {
  product: any;
  specsObj: Record<string, string>;
  featuresArr: string[];
}) {
  const { selectedVehicle } = useVehicle();
  const [selectedImage, setSelectedImage] = useState(
    product.media?.[0]?.url ||
      "https://images.unsplash.com/photo-1541348263662-e0c82661210e?auto=format&fit=crop&w=1000&q=80"
  );
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  // Reviews state & form
  const [reviewsList, setReviewsList] = useState<any[]>(product.reviews || []);
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState("");
  const [newComment, setNewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: newRating,
          comment: newComment,
          authorName: newAuthor.trim() || "مشتری پلتفرم",
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setReviewsList([data.data, ...reviewsList]);
        setNewComment("");
        setNewAuthor("");
        setNewRating(5);
        setReviewSuccess("دیدگاه شما با موفقیت ثبت و تایید گردید.");
        setTimeout(() => setReviewSuccess(null), 4000);
      }
    } catch (err) {
      alert("خطا در ثبت دیدگاه");
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Check compatibility with user's selected vehicle
  const isCompatibleWithUser = selectedVehicle
    ? product.compatibilities?.some(
        (c: any) =>
          c.trim?.modelId === selectedVehicle.modelId ||
          c.trimId === selectedVehicle.trimId
      )
    : false;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F15] text-slate-900 dark:text-slate-100">
      <Header
        onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-amber-500">
            صفحه اصلی
          </Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-amber-500">
            محصولات
          </Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-slate-200 font-bold truncate">
            {product.titleFa}
          </span>
        </div>

        {/* Top Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Gallery Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative w-full h-[380px] sm:h-[440px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl">
              <img
                src={selectedImage}
                alt={product.titleFa}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow-lg">
                  {product.brand?.nameFa || "OEM"}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {product.media && product.media.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.media.map((m: any) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedImage(m.url)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === m.url
                        ? "border-amber-500 ring-2 ring-amber-500/30"
                        : "border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={m.url} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  SKU: {product.sku || "OPT-OEM"}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  تجهیز فابریک کارخانه
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-snug">
                {product.titleFa}
              </h1>

              {product.titleEn && (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                  {product.titleEn}
                </p>
              )}
            </div>

            {/* Short Desc */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.shortDesc}
            </p>

            {/* Vehicle Compatibility Status Card */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Car className="w-4 h-4 text-amber-500" />
                  وضعیت سازگاری با خودرو
                </span>
                {selectedVehicle ? (
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isCompatibleWithUser
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {isCompatibleWithUser ? "۱۰۰٪ سازگار" : "نیازمند استعلام تیپ"}
                  </span>
                ) : (
                  <button
                    onClick={() => setIsVehicleModalOpen(true)}
                    className="text-xs text-amber-500 font-bold hover:underline"
                  >
                    + انتخاب خودروی من برای بررسی
                  </button>
                )}
              </div>

              {selectedVehicle && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  خودروی شما:{" "}
                  <strong className="text-slate-900 dark:text-white">
                    {selectedVehicle.brandName} {selectedVehicle.modelName}
                  </strong>
                </p>
              )}
            </div>

            {/* Expert Audio Voice Overview */}
            {product.media?.find((m: any) => m.type === "VOICE" || m.type === "AUDIO") && (
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 space-y-3 shadow-lg shadow-amber-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-amber-400">
                        توضیحات صوتی کارشناس فنی خودرو
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        بررسی اختصاصی ویژگی‌ها، سیم‌کشی فابریک و عملکرد آپشن
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                    Audio Note
                  </span>
                </div>

                <div className="pt-1">
                  <audio
                    controls
                    src={
                      product.media?.find((m: any) => m.type === "VOICE" || m.type === "AUDIO")?.url
                    }
                    className="w-full h-10"
                  />
                </div>
              </div>
            )}

            {/* Highlights List */}
            {featuresArr.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500">ویژگی‌های برجسته مهندسی:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {featuresArr.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warranty & Installation Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="block text-slate-900 dark:text-white font-bold mb-0.5">
                    گارانتی قطعه
                  </strong>
                  <span className="text-slate-500 dark:text-slate-400">
                    {product.warranty || "گارانتی تعویض کتبی طلایی"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <Wrench className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="block text-slate-900 dark:text-white font-bold mb-0.5">
                    روش نصب
                  </strong>
                  <span className="text-slate-500 dark:text-slate-400">
                    {product.installation || "نصب سوکت به سوکت بدون تداخل در سیم‌کشی"}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Status & Lead Generation CTA (No Cart) */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs text-slate-400">وضعیت قیمت و عرضه:</span>
                  {product.priceStatus === "SHOW_PRICE" && product.price ? (
                    <div className="flex items-baseline gap-1 font-mono mt-1">
                      <span className="text-2xl font-black text-amber-400">
                        {product.price.toLocaleString("fa-IR")}
                      </span>
                      <span className="text-xs text-slate-400">تومان</span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-amber-400 mt-1 block">
                      استعلام قیمت فنی بر اساس مدل و سال
                    </span>
                  )}
                </div>

                <div className="text-left text-xs text-slate-400">
                  <span>وضعیت انبار:</span>
                  <span className="text-emerald-400 font-bold block">موجود جهت نصب و تحویل</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  درخواست استعلام و سفارش قطعه
                </button>

                <Link
                  href="/chat"
                  className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  گفتگوی آنلاین با کارشناس
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <section className="p-8 rounded-3xl bg-white dark:bg-[#111722] border border-slate-200 dark:border-slate-800 space-y-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-500" />
            مشخصات فنی و استانداردهای مهندسی
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            {Object.entries(specsObj).map(([key, val], idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80"
              >
                <span className="text-slate-500 dark:text-slate-400 font-medium">{key}</span>
                <strong className="text-slate-900 dark:text-white font-mono">{val}</strong>
              </div>
            ))}
          </div>
        </section>

        {/* Vehicle Compatibility Matrix (بند ۱۱) */}
        <section className="p-8 rounded-3xl bg-white dark:bg-[#111722] border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-amber-500" />
              ماتریس خودروهای سازگار با این آبشن
            </h2>
            <span className="text-xs text-slate-500">
              تایید شده توسط آزمایشگاه مهندسی خودرو
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.compatibilities?.map((c: any) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-slate-900 dark:text-white">
                    {c.trim?.model?.brand?.nameFa} {c.trim?.model?.nameFa}
                  </strong>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                    سازگاری کامل
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  <span>تیپ: </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {c.trim?.nameFa || "تمامی تیپ‌ها"}
                  </span>
                  {c.year && (
                    <span className="mr-2 font-mono text-amber-500">مدل {c.year.year}</span>
                  )}
                </div>
                {c.notes && (
                  <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-2">
                    {c.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Customer Reviews & Technical Q&A Section */}
        <section className="p-8 rounded-3xl bg-white dark:bg-[#111722] border border-slate-200 dark:border-slate-800 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                دیدگاه‌ها و تجربیات مشتریان
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                نظرات تایید شده مشتریانی که این قطعه را روی خودروی خود تجهیز کرده‌اند
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-black font-mono text-amber-500">
                {reviewsList.length > 0
                  ? (
                      reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0) /
                      reviewsList.length
                    ).toFixed(1)
                  : "۵.۰"}
              </span>
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs text-slate-400 mr-1 font-mono">
                ({reviewsList.length} دیدگاه)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {reviewsList.length > 0 ? (
                reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                            {rev.authorName || rev.user?.fullName || "مشتری پلتفرم"}
                          </strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(rev.createdAt).toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((st) => (
                          <Star
                            key={st}
                            className={`w-3.5 h-3.5 ${
                              st <= (rev.rating || 5)
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-300 dark:text-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rev.comment}
                    </p>

                    {rev.isVerifiedCustomer && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        <Check className="w-3 h-3" />
                        نصب شده و تایید شده
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                  هنوز دیدگاهی برای این محصول ثبت نشده است. اولین نفری باشید که تجربه خود را به اشتراک می‌گذارید!
                </div>
              )}
            </div>

            {/* Submit Review Form (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-500" />
                ثبت تجربه یا سوال فنی درباره این محصول
              </h3>

              {reviewSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{reviewSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">امتیاز کیفی شما به این قطعه:</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setNewRating(starVal)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            starVal <= newRating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300 dark:text-slate-700"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="font-mono text-amber-400 font-bold mr-2">
                      {newRating} از ۵
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">نام شما (اختیاری):</label>
                  <input
                    type="text"
                    placeholder="مثال: مهندس رضوانی"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">متن دیدگاه یا بررسی عملکرد قطعه *:</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="کیفیت ساخت، سهولت نصب، عملکرد کلیدها و سیم‌کشی..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {reviewSubmitting ? "در حال ثبت..." : "ارسال دیدگاه تخصصی"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <OrderRequestModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={product}
      />

      <VehicleSelectorModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
      />

      <ChatbotWidget onOpenOrderModal={() => setIsOrderModalOpen(true)} />
    </div>
  );
}
