import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const categorySlug = searchParams.get("category");
    const brandSlug = searchParams.get("brand");
    const trimId = searchParams.get("trimId");
    const yearId = searchParams.get("yearId");
    const isFeatured = searchParams.get("featured") === "true";
    const sortBy = searchParams.get("sort") || "latest";

    // Build Prisma query filters
    const where: any = {};

    if (q) {
      where.OR = [
        { titleFa: { contains: q } },
        { titleEn: { contains: q } },
        { shortDesc: { contains: q } },
        { fullDesc: { contains: q } },
        { sku: { contains: q } },
      ];
    }

    if (isFeatured) {
      where.isFeatured = true;
    }

    if (categorySlug) {
      where.categories = {
        some: {
          category: { slug: categorySlug },
        },
      };
    }

    if (brandSlug) {
      where.brand = { slug: brandSlug };
    }

    // Vehicle compatibility filter (core feature)
    if (trimId || yearId) {
      where.compatibilities = {
        some: {
          ...(trimId ? { trimId } : {}),
          ...(yearId ? { yearId } : {}),
        },
      };
    }

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "popular") orderBy = { viewCount: "desc" };
    if (sortBy === "rating") orderBy = { rating: "desc" };

    const products = await prisma.product.findMany({
      where,
      include: {
        brand: true,
        media: {
          orderBy: { orderIndex: "asc" },
        },
        categories: {
          include: { category: true },
        },
        compatibilities: {
          include: {
            trim: { include: { model: { include: { brand: true } } } },
            year: true,
          },
        },
      },
      orderBy,
    });

    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
