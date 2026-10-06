import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: "شماره موبایل و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    // Find admin by phone or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ phone }, { email: phone }],
        role: "ADMIN",
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: "شماره موبایل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "شماره موبایل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      phone: user.phone,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "ADMIN_LOGIN",
        resource: "Auth",
        details: JSON.stringify({ phone: user.phone }),
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "ورود به پنل مدیریت موفقیت‌آمیز بود",
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در فرآیند احراز هویت ادمین" },
      { status: 500 }
    );
  }
}
