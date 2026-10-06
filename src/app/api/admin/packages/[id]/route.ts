import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.package.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "پکیج با موفقیت حذف شد" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در حذف پکیج" },
      { status: 500 }
    );
  }
}
