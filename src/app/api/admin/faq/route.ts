import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const faqs = await prisma.chatbotFAQ.findMany({
      orderBy: { orderIndex: "asc" },
    });
    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    console.error("Admin FAQ GET error:", error);
    return NextResponse.json({ success: false, error: "خطای سرور" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, answer, keywords, category } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { success: false, error: "سوال و پاسخ الزامی است" },
        { status: 400 }
      );
    }

    const newFaq = await prisma.chatbotFAQ.create({
      data: {
        question,
        answer,
        keywords: keywords || "",
        category: category || "GENERAL",
      },
    });

    return NextResponse.json({ success: true, data: newFaq });
  } catch (error) {
    console.error("Admin FAQ POST error:", error);
    return NextResponse.json({ success: false, error: "خطا در ایجاد سوال" }, { status: 500 });
  }
}
