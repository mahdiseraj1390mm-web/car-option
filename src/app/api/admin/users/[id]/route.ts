import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { isBlocked, role } = await req.json();

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(isBlocked !== undefined ? { isBlocked } : {}),
        ...(role ? { role } : {}),
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: isBlocked ? "BLOCK_USER" : "UNBLOCK_USER",
        resource: "User",
        details: JSON.stringify({ userId: params.id, isBlocked }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در تغییر وضعیت کاربر" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: "DELETE_USER",
        resource: "User",
        details: JSON.stringify({ userId: params.id }),
      },
    });

    return NextResponse.json({ success: true, message: "کاربر با موفقیت حذف شد" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در حذف کاربر" },
      { status: 500 }
    );
  }
}
