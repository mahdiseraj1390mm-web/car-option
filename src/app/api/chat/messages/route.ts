import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { conversationId, senderType, senderId, senderName, content, attachments } =
      await req.json();

    if (!conversationId || (!content && (!attachments || attachments.length === 0))) {
      return NextResponse.json(
        { success: false, error: "پارامترهای پیام ناقص است" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderType: senderType || "USER",
        senderId: senderId || "guest",
        senderName: senderName || "کاربر مهمان",
        content: content || null,
        attachments: {
          create: (attachments || []).map((att: any) => ({
            fileUrl: att.fileUrl,
            fileType: att.fileType, // IMAGE, VIDEO, VOICE, DOCUMENT
            fileName: att.fileName || null,
            fileSize: att.fileSize || null,
            duration: att.duration || null,
          })),
        },
      },
      include: {
        attachments: true,
      },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("Chat message error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ارسال پیام" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: "شناسه گفتگو الزامی است" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: { attachments: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در دریافت پیام‌ها" },
      { status: 500 }
    );
  }
}
