import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { id: "singleton" },
    });

    const socialLinks = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: "asc" },
    });

    const workingHours = await prisma.workingHours.findMany({
      orderBy: { dayOfWeek: "asc" },
    });

    const branches = await prisma.branch.findMany({
      where: { isActive: true },
    });

    // Check store open status right now based on working hours
    const now = new Date();
    // JavaScript day: 0 is Sunday, 1 is Monday... In Iranian seed: 0 is Saturday, 1 is Sunday
    // Map JS getDay (0=Sun, 1=Mon... 6=Sat) to Iranian week day index (Sat=0, Sun=1...)
    const jsDay = now.getDay();
    const iranDayIndex = (jsDay + 1) % 7; 

    const currentDayHours = workingHours.find((h) => h.dayOfWeek === iranDayIndex);
    let isOpenNow = false;

    if (currentDayHours && currentDayHours.isOpen) {
      const currentHours = now.getHours().toString().padStart(2, "0");
      const currentMinutes = now.getMinutes().toString().padStart(2, "0");
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      if (
        currentTimeStr >= currentDayHours.openTime &&
        currentTimeStr <= currentDayHours.closeTime
      ) {
        isOpenNow = true;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        setting,
        socialLinks,
        workingHours,
        branches,
        isOpenNow,
        currentDaySchedule: currentDayHours,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
