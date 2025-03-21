"use client";

import React from "react";

type Props = {
	files: string[];
};

const Attachments: React.FC<Props> = ({ files }) => {
	return (
		<div>
			<h5 className="font-semibold">Downloadable Files:</h5>
			<ul className="ml-4 list-disc">
				{files && files.length > 0 ? (
					files.map((fileUrl, index) => {
						// Extract the original file name from the Cloudinary URL correctly
						const fileName = decodeURIComponent(
							fileUrl.split("/").pop()?.split("?")[0] || "file"
						);

						return (
							<li key={index} className="mb-2">
								<a
									href={fileUrl}
									download={fileName}
									className="text-primaryColor underline"
								>
									{fileName}
								</a>
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
