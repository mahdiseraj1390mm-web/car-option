import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { nameFa, nameEn, slug, description } = await req.json();

    const updated = await prisma.category.update({
      where: { id: params.id },
      data: {
        ...(nameFa ? { nameFa } : {}),
        nameEn: nameEn || null,
        ...(slug ? { slug: slug.trim().toLowerCase().replace(/\s+/g, "-") } : {}),
        description: description || null,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در ویرایش دسته" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.category.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "دسته حذف شد" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در حذف دسته" },
      { status: 500 }
    );
  }
}
