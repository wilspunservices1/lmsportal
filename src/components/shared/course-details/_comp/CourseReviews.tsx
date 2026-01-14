"use client";
import React, { useEffect, useState, useMemo } from "react";
import ClientsReviews from "./ClientsReviews";
import ReviewForm from "./reviewForm";
import TotalRating from "./TotalRating";

interface Review {
	id: string;
	rating: number;
	comment: string;
	avatar_url?: string;
	user_id?: string;
	created_at?: string;
	name?: string;
	username?: string;
}

interface CourseReviewsProps {
	courseId: string | number;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
	const [studentReviews, setStudentReviews] = useState<Review[]>([]);
	const [allReviews, setAllReviews] = useState<Review[]>([]); // For stats calculation
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAllReviews = async () => {
			try {
				setLoading(true);
				
				// Fetch instructor reviews (for stats only)
				const instructorResponse = await fetch(`/api/courses/${courseId}/reviews?type=instructor`);
				const instructorData = instructorResponse.ok ? await instructorResponse.json() : { reviews: [] };
				const instructorReviews = (instructorData.reviews || []).map((review: any) => ({
					id: review.id,
					rating: review.rating,
					comment: review.comment,
					created_at: review.reviewDate || new Date().toISOString(),
				}));

				// Fetch student reviews (for display)
				const studentResponse = await fetch(`/api/courses/${courseId}/reviews`);
				const fetchedStudentReviews = studentResponse.ok ? await studentResponse.json() : [];

				// Sort student reviews by date
				const sortedStudentReviews = fetchedStudentReviews.sort((a: Review, b: Review) => {
					const dateA = new Date(b.created_at || new Date()).getTime();
					const dateB = new Date(a.created_at || new Date()).getTime();
					return dateA - dateB;
				});

				// Combine reviews for statistics calculation ONLY
				const combinedForStats = [...instructorReviews, ...fetchedStudentReviews];

				setStudentReviews(sortedStudentReviews);
				setAllReviews(combinedForStats);
			} catch (error) {
				console.error("Failed to fetch reviews:", error);
			} finally {
				setLoading(false);
			}
		};

		if (courseId) {
			fetchAllReviews();
		}
	}, [courseId]);

	// Function to add a new review
	const addReview = (newReview: Review) => {
		setStudentReviews((prevReviews) => [newReview, ...prevReviews]);
		setAllReviews((prevReviews) => [newReview, ...prevReviews]);
	};

	// Calculate average rating and distribution using ALL reviews
	const { averageRating, ratingDistribution } = useMemo(() => {
		const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
		const avg = allReviews.length > 0 ? totalRating / allReviews.length : 0;

		const distribution = [1, 2, 3, 4, 5].map((star) => ({
			star,
			count: allReviews.filter((review) => review.rating === star).length,
		}));

		return { averageRating: avg, ratingDistribution: distribution };
	}, [allReviews]);

	return (
		<div>
			<TotalRating
				reviews={allReviews}
				averageRating={averageRating}
				ratingDistribution={ratingDistribution}
			/>

			{/* Render the ReviewForm and pass the addReview function */}
			<ReviewForm courseId={courseId} addReview={addReview} />

			{/* Render only STUDENT reviews in the Customer Reviews section */}
			<ClientsReviews reviews={studentReviews} />
		</div>
	);
};

export default CourseReviews;
