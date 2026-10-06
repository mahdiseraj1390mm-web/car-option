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

    const cleanPhone = phone.trim();

    // Find user by phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ phone: cleanPhone }, { email: cleanPhone }],
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: "حسابی با این مشخصات یافت نشد یا رمز عبور اشتباه است" },
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

    // Check if user is blocked
    if (user.isBlocked) {
      return NextResponse.json(
        { success: false, error: "حساب کاربری شما توسط مدیریت مسدود شده است" },
        { status: 403 }
      );
    }

    // Sign session token
    const token = signToken({
      userId: user.id,
      phone: user.phone,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    const isAdmin = user.role === "ADMIN";

    // Create Audit Log (wrapped safely)
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: isAdmin ? "ADMIN_LOGIN" : "USER_LOGIN",
          resource: "Auth",
          details: JSON.stringify({ phone: user.phone, role: user.role }),
        },
      });
    } catch (auditErr) {
      console.warn("Audit log creation skipped:", auditErr);
    }

    const response = NextResponse.json({
      success: true,
      message: isAdmin ? "ورود به عنوان مدیر سیستم" : "ورود موفقیت‌آمیز بود",
      isAdmin,
      redirectTo: isAdmin ? "/admin" : "/profile",
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });

    // Set unified auth cookie
    response.cookies.set("auth_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    // Also set admin session cookie for compatibility
    if (isAdmin) {
      response.cookies.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "خطا در سرور ورود" },
      { status: 500 }
    );
  }
}
