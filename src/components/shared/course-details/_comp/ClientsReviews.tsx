"use client";
import React, { useState } from "react";
import { CldImage } from "next-cloudinary";

// Define the type for a review
type Review = {
	id: string;
	rating: number;
	comment: string;
	avatar_url?: string; // Optional field for user's avatar
	user_id: string; // The user who submitted the review
	created_at: string; // Timestamp of when the review was created
	name: string; // User's name
	username?: string; // Added username field
};

type Props = {
	reviews: Review[];
};

const ClientsReviews: React.FC<Props> = ({ reviews }) => {
	const [visibleReviews, setVisibleReviews] = useState(5);

	// Helper function to format date to a more readable format
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
	};

	// Helper function to render stars based on rating
	const renderStars = (rating: number) => {
		const filledStars = Array(rating).fill(<i className="icofont-star text-yellow-500"></i>);
		const emptyStars = Array(5 - rating).fill(<i className="icofont-star text-gray-300"></i>);
		return [...filledStars, ...emptyStars];
	};

	const loadMoreReviews = () => {
		setVisibleReviews((prev) => prev + 5);
	};

	return (
		<div className="mt-10 mb-10 max-w-7xl mx-auto">
			<h4 className="text-2xl text-blackColor dark:text-white font-semibold pl-2 mb-6">
				Customer Reviews
			</h4>
			<div className="space-y-6">
				{reviews && reviews.length > 0 ? (
					<>
						{reviews.slice(0, visibleReviews).map((review) => (
							<div
								key={review.id}
								className="flex p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
							>
								<div className="flex-shrink-0 mr-6">
									<CldImage
										width="60"
										height="60"
										alt={review.name}
										src={review.avatar_url || "/default-avatar.png"}
										sizes="60w"
										className="w-16 h-16 rounded-full object-cover"
									/>
								</div>
								<div className="flex-grow">
									<div className="flex justify-between items-start">
										<div>
											<h5 className="text-lg font-semibold text-blackColor dark:text-white">
												{review.name}
											</h5>
											{review.username && (
												<p className="text-sm text-gray-500 dark:text-gray-400">
													@{review.username}
												</p>
											)}
											<div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
												{renderStars(review.rating)}
											</div>
										</div>
										<div className="text-sm font-medium text-gray-500 dark:text-gray-400">
											{formatDate(review.created_at)}
										</div>
									</div>
									<p className="text-sm text-gray-700 dark:text-gray-300 mt-3">
										{review.comment}
									</p>
								</div>
							</div>
						))}
						{visibleReviews < reviews.length && (
							<div className="text-center">
								<button
									onClick={loadMoreReviews}
									className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
									style={{ color: "#eb911e" }}
								>
									+ Show More Reviews
								</button>
							</div>
						)}
					</>
				) : (
					<p className="text-gray-500 dark:text-gray-400">No reviews available.</p>
				)}
			</div>
		</div>
	);
};

export default ClientsReviews;
