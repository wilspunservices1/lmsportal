"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Highlights = () => {
	const { data: session } = useSession();
	const [highlights, setHighlights] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchHighlights = async () => {
			if (!session?.user?.id) return;

			try {
				const response = await fetch(`/api/user/highlights?userId=${session.user.id}`);
				const data = await response.json();
				
				if (response.ok) {
					setHighlights(data.highlights || []);
				}
			} catch (error) {
				console.error("Error fetching highlights:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchHighlights();
	}, [session]);

	if (loading) return <div>Loading highlights...</div>;
	if (highlights.length === 0) return null;

	return (
		<div className="container mb-10">
			<div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border-l-4 border-yellow-500">
				<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
					⚠️ Course Expiry Highlights
				</h2>
				<div className="space-y-3">
					{highlights.map((highlight) => {
						const enrollmentDate = new Date(highlight.enrollmentDate);
						const expiryDate = new Date(highlight.expiryDate);
						const now = new Date();
						const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
						const isExpired = daysLeft < 0;
						const isExpiringSoon = daysLeft <= 30 && daysLeft >= 0;

						return (
							<div
								key={highlight.courseId}
								className={`p-4 rounded-lg ${
									isExpired
										? "bg-gray-100 dark:bg-gray-800 border border-gray-300 opacity-60"
										: isExpiringSoon
										? "bg-red-50 dark:bg-red-900/20 border border-red-200"
										: "bg-white dark:bg-gray-800 border border-gray-200"
								}`}
							>
								<div className="flex justify-between items-start">
									<div className="flex-1">
										<h3 className="font-semibold text-gray-800 dark:text-gray-200">
											{highlight.title}
											{isExpired && <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">EXPIRED</span>}
										</h3>
										<div className="mt-2 space-y-1">
											<p className="text-sm text-gray-600 dark:text-gray-400">
												<span className="font-medium">Started:</span> {enrollmentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
											</p>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												<span className="font-medium">Progress:</span> {highlight.progress}%
											</p>
											{highlight.renewPrice && (
												<p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
													Renewal: ${highlight.renewPrice} for 30 days
												</p>
											)}
										</div>
									</div>
									<div className="text-right">
										<p className={`text-sm font-medium ${
											isExpired ? "text-gray-500" : isExpiringSoon ? "text-red-600" : "text-gray-600"
										}`}>
											Expires: {expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
										</p>
										<p className={`text-xs font-semibold mt-1 ${
											isExpired ? "text-red-600" : isExpiringSoon ? "text-red-500" : "text-green-600"
										}`}>
											{isExpired ? "Access Expired" : `${daysLeft} days left`}
										</p>
									</div>
								</div>
								<div className="mt-3 flex gap-2">
									{!isExpired ? (
										<Link
											href={`/courses/${highlight.courseId}`}
											className="inline-block text-sm text-primaryColor hover:underline"
										>
											Continue Learning →
										</Link>
									) : (
										<Link
											href={`/course-renewal/${highlight.courseId}`}
											className="inline-block text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
										>
											🔄 Renew Access (${highlight.renewPrice})
										</Link>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Highlights;
