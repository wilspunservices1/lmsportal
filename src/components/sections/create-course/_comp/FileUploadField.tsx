import { BASE_URL } from "@/actions/constant";
import React, { useState } from "react";
import { uploadToCloudinary } from "@/libs/uploadinary/upload";

interface FileUploadFieldProps {
	setFilePaths: (paths: string[]) => void;
	showAlert: (type: string, message: string) => void;
	labelText: string;
	multiple?: boolean;
	accept?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
	setFilePaths,
	showAlert,
	labelText,
	multiple = false,
	accept = "*/*",
}) => {
	const [loading, setLoading] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	// Handle file input change
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			setSelectedFiles(files);
		}
	};

	// Handle file upload
	const handleFileUpload = async () => {
		if (selectedFiles.length === 0) {
			showAlert("Error", "Please select files to upload.");
			return;
		}

		setLoading(true);
		try {
			// Upload each file to Cloudinary
			const uploadedFileURLs = await Promise.all(
				selectedFiles.map(async (file) => {
					const uploadResult = await uploadToCloudinary(file);
					return uploadResult.success ? uploadResult.imgUrl : null;
				})
			);

			// Store only successful file URLs
			setFilePaths(uploadedFileURLs.filter((url): url is string => Boolean(url)));

			showAlert("success", "Files uploaded successfully.");
		} catch (error) {
			console.error("Error uploading files:", error);
			showAlert("error", "Failed to upload files.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mb-15px">
			<label className="mb-3 block font-semibold">{labelText ? labelText : ""}</label>
			<input
				type="file"
				accept={accept}
				multiple={multiple}
				onChange={handleFileChange}
				className="w-full py-10px px-5 text-sm focus:outline-none text-contentColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border-2 border-borderColor dark:border-borderColor-dark placeholder:text-placeholder placeholder:opacity-80 leading-23px rounded-md"
			/>
			<button
				onClick={handleFileUpload}
				disabled={loading}
				className="mt-3 px-4 py-2 bg-blue text-white rounded"
			>
				{loading ? "Uploading..." : "Upload Files"}
			</button>
		</div>
	);
};

export default FileUploadField;
