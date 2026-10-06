import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "فایلی برای آپلود انتخاب نشده است" },
        { status: 400 }
      );
    }

    // Security & file validation
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "video/mp4",
      "audio/webm",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type) && !file.type.startsWith("audio/")) {
      return NextResponse.json(
        { success: false, error: "فرمت فایل مجاز نیست" },
        { status: 400 }
      );
    }

    // Limit size (Max 25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "حجم فایل بیشتر از حد مجاز (۲۵ مگابایت) است" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split(".").pop() || "bin";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = path.join(uploadDir, uniqueName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در آپلود فایل" },
      { status: 500 }
    );
  }
}
