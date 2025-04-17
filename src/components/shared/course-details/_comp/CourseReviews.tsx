"use client";
import React, { useEffect, useState, useMemo } from "react";
import ClientsReviews from "./ClientsReviews";
import ReviewForm from "./reviewForm";
import TotalRating from "./TotalRating";

interface Review {
	id: string;
	rating: number;
	comment: string;
	avatar_url?: string; // Optional field for user's avatar
	user_id: string; // The user who submitted the review
	created_at: string; // Timestamp of when the review was created
	name: string; // User's name
}

interface CourseReviewsProps {
	courseId: string | number;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
	const [reviews, setReviews] = useState<Review[]>([]);

	useEffect(() => {
		// Fetch reviews for the specific courseId from an API
		const fetchReviews = async () => {
			try {
				const response = await fetch(`/api/courses/${courseId}/reviews`);
				const reviewsData = await response.json();

				// Sort reviews by date (descending)
				const sortedReviews = reviewsData.sort((a: Review, b: Review) => {
					return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
				});

				setReviews(sortedReviews);
			} catch (error) {
				console.error("Failed to fetch reviews:", error);
			}
		};

		fetchReviews();
	}, [courseId]);

	// Function to add a new review
	const addReview = (newReview: Review) => {
		setReviews((prevReviews) => [newReview, ...prevReviews]);
	};

	// Calculate average rating and rating distribution
	const { averageRating, ratingDistribution } = useMemo(() => {
		const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
		const avg = reviews.length > 0 ? totalRating / reviews.length : 0;

		const distribution = [1, 2, 3, 4, 5].map((star) => ({
			star,
			count: reviews.filter((review) => review.rating === star).length,
		}));

		return { averageRating: avg, ratingDistribution: distribution };
	}, [reviews]);

	return (
		<div>
			<TotalRating
				reviews={reviews}
				averageRating={averageRating}
				ratingDistribution={ratingDistribution}
			/>

			{/* Render the ReviewForm and pass the addReview function */}
			<ReviewForm courseId={courseId} addReview={addReview} />

			{/* Render the ClientsReviews and pass the reviews */}
			<ClientsReviews reviews={reviews} />
		</div>
	);
};

export default CourseReviews;
