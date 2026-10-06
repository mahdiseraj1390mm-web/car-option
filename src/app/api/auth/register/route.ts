import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { fullName, phone, password } = await req.json();

    if (!fullName || !phone || !password) {
      return NextResponse.json(
        { success: false, error: "لطفاً تمام فیلدها را تکمیل کنید" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "رمز عبور باید حداقل ۶ کاراکتر باشد" },
        { status: 400 }
      );
    }

    // Check duplicate phone
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

    const newUser = await prisma.user.create({
      data: {
        fullName,
        phone: cleanPhone,
        passwordHash,
        role: "USER",
        isVerified: true,
      },
    });

    const token = signToken({
      userId: newUser.id,
      phone: newUser.phone,
      email: newUser.email,
      role: newUser.role,
      fullName: newUser.fullName,
    });

    const response = NextResponse.json({
      success: true,
      message: "حساب کاربری شما با موفقیت ایجاد شد",
      isAdmin: false,
      redirectTo: "/profile",
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        phone: newUser.phone,
        role: newUser.role,
      },
    });

    response.cookies.set("auth_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ثبت‌نام کاربر" },
      { status: 500 }
    );
  }
}
