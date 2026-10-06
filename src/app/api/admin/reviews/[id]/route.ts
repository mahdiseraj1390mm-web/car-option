import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await prisma.review.update({
      where: { id: params.id },
      data: {
        ...(typeof body.isApproved === "boolean" && { isApproved: body.isApproved }),
        ...(typeof body.isVerifiedCustomer === "boolean" && { isVerifiedCustomer: body.isVerifiedCustomer }),
      },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Admin review update error:", error);
    return NextResponse.json({ success: false, error: "خطا در بروزرسانی دیدگاه" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.review.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin review delete error:", error);
    return NextResponse.json({ success: false, error: "خطا در حذف دیدگاه" }, { status: 500 });
  }
}
