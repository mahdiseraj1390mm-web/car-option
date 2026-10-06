import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { setting, workingHours, socialLinks } = body;

    if (setting) {
      await prisma.siteSetting.upsert({
        where: { id: "singleton" },
        update: setting,
        create: {
          id: "singleton",
          ...setting,
        },
      });
    }

    if (workingHours && Array.isArray(workingHours)) {
      for (const h of workingHours) {
        if (h.id) {
          await prisma.workingHours.update({
            where: { id: h.id },
            data: {
              openTime: h.openTime,
              closeTime: h.closeTime,
              isOpen: h.isOpen,
            },
          });
        }
      }
    }

    if (socialLinks && Array.isArray(socialLinks)) {
      for (const s of socialLinks) {
        if (s.id) {
          await prisma.socialLink.update({
            where: { id: s.id },
            data: {
              url: s.url,
              username: s.username,
              isActive: s.isActive,
            },
          });
        }
      }
    }

    // Log update
    await prisma.auditLog.create({
      data: {
        action: "UPDATE_SITE_CMS_SETTINGS",
        resource: "SiteSetting",
        details: JSON.stringify({ updatedParts: Object.keys(body) }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "تنظیمات هدر، فوتر و اطلاعات سایت با موفقیت بروزرسانی شد",
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در بروزرسانی تنظیمات" },
      { status: 500 }
    );
  }
}
