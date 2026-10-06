import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "پروژه با موفقیت حذف شد" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در حذف پروژه" },
      { status: 500 }
    );
  }
}
