const uploadToCloudinary = async (
	file: File
): Promise<{ success: boolean; imgUrl?: string; error?: string }> => {
	// Helper to remove all whitespace from file name
	const getSafeFileName = (name: string): string => {
		return name.replace(/\s+/g, ""); // Remove all spaces
	};

	const formData = new FormData();
	formData.append("file", file);
	formData.append("public_id", getSafeFileName(file.name)); // Use cleaned filename

	try {
		const response = await fetch("/api/upload", {
			method: "POST",
			body: formData,
		});

		const data = await response.json();

		if (response.ok) {
			return {
				success: true,
				imgUrl: `${data.imgUrl}`, // `fl_attachment` is already added in the API
			};
		} else {
			return { success: false, error: data.error || "Unknown error occurred" };
		}
	} catch (error) {
		console.error("Error uploading file:", error);
		return { success: false, error: "Upload failed" };
	}
};

export { uploadToCloudinary };
