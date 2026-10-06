import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ success: true, authenticated: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 500 });
  }
}
