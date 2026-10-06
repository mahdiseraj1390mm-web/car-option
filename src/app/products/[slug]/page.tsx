import React from "react";
import { notFound } from "next/navigation";
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
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
  if (!product) return { title: "محصول یافت نشد" };
  return {
    title: `${product.titleFa} | پلتفرم تخصصی آبشن خودرو`,
    description: product.shortDesc || "مشخصات فنی و استعلام آبشن فابریک خودرو",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      brand: true,
      media: { orderBy: { orderIndex: "asc" } },
      compatibilities: {
        include: {
          trim: {
            include: {
              model: {
                include: { brand: true },
              },
            },
          },
          year: true,
        },
      },
      categories: {
        include: { category: true },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Parse specs and features safely
  let specsObj: Record<string, string> = {};
  let featuresArr: string[] = [];

  try {
    if (product.specs) specsObj = JSON.parse(product.specs);
    if (product.features) featuresArr = JSON.parse(product.features);
  } catch (e) {}

  return (
    <ProductDetailClient
      product={product}
      specsObj={specsObj}
      featuresArr={featuresArr}
    />
  );
}
