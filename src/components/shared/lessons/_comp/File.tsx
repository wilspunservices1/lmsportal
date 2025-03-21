"use client";

import React from "react";

type Props = {
	files: string[]; // Array of Cloudinary file URLs passed as a prop
};

const Attachments: React.FC<Props> = ({ files }) => {
	// Function to handle file download
	const handleDownload = async (fileUrl: string, fileName: string) => {
		try {
			// Append `fl_attachment` to Cloudinary URL to force download
			const downloadUrl = `${fileUrl}?fl_attachment=${fileName}`;

			const response = await fetch(downloadUrl, {
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch file: ${response.statusText}`);
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);

			// Create a temporary anchor element to trigger the download
			const a = document.createElement("a");
			a.href = url;
			a.download = fileName; // Correct filename with extension
			document.body.appendChild(a);
			a.click();

			// Clean up
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (error) {
			console.error("Error downloading file:", error);
			alert("Failed to download the file. Please try again.");
		}
	};

	return (
		<div>
			<h5 className="font-semibold">Downloadable Files:</h5>
			<ul className="ml-4 list-disc">
				{files && files.length > 0 ? (
					files.map((fileUrl, index) => {
						// Extract file name from the Cloudinary URL
						const fileName = fileUrl.split("/").pop() || "file";

						return (
							<li key={index} className="mb-2">
								<button
									onClick={() => handleDownload(fileUrl, fileName)} // Trigger download on click
									className="text-primaryColor underline"
								>
									{fileName}
								</button>
							</li>
						);
					})
				) : (
					<li>No files available for download.</li>
				)}
			</ul>
		</div>
	);
};

export default Attachments;
