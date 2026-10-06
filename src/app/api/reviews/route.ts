import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "شناسه محصول الزامی است" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      include: {
        user: { select: { fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "خطا در دریافت نظرات" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, rating, comment, authorName, userId } = body;

    if (!productId || !comment) {
      return NextResponse.json(
        { success: false, error: "شناسه محصول و متن دیدگاه الزامی است" },
        { status: 400 }
      );
    }

    const newReview = await prisma.review.create({
      data: {
        productId,
        rating: rating ? parseInt(rating) : 5,
        comment,
        authorName: authorName || "کاربر پلتفرم",
        userId: userId || null,
        isVerifiedCustomer: true,
        isApproved: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "دیدگاه شما با موفقیت ثبت شد",
      data: newReview,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "خطا در ثبت نظر" },
      { status: 500 }
    );
  }
}
