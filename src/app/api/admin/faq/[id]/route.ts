import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await prisma.chatbotFAQ.update({
      where: { id: params.id },
      data: {
        ...(body.question && { question: body.question }),
        ...(body.answer && { answer: body.answer }),
        ...(body.keywords !== undefined && { keywords: body.keywords }),
        ...(body.category && { category: body.category }),
      },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Admin FAQ update error:", error);
    return NextResponse.json({ success: false, error: "خطا در بروزرسانی" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.chatbotFAQ.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin FAQ delete error:", error);
    return NextResponse.json({ success: false, error: "خطا در حذف" }, { status: 500 });
  }
}
