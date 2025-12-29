"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";

const TestimonialsSlider = () => {
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/google-reviews-5star")
			.then(res => res.json())
			.then(data => setReviews(data.reviews || []))
			.catch(() => setReviews([]))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <div className="text-center py-10">Loading reviews...</div>;
	if (reviews.length === 0) return <div className="text-center py-10">No reviews available</div>;

	return (
		<div style={{ position: "relative", paddingBottom: "60px" }}>
			<Swiper
				modules={[Pagination, Autoplay]}
				slidesPerView={1}
				spaceBetween={20}
				breakpoints={{
					640: { slidesPerView: 2, spaceBetween: 20 },
					1024: { slidesPerView: 4, spaceBetween: 20 },
					1280: { slidesPerView: 5, spaceBetween: 20 }
				}}
				pagination={{ clickable: true }}
				autoplay={{ delay: 5000, disableOnInteraction: false }}
				loop={true}
				style={{ paddingBottom: "50px" }}
			>
				{reviews.map((review, index) => (
					<SwiperSlide key={`${index}`}>
						<div className="bg-white dark:bg-whiteColor-dark border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm h-full flex flex-col">
							<div className="flex items-center gap-2 mb-4 justify-center">
								<div className="flex gap-0.5">
									{[0, 1, 2, 3, 4].map((i) => (
										<span key={i} style={{ color: i < review.rating ? "#FCD34D" : "#D1D5DB" }} className="text-lg">★</span>
									))}
								</div>
								<span className="text-sm font-medium text-gray-600 dark:text-gray-400">{review.rating}.0</span>
							</div>

							<p className="text-contentColor dark:text-contentColor-dark text-sm leading-relaxed mb-6 flex-grow">
								{review.text}
							</p>

							<div className="text-center">
								<h5 className="font-semibold text-blackColor dark:text-blackColor-dark">
									{review.author_name || "Anonymous"}
								</h5>
								{review.time && (
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{new Date(review.time * 1000).toLocaleDateString()}
									</p>
								)}
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};

export default TestimonialsSlider;
