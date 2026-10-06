import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { fullName, phone, password, role } = await req.json();

    if (!fullName || !phone || !password) {
      return NextResponse.json(
        { success: false, error: "نام، شماره موبایل و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();

    const existing = await prisma.user.findFirst({
      where: { phone: cleanPhone },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "این شماره موبایل قبلاً در سیستم ثبت شده است" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.create({
      data: {
        fullName,
        phone: cleanPhone,
        passwordHash,
        role: "ADMIN",
        isVerified: true,
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: "CREATE_ADMIN",
        resource: "User",
        details: JSON.stringify({
          adminId: newAdmin.id,
          phone: cleanPhone,
          role: role || "ADMIN",
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "مدیر جدید با موفقیت ایجاد شد",
      data: newAdmin,
    });
  } catch (error: any) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ایجاد ادمین" },
      { status: 500 }
    );
  }
}
