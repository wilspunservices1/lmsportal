const uploadToCloudinary = async (file: File): Promise<{ success: boolean; imgUrl?: string; error?: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, imgUrl: data.imgUrl };
    } else {
      return { success: false, error: data.error || "Unknown error occurred" };
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: "Upload failed" };
  }
};

export { uploadToCloudinary };
