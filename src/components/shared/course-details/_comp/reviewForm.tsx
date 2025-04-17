"use client";
import React, { useState } from "react";
import useSweetAlert from "@/hooks/useSweetAlert";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import Loader from "@/components/sections/create-course/_comp/Icons/Loader";

const ReviewForm = ({ courseId, addReview }) => {
	const showAlert = useSweetAlert();
	const { data: session } = useSession() as { data: Session | null };
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		rating: 0, // Initial rating set to 0
		comment: "",
		name: session?.user?.name || "",
		avatar_url:
			session?.user?.image ||
			"https://res.cloudinary.com/dhtfqs21w/image/upload/v1743069984/courses/herobanner__video.jpg?fl_attachment=herobanner__video.jpg", // Changed `avatar` to `avatar_url`
	});

	// Handle form input change
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Validate the rating
		if (formData.rating < 1 || formData.rating > 5) {
			showAlert("error", "Rating must be between 1 and 5");
			setLoading(false);
			return;
		}

		// Validate the comment
		if (!formData.comment || formData.comment.length < 5) {
			showAlert("error", "Please provide a more detailed comment.");
			setLoading(false);
			return;
		}

		// Handle default avatar if not provided
		const avatarUrl = formData.avatar_url || "/default-avatar.png"; // Default avatar URL

		try {
			// Make the POST request to the /api/reviews endpoint
			const response = await fetch(`/api/courses/${courseId}/reviews`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					course_id: courseId, // Pass the course ID
					user_id: session?.user?.id, // Assuming session has user data
					rating: formData.rating,
					comment: formData.comment,
					avatar_url: avatarUrl, // Default avatar URL
					is_visible: true, // Default visibility
				}),
			});

			const result = await response.json();

			if (response.ok) {
				// Add the new review to the list
				const newReview = {
					name: formData.name,
					rating: formData.rating,
					comment: formData.comment,
					date: new Date().toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					}),
					avatar_url: avatarUrl, // Include avatar URL
				};
				addReview(newReview); // Call the addReview function to update state

				showAlert("success", "Review submitted successfully");

				// Reset the form
				setFormData((prev) => ({
					...prev,
					rating: 0,
					comment: "",
				}));
			} else {
				showAlert("error", result.message || "Failed to submit the review");
			}
      window.location.reload();
		} catch (error) {
			console.error("Error submitting review:", error);
			showAlert("error", "Error submitting review. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Function to update the star rating
	const handleStarClick = (rating: number) => {
		setFormData({ ...formData, rating });
	};

	return (
		<div className="p-5 md:p-50px mb-50px bg-lightGrey12 dark:bg-transparent dark:shadow-brand-dark">
			<h4
				className="text-2xl font-bold text-blackColor dark:text-blackColor-dark mb-15px !leading-1.2"
				data-aos="fade-up"
			>
				Add a Review
			</h4>
			<div className="flex gap-15px items-center mb-30px">
				<h6 className="font-bold text-blackColor dark:text-blackColor-dark !leading-[19.2px]">
					Your Ratings:
				</h6>
				<div className="text-secondaryColor leading-1.8">
					{[1, 2, 3, 4, 5].map((star) => (
						<i
							key={star}
							className={`icofont-star ${
								formData.rating >= star ? "text-primaryColor" : ""
							} hover:text-primaryColor cursor-pointer`}
							onClick={() => handleStarClick(star)}
						></i>
					))}
				</div>
			</div>
			<form className="pt-5" data-aos="fade-up" onSubmit={handleSubmit}>
				<textarea
					name="comment"
					placeholder="Type your comments...."
					className="w-full p-5 mb-8 bg-transparent text-sm text-blackColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border border-transparent dark:border-borderColor2-dark placeholder:text-placeholder"
					cols={30}
					rows={6}
					value={formData.comment}
					onChange={handleInputChange}
					required
				/>
				<div className="grid grid-cols-1 mb-10 gap-10">
					<div className="w-full pl-5 bg-transparent text-sm text-blackColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border border-transparent dark:border-borderColor2-dark placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded">
						<p className="font-medium">{session?.user?.name || "User Name"}</p>{" "}
						{/* Display user name */}
					</div>
					<div className="w-full pl-5 bg-transparent text-sm text-blackColor dark:text-contentColor-dark bg-whiteColor dark:bg-whiteColor-dark border border-transparent dark:border-borderColor2-dark placeholder:text-placeholder placeholder:opacity-80 h-15 leading-15 font-medium rounded">
						<p className="font-medium">{session?.user?.email || "Email"}</p>{" "}
						{/* Display user email */}
					</div>
				</div>

				{loading ? (
					<p className="flex">
						<Loader />
					</p>
				) : (
					<div className="mt-30px">
						<button
							type="submit"
							className="text-size-15 text-whiteColor bg-primaryColor px-25px py-10px border border-primaryColor hover:text-primaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-whiteColor-dark"
							disabled={loading}
						>
							Submit
						</button>
					</div>
				)}
			</form>
		</div>
	);
};

export default ReviewForm;
