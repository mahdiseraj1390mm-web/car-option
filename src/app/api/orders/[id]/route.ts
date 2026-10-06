import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, adminNotes } = await req.json();

    const updated = await prisma.orderRequest.update({
      where: { id: params.id },
      data: {
        ...(status ? { status } : {}),
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      },
    });

    // Create Audit Log (بند ۴۹ پروپوزال)
    await prisma.auditLog.create({
      data: {
        action: "UPDATE_ORDER_STATUS",
        resource: "OrderRequest",
        details: JSON.stringify({ orderId: params.id, newStatus: status, adminNotes }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در بروزرسانی وضعیت سفارش" },
      { status: 500 }
    );
  }
}
