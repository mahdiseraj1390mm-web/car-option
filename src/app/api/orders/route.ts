import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      productId,
      packageId,
      vehicleInfo,
      description,
      preferredContact,
      bestTimeToCall,
    } = body;

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { success: false, error: "نام و شماره تماس متقاضی الزامی است" },
        { status: 400 }
      );
    }

    // Generate unique automotive tracking code
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const trackingCode = `OPT-${randomDigits}`;

    const newOrder = await prisma.orderRequest.create({
      data: {
        trackingCode,
        customerName,
        customerPhone,
        productId: productId || null,
        packageId: packageId || null,
        vehicleInfo: vehicleInfo || null,
        description: description || null,
        preferredContact: preferredContact || "PHONE",
        bestTimeToCall: bestTimeToCall || null,
        status: "NEW",
      },
      include: {
        product: true,
        package: true,
      },
    });

    // Create system notification for admins
    await prisma.notification.create({
      data: {
        title: "درخواست سفارش جدید",
        message: `مشتری ${customerName} (${customerPhone}) برای ${newOrder.product?.titleFa || newOrder.package?.titleFa || "مشاوره عمومی"} درخواست ثبت کرد.`,
        link: `/admin/orders`,
        type: "ORDER",
      },
    });

    return NextResponse.json({
      success: true,
      trackingCode: newOrder.trackingCode,
      message: "درخواست سفارش با موفقیت ثبت شد. کارشناسان ما به زودی با شما تماس خواهند گرفت.",
      data: newOrder,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ثبت درخواست سفارش" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trackingCode = searchParams.get("trackingCode");

    if (trackingCode) {
      const order = await prisma.orderRequest.findUnique({
        where: { trackingCode },
        include: {
          product: { include: { media: true } },
          package: true,
        },
      });

      if (!order) {
        return NextResponse.json(
          { success: false, error: "درخواستی با این کد رهگیری یافت نشد" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: order });
    }

    // Admin view
    const orders = await prisma.orderRequest.findMany({
      include: {
        product: true,
        package: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در دریافت درخواست‌ها" },
      { status: 500 }
    );
  }
}
