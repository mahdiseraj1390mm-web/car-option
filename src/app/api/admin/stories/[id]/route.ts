import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.story.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "استوری با موفقیت حذف شد" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در حذف استوری" },
      { status: 500 }
    );
  }
}
