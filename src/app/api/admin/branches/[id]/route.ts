import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.branch.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin branch delete error:", error);
    return NextResponse.json({ success: false, error: "خطا در حذف شعبه" }, { status: 500 });
  }
}
