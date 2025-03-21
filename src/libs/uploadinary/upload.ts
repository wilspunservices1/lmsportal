const uploadToCloudinary = async (
	file: File
): Promise<{ success: boolean; imgUrl?: string; error?: string }> => {
	const formData = new FormData();
	formData.append("file", file);

	// Extract filename without extension to prevent duplicates
	const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, ""); // Removes extension
	formData.append("public_id", fileNameWithoutExt);

	try {
		const response = await fetch("/api/upload", {
			method: "POST",
			body: formData,
		});

		const data = await response.json();

		if (response.ok) {
			// Append `fl_attachment` **only when downloading**
			const downloadUrl = `${data.imgUrl}?fl_attachment=${encodeURIComponent(file.name)}`;
			return { success: true, imgUrl: downloadUrl };
		} else {
			return { success: false, error: data.error || "Unknown error occurred" };
		}
	} catch (error) {
		console.error("Error uploading file:", error);
		return { success: false, error: "Upload failed" };
	}
};

export { uploadToCloudinary };
