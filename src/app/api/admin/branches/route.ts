import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ success: true, data: branches });
  } catch (error) {
    console.error("Admin branch GET error:", error);
    return NextResponse.json({ success: false, error: "خطای سرور" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, address, phone, mapUrl, services } = body;

    if (!name || !address || !phone) {
      return NextResponse.json(
        { success: false, error: "نام شعبه، آدرس و تلفن الزامی است" },
        { status: 400 }
      );
    }

    const branch = await prisma.branch.create({
      data: {
        name,
        address,
        phone,
        mapUrl: mapUrl || "",
        services: services || "",
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: branch });
  } catch (error) {
    console.error("Admin branch POST error:", error);
    return NextResponse.json({ success: false, error: "خطا در ایجاد شعبه" }, { status: 500 });
  }
}
