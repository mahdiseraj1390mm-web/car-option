import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            fullName: true,
            phone: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error("Audit log error:", error);
    return NextResponse.json({ success: false, error: "خطا در دریافت لاگ‌ها" }, { status: 500 });
  }
}
