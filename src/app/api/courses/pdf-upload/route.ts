import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/db";
import { courses } from "@/db/schemas/courses";
import { eq } from "drizzle-orm";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const courseId = formData.get("courseId") as string;

    console.log("Received file:", file?.name, file?.type);
    console.log("Received courseId:", courseId);

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "CourseId is required" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: `courses/${courseId}/pdfs`,
          public_id: `description-${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const pdfUrl = (uploadResponse as any).secure_url;

    // Update course with PDF URL
    await db
      .update(courses)
      .set({ descriptionPdfUrl: pdfUrl })
      .where(eq(courses.id, courseId));

    return NextResponse.json({ pdfUrl });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload PDF" },
      { status: 500 }
    );
  }
}