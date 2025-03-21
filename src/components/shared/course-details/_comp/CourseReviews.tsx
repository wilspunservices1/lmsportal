"use client";
import React, { useState, useMemo } from "react";
import ClientsReviews from "./ClientsReviews";
import ReviewForm from "./reviewForm";
import TotalRating from "./TotalRating";

interface Review {
  id: string;
  rating: number;
  comment: string;
  // Add any other fields that a review might have
}

interface CourseReviewsProps {
  courseId: string | number;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({ courseId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  // Function to add a new review
  const addReview = (newReview: Review) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
  };

  // Calculate average rating and rating distribution
  const { averageRating, ratingDistribution } = useMemo(() => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avg = reviews.length > 0 ? totalRating / reviews.length : 0;

    const distribution = [1, 2, 3, 4, 5].map(star => ({
      star,
      count: reviews.filter(review => review.rating === star).length
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