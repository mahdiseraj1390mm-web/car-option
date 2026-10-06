import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      titleFa,
      titleEn,
      slug,
      sku,
      shortDesc,
      priceStatus,
      price,
      stockStatus,
      warranty,
      installation,
      categoryId,
      imageUrl,
      audioUrl,
      voiceUrl,
    } = body;

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(titleFa ? { titleFa } : {}),
        titleEn: titleEn || null,
        ...(slug ? { slug: slug.trim().toLowerCase().replace(/\s+/g, "-") } : {}),
        ...(sku ? { sku } : {}),
        shortDesc: shortDesc || null,
        ...(priceStatus ? { priceStatus } : {}),
        price: price ? parseFloat(price) : null,
        ...(stockStatus ? { stockStatus } : {}),
        warranty: warranty || null,
        installation: installation || null,
      },
    });

    // Handle Image update
    if (imageUrl !== undefined) {
      const existingImg = await prisma.productMedia.findFirst({
        where: { productId: params.id, type: "IMAGE" },
      });
      if (imageUrl && imageUrl.trim()) {
        if (existingImg) {
          await prisma.productMedia.update({
            where: { id: existingImg.id },
            data: { url: imageUrl.trim(), isPrimary: true },
          });
        } else {
          await prisma.productMedia.create({
            data: {
              productId: params.id,
              url: imageUrl.trim(),
              type: "IMAGE",
              isPrimary: true,
            },
          });
        }
      } else if (existingImg) {
        await prisma.productMedia.delete({ where: { id: existingImg.id } });
      }
    }

    // Handle Voice / Audio update
    const finalAudio = audioUrl || voiceUrl;
    if (finalAudio !== undefined) {
      const existingVoice = await prisma.productMedia.findFirst({
        where: { productId: params.id, type: { in: ["VOICE", "AUDIO"] } },
      });
      if (finalAudio && finalAudio.trim()) {
        if (existingVoice) {
          await prisma.productMedia.update({
            where: { id: existingVoice.id },
            data: { url: finalAudio.trim(), title: "توضیحات صوتی کارشناس" },
          });
        } else {
          await prisma.productMedia.create({
            data: {
              productId: params.id,
              url: finalAudio.trim(),
              type: "VOICE",
              isPrimary: false,
              title: "توضیحات صوتی کارشناس",
            },
          });
        }
      } else if (existingVoice) {
        await prisma.productMedia.delete({ where: { id: existingVoice.id } });
      }
    }

    // Handle Category update
    if (categoryId) {
      await prisma.productCategory.deleteMany({
        where: { productId: params.id },
      });
      await prisma.productCategory.create({
        data: {
          productId: params.id,
          categoryId,
        },
      });
    }

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: "UPDATE_PRODUCT",
        resource: "Product",
        details: JSON.stringify({ id: params.id, titleFa }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "خطا در ویرایش محصول" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await prisma.product.delete({
      where: { id: params.id },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        action: "DELETE_PRODUCT",
        resource: "Product",
        details: JSON.stringify({ id: params.id, title: deleted.titleFa }),
      },
    });

    return NextResponse.json({ success: true, message: "محصول با موفقیت حذف شد" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطا در حذف محصول" },
      { status: 500 }
    );
  }
}
