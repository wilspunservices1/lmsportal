"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import html2canvas from "html2canvas";
import Image from "next/image";

// Accept a simple prop for closing the modal
type AssignCertificateProps = {
	onClose: () => void;
};

const AssignCertificate: React.FC<AssignCertificateProps> = ({ onClose }) => {
	const { data: session } = useSession();
	const params = useParams();
	const courseId = params.id as string;

	// Minimal state
	const [certificateData, setCertificateData] = useState<any>(null);
	const [placeholders, setPlaceholders] = useState<any[]>([]);
	const [isDownloading, setIsDownloading] = useState(false);

	// 1) On mount, fetch the user's ID, then fetch certificate data
	useEffect(() => {
		const fetchUserAndCert = async () => {
			if (!session?.user?.email) return;

			try {
				// Get the userId
				const userRes = await fetch(
					`/api/user/email?email=${session.user.email}`
				);
				const userJson = await userRes.json();
				if (!userRes.ok || !userJson.userId) {
					console.error("Failed to get user ID from API.");
					return;
				}

				// Now fetch certificate data
				const certRes = await fetch(
					`/api/courses/${courseId}/certificate?userId=${userJson.userId}`
				);
				const certJson = await certRes.json();
				if (!certRes.ok) {
					console.error(
						"Failed to fetch certificate data:",
						certJson
					);
					return;
				}

				// Store the certificateData object + placeholders
				setCertificateData(certJson.certificateData || null);
				setPlaceholders(certJson.certificateData?.placeholders || []);
			} catch (err) {
				console.error("Error:", err);
			}
		};

		fetchUserAndCert();
	}, [session, courseId]);

	// 2) Download using html2canvas
	const handleDownloadCertificate = () => {
		if (!certificateData) return;
		setIsDownloading(true);

		const container = document.getElementById("certificate-container");
		if (!container) {
			setIsDownloading(false);
			return;
		}

		html2canvas(container, { useCORS: true }).then((canvas) => {
			const link = document.createElement("a");
			link.href = canvas.toDataURL("image/png");
			link.download = `certificate-${
				certificateData.title || "course"
			}.png`;
			link.click();
			setIsDownloading(false);
		});
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="relative bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-4xl">
				{/* Header row */}
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold">Your Certificate</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 text-lg"
					>
						✖
					</button>
				</div>

				{/* If no data, show loading message */}
				{!certificateData ? (
					<p className="text-center text-red-500">
						Loading certificate details...
					</p>
				) : (
					<>
						{/* This container is what we capture with html2canvas */}
						<div
							id="certificate-container"
							className="relative flex justify-center w-full"
						>
							{/* The certificate image */}
							<Image
								src={
									certificateData.certificate_data_url ||
									"https://res.cloudinary.com/ddj5gisb3/image/upload/v1741028895/courses/The_Era_of_AI_Certificate_1_adeyzv.jpg"
								}
								alt="Certificate"
								width={1500} // Arbitrary fixed size
								height={1200}
								className="rounded-lg shadow-lg w-full max-w-[1500px]"
								crossOrigin="anonymous"
								unoptimized
							/>

							{/* Overlaid placeholders relative to the top-left corner of the image */}
							{placeholders.map((ph,index) => (
								<div
									key={ph.id}
									style={{
										position: "absolute",
										// interpret ph.x / ph.y as "pixels" from the top-left
                    top: "50px", // all near top: 50px, spaced vertically
                    left: "50px", // all start at left: 50px
										fontSize: `${ph.font_size}px`,
										color: "#000",
										transform: "translate(-50%, -50%)",
										background: "rgba(255,255,0)",
										borderRadius: "4px",
										padding: "2px 6px",
										whiteSpace: "nowrap",
                    zIndex: 9999,
										textAlign: "center",
									}}
								>
									{ph.value || ph.label || ""}
								</div>
							))}
						</div>

						{/* Download button */}
						<div className="text-center mt-4">
							<button
								onClick={handleDownloadCertificate}
								disabled={isDownloading}
								className="px-6 py-3 bg-indigo-600 text-black rounded-md hover:bg-indigo-700"
							>
								{isDownloading
									? "Downloading..."
									: "Download Certificate"}
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default AssignCertificate;

// /* eslint-disable react-hooks/exhaustive-deps */
// "use client";

// import React, { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import html2canvas from "html2canvas";
// import Image from "next/image";

// type AssignCertificateProps = {
// 	onClose: () => void;
// };

// const AssignCertificate: React.FC<AssignCertificateProps> = ({ onClose }) => {
// 	const { data: session } = useSession();
// 	const params = useParams();
// 	const courseId = params.id as string;

// 	// Minimal state: store certificate data as any, placeholders as an array
// 	const [userId, setUserId] = useState<string | null>(null);
// 	const [certificateData, setCertificateData] = useState<any>(null);
// 	const [placeholders, setPlaceholders] = useState<any[]>([]);
// 	const [isDownloading, setIsDownloading] = useState<boolean>(false);

// 	// 1) Fetch userId based on session email
// 	useEffect(() => {
// 		const fetchUserId = async () => {
// 			if (!session?.user?.email) return;
// 			try {
// 				const res = await fetch(
// 					`/api/user/email?email=${session.user.email}`
// 				);
// 				const data = await res.json();

// 				if (res.ok && data.userId) {
// 					setUserId(data.userId);
// 					fetchCertificateDetails(data.userId);
// 				} else {
// 					console.error("User ID not found in API response.");
// 				}
// 			} catch (err) {
// 				console.error("Error fetching user ID:", err);
// 			}
// 		};
// 		fetchUserId();
// 	}, [session]);

// 	// 2) Fetch certificate data using courseId + userId
// 	const fetchCertificateDetails = async (fetchedUserId: string) => {
// 		if (!fetchedUserId) return;
// 		try {
// 			const response = await fetch(
// 				`/api/courses/${courseId}/certificate?userId=${fetchedUserId}`
// 			);
// 			const data = await response.json();

// 			if (!response.ok) {
// 				console.error("API error:", data);
// 				return;
// 			}

// 			// data.certificateData is the relevant certificate portion
// 			setCertificateData(data.certificateData || null);
// 			setPlaceholders(data.certificateData?.placeholders || []);
// 		} catch (err) {
// 			console.error("Error fetching certificate:", err);
// 		}
// 	};

// 	// 3) Download the certificate (html2canvas screenshot)
// 	const handleDownloadCertificate = () => {
// 		if (!certificateData) return;
// 		setIsDownloading(true);

// 		const certificateEl = document.getElementById("certificate-container");
// 		if (!certificateEl) {
// 			setIsDownloading(false);
// 			return;
// 		}

// 		html2canvas(certificateEl, { useCORS: true }).then((canvas) => {
// 			const link = document.createElement("a");
// 			link.href = canvas.toDataURL("image/png");
// 			link.download = `certificate-${
// 				certificateData.title || "course"
// 			}.png`;
// 			link.click();
// 			setIsDownloading(false);
// 		});
// 	};

// 	return (
// 		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// 			<div className="relative bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-4xl">
// 				{/* Header */}
// 				<div className="flex justify-between items-center mb-4">
// 					<h2 className="text-2xl font-bold">Your Certificate</h2>
// 					<button
// 						onClick={onClose}
// 						className="text-gray-500 hover:text-gray-700 text-lg"
// 					>
// 						✖
// 					</button>
// 				</div>

// 				{/* Show either loading or the certificate */}
// 				{certificateData ? (
// 					<>
// 						<div
// 							id="certificate-container"
// 							className="relative w-full flex justify-center"
// 						>
// 							<Image
// 								src={
// 									certificateData.certificate_data_url
// 								}
// 								alt="Certificate"
// 								width={800}
// 								height={600}
// 								className="rounded-lg shadow-lg w-full max-w-[800px]"
// 								crossOrigin="anonymous"
// 								unoptimized
// 							/>

// 							{placeholders.map((item) => (
// 								<div
// 									key={item.id}
// 									style={{
// 										position: "absolute",
// 										top: `${
// 											(parseFloat(item.y) / 728) * 100
// 										}%`,
// 										left: `${
// 											(parseFloat(item.x) / 1024) * 100
// 										}%`,
// 										fontSize: `${item.font_size}px`,
// 										color: item.color || "#000",
// 										transform: "translate(-50%, -50%)",
// 										whiteSpace: "nowrap",
// 										background: "rgba(255, 255, 255, 0.7)",
// 										padding: "2px 5px",
// 										borderRadius: "3px",
// 									}}
// 								>
// 									{item.value || item.label || ""}
// 								</div>
// 							))}
// 						</div>

// 						<div className="text-center mt-4">
// 							<button
// 								onClick={handleDownloadCertificate}
// 								disabled={isDownloading}
// 								className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
// 							>
// 								{isDownloading
// 									? "Downloading..."
// 									: "Download Certificate"}
// 							</button>
// 						</div>
// 					</>
// 				) : (
// 					<div className="text-center text-red-500">
// 						Loading certificate details...
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// };

// export default AssignCertificate;
