import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/libs/uploadinary/cloudinary";

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ message: "No file provided" }, { status: 400 });
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Clean the filename: remove all whitespace
		const cleanFileName = file.name.replace(/\s+/g, "");

		// Extract clean filename parts
		const fileNameWithoutExt = cleanFileName.replace(/\.[^/.]+$/, "");
		const fileExtension = cleanFileName.split(".").pop();

		// Upload file to Cloudinary
		const result = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder: "courses",
					resource_type: "auto",
					use_filename: true,
					unique_filename: false,
					filename_override: cleanFileName, // Cleaned filename with extension
					flags: "attachment",
					public_id: fileNameWithoutExt,     // Cleaned filename without extension
					format: fileExtension,             // Preserve correct extension
				},
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

		// Return Cloudinary file URL with forced download
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
