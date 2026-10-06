import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: {
          select: {
            id: true,
            titleFa: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Admin reviews error:", error);
    return NextResponse.json({ success: false, error: "خطای سرور" }, { status: 500 });
  }
}
