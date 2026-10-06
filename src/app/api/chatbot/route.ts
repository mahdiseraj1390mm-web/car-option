import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, error: "متن پیام نامعتبر است" },
        { status: 400 }
      );
    }

    const cleanMsg = message.trim().toLowerCase();

    // 1. Check if user is asking about a specific vehicle (e.g. Dena, Tara, Shahin)
    const vehicles = await prisma.vehicleModel.findMany({
      include: {
        brand: true,
      },
    });

    const matchedVehicle = vehicles.find((v) =>
      cleanMsg.includes(v.nameFa.toLowerCase()) || cleanMsg.includes(v.nameEn.toLowerCase())
    );

    if (matchedVehicle) {
      return NextResponse.json({
        success: true,
        reply: `خوشبختانه برای خودروی ${matchedVehicle.brand.nameFa} ${matchedVehicle.nameFa} آبشن‌های تخصصی سازگار از جمله کروز کنترل، مانیتور فابریک و دوربین ۳۶۰ موجود است. می‌توانید خودروی خود را انتخاب کنید تا لیست دقیق آبشن‌ها فیلتر شود.`,
        suggestedAction: {
          label: `مشاهده آبشن‌های ${matchedVehicle.nameFa}`,
          link: `/products?model=${matchedVehicle.slug}`,
        },
      });
    }

    // 2. Search ChatbotFAQ database
    const allFaqs = await prisma.chatbotFAQ.findMany();
    let bestMatch: any = null;

    for (const faq of allFaqs) {
      const keywords = faq.keywords.split(",").map((k) => k.trim().toLowerCase());
      const hasMatch = keywords.some((k) => cleanMsg.includes(k));
      if (hasMatch) {
        bestMatch = faq;
        break;
      }
    }

    if (bestMatch) {
      return NextResponse.json({
        success: true,
        reply: bestMatch.answer,
      });
    }

    // 3. Smart Fallback for consulting & lead generation
    return NextResponse.json({
      success: true,
      reply: "برای این مورد می‌توانید مستقیماً با کارشناسان فنی ما در تماس باشید یا با ثبت فرم «درخواست سفارش / استعلام»، کارشناس ما در سریع‌ترین زمان برای مشاوره رایگان با شما تماس خواهد گرفت.",
      suggestedAction: {
        label: "ثبت درخواست استعلام و مشاوره",
        link: "#order-request-modal",
      },
    });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در پردازش هوش مصنوعی چت‌بات" },
      { status: 500 }
    );
  }
}
