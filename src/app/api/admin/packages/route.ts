import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: packages });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در دریافت پکیج‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { titleFa, slug, description, image, priceStatus, price } = body;

    if (!titleFa) {
      return NextResponse.json(
        { success: false, error: "عنوان پکیج الزامی است" },
        { status: 400 }
      );
    }

    const pkg = await prisma.package.create({
      data: {
        titleFa,
        slug: (slug || titleFa).trim().toLowerCase().replace(/\s+/g, "-"),
        description: description || null,
        image: image || null,
        priceStatus: priceStatus || "INQUIRY",
        price: price ? parseFloat(price) : null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: pkg });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "خطا در ایجاد پکیج" },
      { status: 500 }
    );
  }
}
