"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CourseReviewsDisplay = ({ courseId }) => {
	const [reviews, setReviews] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (courseId) {
			fetchReviews();
		}
	}, [courseId]);

	const fetchReviews = async () => {
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

	if (isLoading) {
		return <p className="text-gray-600 dark:text-gray-400">Loading testimonials...</p>;
	}

	if (reviews.length === 0) {
		return null;
	}

	return (
		<div className="mb-30px">
			<h4 className="text-size-22 text-blackColor dark:text-blackColor-dark font-bold pl-2 before:w-0.5 relative before:h-[21px] before:bg-primaryColor before:absolute before:bottom-[5px] before:left-0 leading-30px mb-25px">
				What Learners Say
			</h4>

			<Swiper
				modules={[Pagination, Autoplay]}
				slidesPerView={3}
				spaceBetween={20}
				pagination={{ clickable: true }}
				autoplay={{ delay: 5000, disableOnInteraction: false }}
				breakpoints={{
					0: { slidesPerView: 1, spaceBetween: 15 },
					768: { slidesPerView: 2, spaceBetween: 15 },
					1024: { slidesPerView: 3, spaceBetween: 20 },
				}}
				className="reviewsSwiper"
			>
				{reviews.map((review) => (
					<SwiperSlide key={review.id}>
						<div className="bg-white dark:bg-whiteColor-dark border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
							<ReviewCard review={review} />
						</div>
					</SwiperSlide>
				))}
			</Swiper>

			<style jsx>{`
				.reviewsSwiper {
					padding-bottom: 50px;
				}
				.reviewsSwiper .swiper-pagination {
					bottom: 0;
				}
				.reviewsSwiper .swiper-pagination-bullet {
					background: #3f51b5;
				}
				.reviewsSwiper .swiper-pagination-bullet-active {
					background: #3f51b5;
				}
				.reviewsSwiper .swiper-button-next,
				.reviewsSwiper .swiper-button-prev {
					color: #3f51b5;
					top: 50%;
					transform: translateY(-50%);
				}
				.reviewsSwiper .swiper-button-next::after,
				.reviewsSwiper .swiper-button-prev::after {
					font-size: 20px;
				}
			`}</style>
		</div>
	);
};

const ReviewCard = ({ review }) => (
	<>
		{/* Avatar and Name */}
		<div className="flex items-center gap-3 mb-4">
			<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primaryColor to-secondaryColor flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
				{review.reviewerName.charAt(0).toUpperCase()}
			</div>
			<div>
				<h5 className="font-semibold text-blackColor dark:text-blackColor-dark text-sm">
					{review.reviewerName}
				</h5>
				{review.reviewDate && (
					<p className="text-xs text-gray-500 dark:text-gray-400">
						{review.reviewDate}
					</p>
				)}
			</div>
		</div>

		{/* Star Rating */}
		<div className="flex items-center gap-2 mb-4">
			<div className="flex gap-0.5">
				{[...Array(5)].map((_, i) => (
					<span
						key={i}
						className={`text-base ${
							i < review.rating
								? "text-yellow-500"
								: "text-gray-300 dark:text-gray-600"
						}`}
						style={{ color: i < review.rating ? "#FCD34D" : "#D1D5DB" }}
					>
						★
					</span>
				))}
			</div>
			<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
				{review.rating}.0
			</span>
		</div>

		{/* Comment */}
		<p className="text-contentColor dark:text-contentColor-dark text-sm leading-relaxed flex-grow line-clamp-4">
			{review.comment}
		</p>
	</>
);

export default CourseReviewsDisplay;
