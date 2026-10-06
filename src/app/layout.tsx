import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { VehicleProvider } from "@/context/VehicleContext";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B0F15",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "پلتفرم تخصصی مهندسی و تجهیز آبشن خودرو | Car Option Luxury",
  description:
    "مرکز تخصصی مشاوره، بررسی سازگاری و درخواست سفارش آبشن‌های فابریک خودرو شامل کروز کنترل، مانیتورهای اندروید، دوربین ۳۶۰ درجه و کلاچ اتوماتیک بدون تداخل در سیم‌کشی",
  keywords: [
    "آبشن خودرو",
    "کروز کنترل دنا پلاس",
    "مانیتور اندروید تارا",
    "دوربین ۳۶۰ درجه خودرو",
    "تجهیزات فابریک خودرو",
    "کلاچ اتوماتیک",
  ],
  authors: [{ name: "Car Option Engineering Group" }],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#F8FAFC] dark:bg-[#0B0F15] text-slate-900 dark:text-slate-100 min-h-screen selection:bg-amber-500 selection:text-slate-950">
        <ThemeProvider>
          <VehicleProvider>{children}</VehicleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
