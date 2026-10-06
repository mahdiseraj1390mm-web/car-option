import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { nameFa, nameEn, slug, parentId, description, icon } = await req.json();

    if (!nameFa || !slug) {
      return NextResponse.json(
        { success: false, error: "نام و اسلاگ دسته الزامی است" },
        { status: 400 }
      );
    }

    const newCat = await prisma.category.create({
      data: {
        nameFa,
        nameEn: nameEn || null,
        slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
        parentId: parentId || null,
        description: description || null,
        icon: icon || "Layers",
      },
    });

    return NextResponse.json({ success: true, data: newCat });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "خطا در ایجاد دسته‌بندی" },
      { status: 500 }
    );
  }
}
