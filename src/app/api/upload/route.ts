import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/libs/uploadinary/cloudinary";

export async function POST(req: NextRequest) {
	try {
		// Step 1: Read form data and get file
		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ message: "No file provided" }, { status: 400 });
		}

		// Step 2: Convert file to buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Step 3: Upload file to Cloudinary using buffer
		const result = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder: "courses", // Change folder if needed
					resource_type: "auto", // Automatically detects file type
					use_filename: true,
				},
				(error, uploadResult) => {
					if (error) reject(error);
					else resolve(uploadResult);
				}
			);

			uploadStream.end(buffer);
		});

		// Step 4: Return Cloudinary file URL
		return NextResponse.json({
			message: "success",
			imgUrl: (result as any).secure_url,
		});
	} catch (error) {
		console.error("Error during file upload:", error);
		return NextResponse.json(
			{
				message: "Upload failed",
				error: error.message,
			},
			{ status: 500 }
		);
	}
}
