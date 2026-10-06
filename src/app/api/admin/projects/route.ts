import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در دریافت پروژه‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, vehicleName, description, coverImage, beforeImage, afterImage } = body;

    if (!title || !vehicleName || !coverImage) {
      return NextResponse.json(
        { success: false, error: "عنوان، نام خودرو و تصویر اصلی الزامی است" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug: (slug || title).trim().toLowerCase().replace(/\s+/g, "-"),
        vehicleName,
        description: description || null,
        coverImage,
        beforeImage: beforeImage || null,
        afterImage: afterImage || null,
      },
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "خطا در ثبت پروژه نصب" },
      { status: 500 }
    );
  }
}
