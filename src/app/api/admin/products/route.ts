import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      titleFa,
      titleEn,
      slug,
      sku,
      shortDesc,
      fullDesc,
      priceStatus,
      price,
      stockStatus,
      warranty,
      installation,
      categoryId,
      imageUrl,
      audioUrl,
      voiceUrl,
    } = body;

    if (!titleFa || !slug) {
      return NextResponse.json(
        { success: false, error: "عنوان محصول و اسلاگ الزامی است" },
        { status: 400 }
      );
    }

    const mediaList: { url: string; type: string; isPrimary: boolean; title?: string }[] = [];
    if (imageUrl) {
      mediaList.push({
        url: imageUrl,
        type: "IMAGE",
        isPrimary: true,
        title: titleFa,
      });
    }
    const finalAudio = audioUrl || voiceUrl;
    if (finalAudio) {
      mediaList.push({
        url: finalAudio,
        type: "VOICE",
        isPrimary: false,
        title: "توضیحات صوتی کارشناس",
      });
    }

    const newProduct = await prisma.product.create({
      data: {
        titleFa,
        titleEn: titleEn || null,
        slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
        sku: sku || `OPT-${Math.floor(1000 + Math.random() * 9000)}`,
        shortDesc: shortDesc || null,
        fullDesc: fullDesc || null,
        priceStatus: priceStatus || "INQUIRY",
        price: price ? parseFloat(price) : null,
        stockStatus: stockStatus || "AVAILABLE",
        warranty: warranty || "گارانتی طلایی تعویض",
        installation: installation || "نصب سوکت فابریک",
        categories: categoryId
          ? {
              create: {
                categoryId,
              },
            }
          : undefined,
        media:
          mediaList.length > 0
            ? {
                create: mediaList,
              }
            : undefined,
      },
      include: {
        media: true,
        categories: { include: { category: true } },
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: "CREATE_PRODUCT",
        resource: "Product",
        details: JSON.stringify({ id: newProduct.id, title: newProduct.titleFa }),
      },
    });

    return NextResponse.json({ success: true, data: newProduct });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "خطا در ایجاد محصول" },
      { status: 500 }
    );
  }
}
