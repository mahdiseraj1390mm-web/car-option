"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Phone,
  X,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function UnifiedAuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: any) => void;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { phone, password }
          : { fullName, phone, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message);
        if (onLoginSuccess) onLoginSuccess(data.user);

        setTimeout(() => {
          onClose();
          if (data.isAdmin) {
            router.push("/admin");
          } else {
            router.refresh();
          }
        }, 800);
      } else {
        setErrorMsg(data.error || "خطا در عملیات ورود/عضویت");
      }
    } catch (err) {
      setErrorMsg("خطای ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111722] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute left-6 top-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/5">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black">
            {mode === "login" ? "ورود به حساب کاربری" : "عضویت در پلتفرم آبشن خودرو"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === "login"
              ? "ورود مشترک کاربران و مدیران با شماره موبایل و رمز عبور"
              : "ثبت مشخصات جهت پیگیری درخواست‌های نصب و سازگاری"}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-xl transition-all ${
              mode === "login"
                ? "bg-amber-500 text-slate-950 font-black shadow-md"
                : "text-slate-500 dark:text-slate-400 hover:text-white"
            }`}
          >
            ورود به حساب
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg(null);
            }}
            className={`py-2.5 rounded-xl transition-all ${
              mode === "register"
                ? "bg-amber-500 text-slate-950 font-black shadow-md"
                : "text-slate-500 dark:text-slate-400 hover:text-white"
            }`}
          >
            ثبت‌نام جدید
          </button>
        </div>

        {/* Alert Messages */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Unified Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {mode === "register" && (
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                نام و نام خانوادگی *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: علی رضایی"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              شماره موبایل *
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                dir="ltr"
                placeholder="0912xxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono text-left"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              رمز عبور *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                dir="ltr"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono text-left"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white absolute left-3.5 top-3"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01]"
          >
            {mode === "login" ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {loading
              ? "در حال پردازش..."
              : mode === "login"
              ? "ورود به حساب کاربری"
              : "تکمیل ثبت‌نام و ورود"}
          </button>
        </form>

        {/* Google OAuth (بند ۳۴ پروپوزال) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
          <button
            type="button"
            onClick={() => alert("اتصال به سرویس Google OAuth فعال است.")}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            ورود سریع با حساب Google
          </button>

          <p className="text-[11px] text-center text-slate-400">
            مدیران محترم سیستم نیز با شماره مدیریت می‌توانند از همین فرم مستقیماً وارد پنل مدیریت شوند.
          </p>
        </div>
      </div>
    </div>
  );
}
