"use client";
import Image from "next/image";
import PopupVideo from "../popup/PopupVideo";
import { useCartContext } from "@/contexts/CartContext";
import { formatDate } from "@/actions/formatDate";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSweetAlert from "@/hooks/useSweetAlert";

import { useState, useEffect } from "react";
import SkeletonButton from "@/components/Loaders/BtnSkeleton";
import Link from "next/link";
import PriceDisplay from "@/components/shared/PriceDisplay";

const CourseEnroll = ({ type, course }) => {
	const {
		title = "Default Title",
		price = "0.00",
		estimatedPrice = "0.00",
		insName = "Unknown Instructor",
		thumbnail,
		updatedAt,
		skillLevel = "Beginner",
		demoVideoUrl,
		id: courseId,
		discount = "0.00",
	} = course || {};

	const { addProductToCart, cartProducts } = useCartContext();
	const { data: session } = useSession();

	// Restricted course access
	const RESTRICTED_COURSE_ID = 'd22308b2-9975-4b27-b3b5-1eb1641d9b8e';
	const AUTHORIZED_USER_ID = '10d437d6-c35e-46f5-8d4f-f2de25434bf2';
	const isRestrictedCourse = courseId === RESTRICTED_COURSE_ID;
	const hasAccess = session?.user?.id === AUTHORIZED_USER_ID;
	const isRestricted = isRestrictedCourse && !hasAccess;
	const creteAlert = useSweetAlert();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [isEnrolled, setIsEnrolled] = useState(false);
	const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
	const [firstLectureId, setFirstLectureId] = useState(null);

	const userId = session?.user?.id;

	// Check if the course is already in the cart
	const isInCart = cartProducts.some((product) => product.courseId === courseId);

	useEffect(() => {
		const fetchCourseDetails = async () => {
			try {
				const response = await fetch(`/api/courses/${courseId}`, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});

				if (!response.ok) {
					throw new Error("Failed to fetch course details");
				}

				const data = await response.json();
				const courseDetails = data.data;

				const chapters = courseDetails.chapters || [];
				let foundLectureId = null;

				// Loop through chapters to find the first chapter with order == 1
				for (const chapter of chapters) {
					if (parseInt(chapter.order) === 1) {
						const sortedLectures = (chapter.lectures || []).sort(
							(a, b) => parseInt(a.order) - parseInt(b.order)
						);

						const firstLecture = sortedLectures.find(
							(lecture) => parseInt(lecture.order) === 1
						);

						if (firstLecture) {
							foundLectureId = firstLecture.id;
							break;
						}
					}
				}

				if (foundLectureId) {
					setFirstLectureId(foundLectureId);
				} else {
					setError("No lectures found for this course.");
				}
			} catch (error) {
				setError(String(error?.message || "Failed to fetch course details."));
			} finally {
				setIsCheckingEnrollment(false);
			}
		};

		fetchCourseDetails();
	}, [courseId]);

	useEffect(() => {
		const checkEnrollment = async () => {
			if (userId) {
				try {
					setIsCheckingEnrollment(true);

					const response = await fetch(`/api/user/${userId}/enrollCourses`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
					});

					if (!response.ok) {
						throw new Error("Failed to fetch enrolled courses.");
					}

					const enrolledCourses = await response.json();

					const enrolledCourse = enrolledCourses.find(
						(enrolledCourse) => enrolledCourse.courseId === courseId
					);

					if (enrolledCourse) {
						setIsEnrolled(true);
					} else {
						setIsEnrolled(false);
					}
				} catch (error) {
					setError(typeof error === 'string' ? error : error?.message || "Failed to check enrollment.");
				} finally {
					setIsCheckingEnrollment(false);
				}
			} else {
				setIsEnrolled(false);
				setIsCheckingEnrollment(false);
			}
		};

		checkEnrollment();
	}, [userId, courseId]);

	const handleEnrollClick = async () => {
		if (!session) {
			creteAlert("error", "You need to sign in to proceed with enrollment.");
			router.push("/login");
		} else {
			setLoading(true);
			setError("");

			try {
				const items = [
					{
						name: title,
						price: parseFloat(price).toFixed(2),
						image: thumbnail,
						quantity: 1,
						courseId,
					},
				];

				const userEmail = session.user.email;

				const response = await fetch("/api/paymob/checkout", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ items, userId, email: userEmail, phone: "+966500000000" }),
				});

				if (!response.ok) {
					throw new Error("Failed to create Paymob checkout session");
				}

				const data = await response.json();

				if (data.iframeUrl) {
					window.location.href = data.iframeUrl;
				} else {
					throw new Error("Failed to initialize Paymob payment");
				}
			} catch (error) {
				setError(typeof error === 'string' ? error : error?.message || "Something went wrong during checkout.");
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div
			className="py-33px px-25px shadow-event mb-30px bg-whiteColor dark:bg-whiteColor-dark rounded-md"
			data-aos="fade-up"
		>
			{type !== 3 && (
				<div className="overflow-hidden relative mb-5">
					<Image
						src={thumbnail}
						alt={title}
						width={500}
						height={300}
						className="w-full"
					/>
					<div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center z-10">
						<PopupVideo demoVideoUrl={demoVideoUrl} />
					</div>
				</div>
			)}

			<div
				className={`flex justify-between ${
					type === 2 ? "mt-50px mb-5" : type === 3 ? "mb-50px" : "mb-5"
				}`}
			>
				<div className="text-size-21 font-bold text-primaryColor font-inter leading-25px">
					<PriceDisplay usdPrice={parseFloat(price)} />{" "}
					<del className="text-sm text-lightGrey4 font-semibold">
						/ <PriceDisplay usdPrice={parseFloat(estimatedPrice)} />
					</del>
				</div>
				<div>
					<a
						href="#"
						className="uppercase text-sm font-semibold text-secondaryColor2 leading-27px px-2 bg-whitegrey1 dark:bg-whitegrey1-dark"
					>
						{parseFloat(discount).toFixed(2)}% OFF
					</a>
				</div>
			</div>

			<div className="mb-5" data-aos="fade-up">
				{error && <p className="text-red-500 mb-3">{typeof error === 'string' ? error : 'An error occurred'}</p>}

				{isCheckingEnrollment ? (
					<div className="flex flex-col">
						<SkeletonButton />
						<SkeletonButton />
					</div>
				) : isRestricted ? (
					<div className="text-center p-4">
						<p className="text-red-500 font-semibold mb-2">Access Restricted</p>
						<p className="text-sm text-gray-600">You don't have permission to enroll in this course.</p>
						<button
							className="w-full text-size-15 text-gray-400 bg-gray-200 px-25px py-10px border mb-10px leading-1.8 border-gray-200 cursor-not-allowed inline-block rounded"
							disabled
						>
							Enrollment Disabled
						</button>
					</div>
				) : (
					<>
						{isInCart ? (
							<button
								className="w-full text-size-15 text-whiteColor bg-secondaryColor px-25px py-10px border mb-10px leading-1.8 border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-secondaryColor dark:hover:bg-whiteColor-dark"
								disabled
							>
								Already Added
							</button>
						) : (
							<button
								onClick={() =>
									addProductToCart({
										courseId,
										discount,
										estimatedPrice,
										insName,
										isFree: course.isFree,
										price,
										thumbnail,
										title,
									})
								}
								className="w-full text-size-15 text-whiteColor bg-secondaryColor px-25px py-10px border mb-10px leading-1.8 border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-secondaryColor dark:hover:bg-whiteColor-dark"
							>
								Add To Cart
							</button>
						)}

						{isEnrolled && firstLectureId ? (
							<button
								onClick={() => router.push(`/lessons/${firstLectureId}`)}
								className="w-full text-size-15 text-whiteColor bg-secondaryColor px-25px py-10px mb-10px leading-1.8 border border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-secondaryColor dark:hover:bg-whiteColor-dark"
							>
								Go to Course
							</button>
						) : (
							<button
								onClick={handleEnrollClick}
								className={`w-full text-size-15 text-whiteColor bg-secondaryColor px-25px py-10px mb-10px leading-1.8 border border-secondaryColor hover:text-secondaryColor hover:bg-whiteColor inline-block rounded group dark:hover:text-secondaryColor dark:hover:bg-whiteColor-dark ${
									loading ? "cursor-not-allowed opacity-50" : ""
								}`}
								disabled={loading}
							>
								{loading ? "Processing..." : "Enroll Now"}
							</button>
						)}
					</>
				)}
			</div>

			<ul>
				<li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
					<p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
						Developed By:
					</p>
					<p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
						Meridian
					</p>
				</li>
				<li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
					<p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
						Start Date:
					</p>
					<p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
						{formatDate(updatedAt)}
					</p>
				</li>
				<li className="flex items-center justify-between py-10px border-b border-borderColor dark:border-borderColor-dark">
					<p className="text-sm font-medium text-contentColor dark:text-contentColor-dark leading-1.8">
						Skill Level:
					</p>
					<p className="text-xs text-contentColor dark:text-contentColor-dark px-10px py-6px bg-borderColor dark:bg-borderColor-dark rounded-full leading-13px">
						{skillLevel}
					</p>
				</li>
			</ul>

			<div className="mt-5" data-aos="fade-up">
				<p className="text-sm text-contentColor dark:text-contentColor-dark leading-1.8 text-center mb-5px">
					More inquiry about course
				</p>
				<button
					type="submit"
					className="w-full text-xl text-primaryColor bg-whiteColor px-25px py-10px mb-10px font-bold leading-1.8 border border-primaryColor hover:text-whiteColor hover:bg-primaryColor inline-block rounded group dark:bg-whiteColor-dark dark:text-whiteColor dark:hover:bg-primaryColor"
				>
					<i className="icofont-email"></i> training@meqmp.com
				</button>
			</div>
		</div>
	);
};

export default CourseEnroll;