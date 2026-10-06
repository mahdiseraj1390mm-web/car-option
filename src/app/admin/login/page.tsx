"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Phone, ShieldCheck, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("09121111111");
  const [password, setPassword] = useState("Admin@123456");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setErrorMsg(data.error || "اطلاعات ورود اشتباه است.");
      }
    } catch (err) {
      setErrorMsg("خطای برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F15] text-slate-100 flex items-center justify-center p-4 selection:bg-amber-500 selection:text-slate-950">
      <div className="w-full max-w-md bg-[#111722] border border-slate-800 rounded-3xl p-8 shadow-2xl relative space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-500 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به سایت اصلی
        </Link>

        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/5">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            ورود به پنل مدیریت آبشن خودرو
          </h1>
          <p className="text-xs text-slate-400">
            احراز هویت دومرحله‌ای و کنترل اختصاصی مدیران
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              شماره موبایل مدیریت
            </label>
            <div className="relative">
              <input
                type="text"
                required
                dir="ltr"
                placeholder="0912xxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-mono text-left"
              />
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              رمز عبور اختصاصی
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                dir="ltr"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500 font-mono text-left"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-300 absolute left-3.5 top-3.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-95"
          >
            <Lock className="w-4 h-4" />
            {loading ? "در حال اعتبارسنجی..." : "ورود به کنترل‌پنل مدیریت"}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 text-center">
          <span className="text-[11px] text-slate-500">
            کلیه تلاش‌های ورود در سامانه Audit Log امنیتی ثبت می‌شود.
          </span>
        </div>
      </div>
    </div>
  );
}
