import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      include: {
        attachments: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در دریافت پیام‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { conversationId, content, audioUrl } = await req.json();

    const reply = await prisma.message.create({
      data: {
        conversationId: conversationId || "general-support",
        senderType: "ADMIN",
        senderId: "super-admin",
        senderName: "مدیریت ارشد",
        content: content || null,
        attachments: audioUrl
          ? {
              create: {
                fileUrl: audioUrl,
                fileType: "VOICE",
                fileName: "admin-voice.webm",
              },
            }
          : undefined,
      },
      include: {
        attachments: true,
      },
    });

    return NextResponse.json({ success: true, data: reply });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در ارسال پاسخ ادمین" },
      { status: 500 }
    );
  }
}
