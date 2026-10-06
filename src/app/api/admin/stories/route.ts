import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: stories });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در دریافت استوری‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, mediaUrl, mediaType, linkUrl } = body;

    if (!title || !mediaUrl) {
      return NextResponse.json(
        { success: false, error: "عنوان و فایل مدیا الزامی است" },
        { status: 400 }
      );
    }

    const story = await prisma.story.create({
      data: {
        title,
        mediaUrl,
        mediaType: mediaType || "IMAGE",
        linkUrl: linkUrl || null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: story });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "خطا در ایجاد استوری" },
      { status: 500 }
    );
  }
}
