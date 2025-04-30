import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/libs/uploadinary/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const uploadType = formData.get("type") as string; // 'profile' or 'cover'

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Clean the filename
    const cleanFileName = file.name.replace(/\s+/g, "");
    const fileNameWithoutExt = cleanFileName.replace(/\.[^/.]+$/, "");
    const fileExtension = cleanFileName.split(".").pop();

    // Configure upload options based on type
    const uploadOptions: any = {
      folder: uploadType === 'cover' ? 'profile_covers' : 'courses',
      resource_type: "auto" as "auto" | "image" | "video" | "raw",
      use_filename: true,
      unique_filename: false,
      filename_override: cleanFileName,
      public_id: fileNameWithoutExt,
      format: fileExtension,
      ...(uploadType !== 'cover' && { flags: "attachment" }),
    };

    // Upload file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, uploadResult) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(uploadResult);
          }
        }
      );
      uploadStream.end(buffer);
    });

    // Return different response for cover photos
    if (uploadType === 'cover') {
      return NextResponse.json({
        message: "success",
        imgUrl: (result as any).secure_url,
      });
    }

    // Default response for other uploads
    return NextResponse.json({
      message: "success",
      imgUrl: `${(result as any).secure_url}?fl_attachment=${encodeURIComponent(cleanFileName)}`,
    });

  } catch (error) {
    console.error("Error during file upload:", error);
    return NextResponse.json(
      { message: "Upload failed", error: error.message },
      { status: 500 }
    );
  }
}