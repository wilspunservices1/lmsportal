"use client";

import React, { useState, useEffect } from "react";
import CourseContent from "./_comp/CourseContent";
import ChapterItem from "./_comp/ChapterItem";
import { useRouter } from "next/navigation";
import useSweetAlert from "@/hooks/useSweetAlert";
import CourseRight from "./_comp/CourseRight";
import Link from "next/link";
import useChapterEditing from "./hooks/useChapterEditing"; // Ensure correct import path
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import CertificatesTemp from "./_comp/Certificates";

const CreateCoursePrimary = () => {
	const {
		chapters,
		addChapter,
		removeChapter,
		updateChapter,
		setInitialChapters,
	} = useChapterEditing([]);

	const [initialCourseData, setInitialCourseData] = useState(null);
	const [courseId, setCourseId] = useState("");
	const showAlert = useSweetAlert();
	const router = useRouter();
	const { id } = useParams();
	const { data: session } = useSession();

	if (!session) {
		router.push("/login");
	}

	// Fetch course data if `id` exists (editing mode)
	useEffect(() => {
		const fetchCourse = async () => {
			if (id) {
				try {
					const response = await fetch(`/api/courses/${id}`);
					if (!response.ok)
						throw new Error("Failed to fetch course data");

					const data = await response.json();

					setInitialCourseData(data.data);
					setInitialChapters(data.data.chapters || []);
					setCourseId(data.data.id);
				} catch (error) {
					console.error("Error fetching course data:", error);
				}
			}
		};

		fetchCourse();
	}, [id, setInitialChapters]);

	// ---------------------------- NEW: Final Exam Selection ---------------------------- //

	const [availableFinalExams, setAvailableFinalExams] = useState([]);
	const [selectedFinalExam, setSelectedFinalExam] = useState("");
	const [isLoadingFinalExams, setIsLoadingFinalExams] = useState(false);

	useEffect(() => {
		const fetchFinalExams = async () => {
			setIsLoadingFinalExams(true);
			try {
				const response = await fetch("/api/questionnaire/list");
				if (!response.ok)
					throw new Error("Failed to fetch final exams");

				const data = await response.json();
				setAvailableFinalExams(data.questionnaires);
			} catch (error) {
				console.error("Error fetching final exams:", error);
				showAlert("error", "Failed to load final exams.");
			} finally {
				setIsLoadingFinalExams(false);
			}
		};

		fetchFinalExams();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleAssignFinalExam = async () => {
		if (!selectedFinalExam) {
			showAlert("error", "Please select a final exam.");
			return;
		}

		if (!courseId) {
			showAlert("error", "Course ID is missing.");
			return;
		}

		try {
			const response = await fetch(
				`/api/courses/final-exam/${courseId}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						courseId: courseId,
						finalExamId: selectedFinalExam,
					}),
				}
			);

			if (!response.ok) throw new Error("Failed to assign final exam");

			showAlert("success", "Final Exam assigned successfully!");
		} catch (error) {
			console.error("Error assigning final exam:", error);
			showAlert("error", "Failed to assign final exam.");
		}
	};

	// ---------------------------- END: Final Exam Selection ---------------------------- //

	// Function to update course status
	const updateCourseStatus = async (courseId) => {
		if (!courseId && initialCourseData) {
			courseId = initialCourseData.id;
		}

		try {
			const response = await fetch(`/api/courses/${courseId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ isPublished: true }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				showAlert(
					"error",
					`Failed to publish course: ${
						errorData.message || "Unknown error"
					}`
				);
				return;
			}

			const data = await response.json();
			console.log("Course status updated successfully:", data);
			showAlert("success", "Course status updated successfully!");

			if (initialCourseData) {
				router.push(
					`/lessons/${initialCourseData.chapters[0]?.lectures[0]?.id}`
				);
			} else if (chapters[0]?.lectures[0]?.id) {
				router.push(`/lessons/${chapters[0]?.lectures[0]?.id}`);
			} else {
				router.push(`/courses/${courseId}`);
			}
		} catch (error) {
			console.error("Failed to publish course:", error.message);
			showAlert("error", "Failed to publish course. Please try again.");
		}
	};

	return (
		<div>
			<div
				className="container h-auto pt-100px pb-100px"
				data-aos="fade-up"
			>
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-x-30px gap-y-5">
					{/* Left side - Create/Edit course content */}
					<div className="lg:col-start-1 lg:col-span-8">
						<ul className="accordion-container curriculum create-course">
							{/* Accordion for Course Info */}
							<li className="accordion h-auto mb-5 active">
								<div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-t-md">
									<div className="py-5 px-30px">
										<div className="accordion-controller flex justify-between items-center text-lg text-headingColor font-semibold">
											<span>
												{id
													? "Edit Course Info"
													: "Course Info"}
											</span>
											<svg
												className="transition-all duration-500 rotate-0"
												width="20"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 16 16"
												fill="#212529"
											>
												<path
													fillRule="evenodd"
													d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
												/>
											</svg>
										</div>
									</div>
									{/* CourseContent Component */}
									<CourseContent
										setCourseId={setCourseId}
										initialData={initialCourseData}
										isEditMode={!!id}
									/>
								</div>
							</li>
							<li className="accordion mb-5">
								<CertificatesTemp courseId={id || courseId} />
							</li>

							{/* ------------------------ NEW: Final Exam Selection Component ------------------------ */}
							<li className="accordion mb-5">
								<div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-t-md p-4">
									<h3 className="text-lg font-semibold mb-3">
										Assign Final Exam
									</h3>
									<div className="flex gap-4">
										<select
											value={selectedFinalExam}
											onChange={(e) =>
												setSelectedFinalExam(
													e.target.value
												)
											}
											className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primaryColor"
											disabled={isLoadingFinalExams}
										>
											<option value="">
												{isLoadingFinalExams
													? "Loading..."
													: "Select a Final Exam"}
											</option>
											{availableFinalExams.map((exam) => (
												<option
													key={exam.id}
													value={exam.id}
												>
													{exam.title} (
													{exam.questionsCount}{" "}
													questions)
												</option>
											))}
										</select>
										<button
											onClick={handleAssignFinalExam}
											disabled={!selectedFinalExam}
											className="px-4 py-2 bg-primaryColor text-white rounded hover:bg-opacity-90"
										>
											Assign Final Exam
										</button>
									</div>
								</div>
							</li>
							{/* ------------------------ END: Final Exam Selection Component ------------------------ */}

							{/* Dynamic Chapters */}
							{chapters.map((chapter, index) => (
								<ChapterItem
									key={chapter.id}
									courseId={id || courseId}
									chapter={chapter}
									index={index}
									updateChapter={updateChapter}
									removeChapter={removeChapter}
								/>
							))}
						</ul>

						{/* Add Chapter Button */}
						<div className="flex justify-center mt-5">
							<button
								className="text-green-500 text-xl"
								onClick={addChapter}
								aria-label="Add Chapter"
							>
								+ Add Chapter
							</button>
						</div>

						{/* Preview and Publish Buttons */}
						<div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-30px gap-y-5">
							<div className="lg:col-start-1 lg:col-span-4">
								<Link
									href={`/lessons/${chapters[0]?.lectures[0]?.id}`}
									className="text-whiteColor bg-primaryColor w-full p-13px hover:text-whiteColor hover:bg-secondaryColor inline-block rounded group text-center"
									aria-label="Preview course"
								>
									Preview
								</Link>
							</div>

							<div className="lg:col-start-5 lg:col-span-8">
								<button
									type="button"
									onClick={() => updateCourseStatus(courseId)}
									className="text-whiteColor bg-primaryColor w-full p-13px hover:text-whiteColor hover:bg-secondaryColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-secondaryColor text-center"
									aria-label="Create course"
								>
									Publish Course
								</button>
							</div>
						</div>
					</div>

					{/* Right side - Course Extras Setup */}
					<CourseRight
						courseId={id || courseId}
						extras={initialCourseData?.extras || {}}
					/>
				</div>
			</div>
		</div>
	);
};

export default CreateCoursePrimary;

// "use client";

// import React, { useState, useEffect } from "react";
// import CourseContent from "./_comp/CourseContent";
// import ChapterItem from "./_comp/ChapterItem";
// import { useRouter } from "next/navigation";
// import useSweetAlert from "@/hooks/useSweetAlert";
// import CourseRight from "./_comp/CourseRight";
// import Link from "next/link";
// import useChapterEditing from "./hooks/useChapterEditing"; // Ensure correct import path
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import CertificatesTemp from "./_comp/Certificates";

// const CreateCoursePrimary = () => {
// 	const {
// 		chapters,
// 		addChapter,
// 		removeChapter,
// 		updateChapter,
// 		setInitialChapters,
// 	} = useChapterEditing([]);

// 	const [initialCourseData, setInitialCourseData] = useState(null);
// 	// State to store the course ID
// 	const [courseId, setCourseId] = useState("");
// 	const showAlert = useSweetAlert();
// 	const router = useRouter();
// 	const { id } = useParams();
// 	const { data: session } = useSession();

// 	if (!session) {
// 		router.push("/login");
// 	}

// 	// console.log("initialCourseData",initialCourseData)

// 	// console.log("course add course id from chapter Items",courseId)

// 	// Fetch course data if `id` exists (editing mode)
// 	useEffect(() => {
// 		const fetchCourse = async () => {
// 			if (id) {
// 				try {
// 					const response = await fetch(`/api/courses/${id}`);
// 					if (!response.ok)
// 						throw new Error("Failed to fetch course data");

// 					const data = await response.json();

// 					setInitialCourseData(data.data);
// 					setInitialChapters(data.data.chapters || []);
// 					setCourseId(data.data.id);
// 				} catch (error) {
// 					console.error("Error fetching course data:", error);
// 				}
// 			}
// 		};

// 		fetchCourse();
// 	}, [id, setInitialChapters]);

// 	// ---------------------------- NEW: Final Exam Selection ---------------------------- //

// 	const [availableFinalExams, setAvailableFinalExams] = useState([]); // Stores list of final exam options
// 	const [selectedFinalExam, setSelectedFinalExam] = useState(""); // Stores selected final exam
// 	const [isLoadingFinalExams, setIsLoadingFinalExams] = useState(false); // Loading state for fetching final exams

// 	useEffect(() => {
// 		const fetchFinalExams = async () => {
// 			setIsLoadingFinalExams(true);
// 			try {
// 				const response = await fetch("/api/questionnaire/list");
// 				if (!response.ok)
// 					throw new Error("Failed to fetch final exams");

// 				const data = await response.json();
// 				setAvailableFinalExams(data.questionnaires);
// 			} catch (error) {
// 				console.error("Error fetching final exams:", error);
// 				showAlert("error", "Failed to load final exams.");
// 			} finally {
// 				setIsLoadingFinalExams(false);
// 			}
// 		};

// 		fetchFinalExams();
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, []); // Fetch final exam options on mount

// 	const handleAssignFinalExam = async () => {
// 		if (!selectedFinalExam) {
// 			showAlert("error", "Please select a final exam.");
// 			return;
// 		}

// 		if (!courseId) {
// 			showAlert("error", "Course ID is missing.");
// 			return;
// 		}

// 		try {
//       const response = await fetch(`/api/courses/final-exam/${courseId}`, {
// 				method: "PATCH",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({
// 					courseId: courseId, // ✅ Assign the course ID
// 					finalExamId: selectedFinalExam, // ✅ Store selected Final Exam
// 				}),
// 			});

// 			if (!response.ok) throw new Error("Failed to assign final exam");

// 			showAlert("success", "Final Exam assigned successfully!");
// 		} catch (error) {
// 			console.error("Error assigning final exam:", error);
// 			showAlert("error", "Failed to assign final exam.");
// 		}
// 	};

// 	// ---------------------------- END: Final Exam Selection ---------------------------- //

// 	// Function to update course status
// 	const updateCourseStatus = async (courseId) => {
// 		if (!courseId && initialCourseData) {
// 			courseId = initialCourseData.id;
// 		}

// 		try {
// 			const response = await fetch(`/api/courses/${courseId}`, {
// 				method: "PATCH",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({ isPublished: true }),
// 			});

// 			// Check if the response is OK (status in the range 200-299)
// 			if (!response.ok) {
// 				const errorData = await response.json();
// 				showAlert(
// 					"error",
// 					`Failed to publish course: ${
// 						errorData.message || "Unknown error"
// 					}`
// 				);
// 				return; // Exit the function after handling the error
// 			}

// 			// Parse the response JSON if status is OK
// 			const data = await response.json();
// 			console.log("Course status updated successfully:", data);
// 			showAlert("success", "Course status updated successfully!");

// 			if (initialCourseData) {
// 				router.push(
// 					`/lessons/${initialCourseData.chapters[0]?.lectures[0]?.id}`
// 				);
// 			} else if (chapters[0]?.lectures[0]?.id) {
// 				// Redirect to the preview page after successful publish
// 				router.push(`/lessons/${chapters[0]?.lectures[0]?.id}`); // Navigate to the "preview" page
// 			} else {
// 				// Redirect to the preview page after successful publish
// 				router.push(`/courses/${courseId}`);
// 			}
// 		} catch (error) {
// 			console.error("Failed to publish course:", error.message);
// 			showAlert("error", "Failed to publish course. Please try again.");
// 		}
// 	};

// 	return (
// 		<div>
// 			<div
// 				className="container h-auto pt-100px pb-100px"
// 				data-aos="fade-up"
// 			>
// 				<div className="grid grid-cols-1 lg:grid-cols-12 gap-x-30px gap-y-5">
// 					{/* Left side - Create/Edit course content */}
// 					<div className="lg:col-start-1 lg:col-span-8">
// 						<ul className="accordion-container curriculum create-course">
// 							{/* Accordion for Course Info */}
// 							<li className="accordion h-auto mb-5 active">
// 								<div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-t-md">
// 									<div className="py-5 px-30px">
// 										<div className="accordion-controller flex justify-between items-center text-lg text-headingColor font-semibold">
// 											<span>
// 												{id
// 													? "Edit Course Info"
// 													: "Course Info"}
// 											</span>
// 											<svg
// 												className="transition-all duration-500 rotate-0"
// 												width="20"
// 												xmlns="http://www.w3.org/2000/svg"
// 												viewBox="0 0 16 16"
// 												fill="#212529"
// 											>
// 												<path
// 													fillRule="evenodd"
// 													d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
// 												/>
// 											</svg>
// 										</div>
// 									</div>
// 									{/* CourseContent Component */}
// 									<CourseContent
// 										setCourseId={setCourseId}
// 										initialData={initialCourseData}
// 										isEditMode={!!id}
// 									/>
// 								</div>
// 							</li>
// 							<li className="accordion mb-5">
// 								<CertificatesTemp courseId={id || courseId} />
// 							</li>

// 							{/* ------------------------ NEW: Final Exam Selection Component ------------------------ */}
// 							<li className="accordion mb-5">
// 								<div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-t-md p-4">
// 									<h3 className="text-lg font-semibold mb-3">
// 										Assign Final Exam
// 									</h3>
// 									<div className="flex gap-4">
// 										<select
// 											value={selectedFinalExam}
// 											onChange={(e) =>
// 												setSelectedFinalExam(
// 													e.target.value
// 												)
// 											}
// 											className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primaryColor"
// 											disabled={isLoadingFinalExams}
// 										>
// 											<option value="">
// 												{isLoadingFinalExams
// 													? "Loading..."
// 													: "Select a Final Exam"}
// 											</option>
// 											{availableFinalExams.map((exam) => (
// 												<option
// 													key={exam.id}
// 													value={exam.id}
// 												>
// 													{exam.title} (
// 													{exam.questionsCount}{" "}
// 													questions)
// 												</option>
// 											))}
// 										</select>
// 										<button
// 											onClick={handleAssignFinalExam}
// 											disabled={!selectedFinalExam}
// 											className="px-4 py-2 bg-primaryColor text-white rounded hover:bg-opacity-90"
// 										>
// 											Assign Final Exam
// 										</button>
// 									</div>
// 								</div>
// 							</li>
// 							{/* ------------------------ END: Final Exam Selection Component ------------------------ */}

// 							{/* Dynamic Chapters */}
// 							{chapters.map((chapter, index) => (
// 								<ChapterItem
// 									key={chapter.id}
// 									courseId={id || courseId}
// 									chapter={chapter}
// 									index={index}
// 									updateChapter={updateChapter}
// 									removeChapter={removeChapter}
// 								/>
// 							))}
// 						</ul>

// 						{/* Add Chapter Button */}
// 						<div className="flex justify-center mt-5">
// 							<button
// 								className="text-green-500 text-xl"
// 								onClick={addChapter}
// 								aria-label="Add Chapter"
// 							>
// 								+ Add Chapter
// 							</button>
// 						</div>

// 						{/* Preview and Publish Buttons */}
// 						<div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-30px gap-y-5">
// 							<div className="lg:col-start-1 lg:col-span-4">
// 								<Link
// 									href={`/lessons/${chapters[0]?.lectures[0]?.id}`}
// 									className="text-whiteColor bg-primaryColor w-full p-13px hover:text-whiteColor hover:bg-secondaryColor inline-block rounded group text-center"
// 									aria-label="Preview course"
// 								>
// 									Preview
// 								</Link>
// 							</div>

// 							<div className="lg:col-start-5 lg:col-span-8">
// 								<button
// 									type="button"
// 									onClick={() => updateCourseStatus(courseId)}
// 									className="text-whiteColor bg-primaryColor w-full p-13px hover:text-whiteColor hover:bg-secondaryColor inline-block rounded group dark:hover:text-whiteColor dark:hover:bg-secondaryColor text-center"
// 									aria-label="Create course"
// 								>
// 									Publish Course
// 								</button>
// 							</div>
// 						</div>
// 					</div>

// 					{/* Right side - Course Extras Setup */}
// 					<CourseRight
// 						courseId={id || courseId}
// 						extras={initialCourseData?.extras || {}} // Pass extras from the fetched course data
// 					/>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default CreateCoursePrimary;
