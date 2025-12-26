"use client";

import React, { useState, useEffect } from "react";
import useSweetAlert from "@/hooks/useSweetAlert";

const CourseReviewManager = ({ courseId }) => {
	const [reviews, setReviews] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [newReview, setNewReview] = useState({
		reviewerName: "",
		rating: 5,
		comment: "",
		reviewDate: "",
	});
	const showAlert = useSweetAlert();

	useEffect(() => {
		if (courseId) {
			fetchReviews();
		}
	}, [courseId]);

	const fetchReviews = async () => {
		if (!courseId) return;
		setIsLoading(true);
		try {
			const response = await fetch(`/api/courses/${courseId}/reviews?type=instructor`);
			if (response.ok) {
				const data = await response.json();
				setReviews(data.reviews || []);
			}
		} catch (error) {
			console.error("Error fetching reviews:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddReview = async () => {
		if (!courseId) {
			showAlert("error", "Please save the course first");
			return;
		}

		if (!newReview.reviewerName.trim() || !newReview.comment.trim()) {
			showAlert("error", "Please fill all required fields");
			return;
		}

		try {
			const response = await fetch(`/api/courses/${courseId}/reviews`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...newReview, type: "instructor" }),
			});

			if (!response.ok) throw new Error("Failed to add review");

			showAlert("success", "Review added successfully");
			setNewReview({ reviewerName: "", rating: 5, comment: "", reviewDate: "" });
			fetchReviews();
		} catch (error) {
			console.error("Error adding review:", error);
			showAlert("error", "Failed to add review");
		}
	};

	const handleDeleteReview = async (reviewId) => {
		try {
			const response = await fetch(`/api/courses/${courseId}/reviews/${reviewId}`, {
				method: "DELETE",
			});

			if (!response.ok) throw new Error("Failed to delete review");

			showAlert("success", "Review deleted successfully");
			fetchReviews();
		} catch (error) {
			console.error("Error deleting review:", error);
			showAlert("error", "Failed to delete review");
		}
	};

	return (
		<div className="space-y-6">
			{/* Add New Review Form */}
			<div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
				<h4 className="font-semibold text-gray-800 dark:text-gray-200">Add New Review</h4>
				
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Reviewer Name *
					</label>
					<input
						type="text"
						value={newReview.reviewerName}
						onChange={(e) => setNewReview({ ...newReview, reviewerName: e.target.value })}
						className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primaryColor bg-white dark:bg-gray-700"
						placeholder="Enter reviewer name"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Rating *
					</label>
					<select
						value={newReview.rating}
						onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
						className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primaryColor bg-white dark:bg-gray-700"
					>
						<option value={5}>5 Stars</option>
						<option value={4}>4 Stars</option>
						<option value={3}>3 Stars</option>
						<option value={2}>2 Stars</option>
						<option value={1}>1 Star</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Review Comment *
					</label>
					<textarea
						value={newReview.comment}
						onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
						className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primaryColor bg-white dark:bg-gray-700"
						rows="3"
						placeholder="Enter review comment"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Review Date (Optional)
					</label>
					<input
						type="text"
						value={newReview.reviewDate}
						onChange={(e) => setNewReview({ ...newReview, reviewDate: e.target.value })}
						className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primaryColor bg-white dark:bg-gray-700"
						placeholder="e.g., 2 weeks ago"
					/>
				</div>

				<button
					onClick={handleAddReview}
					className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-opacity-90 transition-colors"
				>
					Add Review
				</button>
			</div>

			{/* Reviews List */}
			<div className="space-y-3">
				<h4 className="font-semibold text-gray-800 dark:text-gray-200">
					Existing Reviews ({reviews.length})
				</h4>
				
				{isLoading ? (
					<p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
				) : reviews.length === 0 ? (
					<p className="text-gray-600 dark:text-gray-400">No reviews added yet</p>
				) : (
					reviews.map((review) => (
						<div
							key={review.id}
							className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
						>
							<div className="flex justify-between items-start">
								<div className="flex gap-3 flex-1">
									<div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
										{review.reviewerName.charAt(0).toUpperCase()}
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-medium text-gray-900 dark:text-gray-100">
												{review.reviewerName}
											</span>
											<span className="text-yellow-400 text-lg">
												{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
											</span>
										</div>
										{review.reviewDate && (
											<p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
												{review.reviewDate}
											</p>
										)}
										<p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
											{review.comment}
										</p>
									</div>
								</div>
								<button
									onClick={() => handleDeleteReview(review.id)}
									className="text-red-500 hover:text-red-700 ml-4"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										fill="currentColor"
										viewBox="0 0 16 16"
									>
										<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
										<path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
									</svg>
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default CourseReviewManager;
