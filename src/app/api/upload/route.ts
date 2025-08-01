import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    console.log('Upload API called');
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const uploadType = formData.get("type") as string; // 'profile' or 'cover'

    console.log('File details:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      uploadType: uploadType
    });

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json({ message: "Cloudinary not configured" }, { status: 500 });
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
      imgUrl: (result as any).secure_url,
    });

  } catch (error) {
    console.error("Error during file upload:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { message: "Upload failed", error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}