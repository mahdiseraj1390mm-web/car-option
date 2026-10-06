import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brandId");
    const modelId = searchParams.get("modelId");
    const trimId = searchParams.get("trimId");

    if (trimId) {
      const years = await prisma.vehicleYear.findMany({
        where: { trimId },
      });
      return NextResponse.json({ success: true, data: years });
    }

    if (modelId) {
      const trims = await prisma.vehicleTrim.findMany({
        where: { modelId },
        include: { years: true },
      });
      return NextResponse.json({ success: true, data: trims });
    }

    if (brandId) {
      const models = await prisma.vehicleModel.findMany({
        where: { brandId },
        include: {
          trims: {
            include: { years: true },
          },
        },
      });
      return NextResponse.json({ success: true, data: models });
    }

    const brands = await prisma.vehicleBrand.findMany({
      include: {
        models: {
          include: {
            trims: {
              include: { years: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: brands });
  } catch (error: any) {
    console.error("Vehicles API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch vehicle data" },
      { status: 500 }
    );
  }
}
