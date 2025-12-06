// src/app/api/admin/upload-product-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const runtime = "nodejs"; // đảm bảo dùng Node, không phải edge

const UPLOAD_DIR = path.join(process.cwd(), "public", "assets", "products");

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

// helper tạo tên file unique
function createFileName(originalName: string) {
  const ext = path.extname(originalName);         // .png
  const base = path.basename(originalName, ext);  // h1
  const suffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
  return `${base}-${suffix}${ext}`;              // h1-1700000000000-123456.png
}

export async function POST(req: NextRequest) {
  try {
    // ✅ nhận formData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "Không có file upload" },
        { status: 400 }
      );
    }

    // (tuỳ bạn: có thể check mime type / size)
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    ensureUploadDir();

    const safeFileName = createFileName(file.name);
    const filePath = path.join(UPLOAD_DIR, safeFileName);

    fs.writeFileSync(filePath, fileBuffer);

    const baseUrlImage =
      process.env.NEXT_PUBLIC_URL_IMAGE || "http://localhost:3000/assets/products";

    const url = `${baseUrlImage}/${safeFileName}`;

    return NextResponse.json({
      filename: safeFileName,
      url,
    });
  } catch (err) {
    console.error("Upload product image error:", err);
    return NextResponse.json(
      { message: "Upload ảnh thất bại" },
      { status: 500 }
    );
  }
}
