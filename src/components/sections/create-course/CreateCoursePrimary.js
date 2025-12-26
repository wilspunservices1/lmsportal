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
import CourseFAQManager from "./_comp/CourseFAQManager";
import CourseReviewManager from "./_comp/CourseReviewManager";

const CreateCoursePrimary = () => {
	const {
		chapters,
		addChapter,
		removeChapter,
		updateChapter,
		setInitialChapters,
	} = useChapterEditing([]);

	// Handle chapter reordering
	const handleReorderChapters = async (draggedIndex, targetIndex) => {
		if (draggedIndex === targetIndex) return;
		
		const newChapters = [...chapters];
		const [draggedChapter] = newChapters.splice(draggedIndex, 1);
		newChapters.splice(targetIndex, 0, draggedChapter);
		
		// Update order property for all chapters
		const updatedChapters = newChapters.map((chapter, index) => ({
			...chapter,
			order: (index + 1).toString()
		}));
		
		setInitialChapters(updatedChapters);
		
		// Save the updated order to database only for existing chapters
		if ((courseId || id) && updatedChapters.length > 0) {
			// Filter out chapters that don't have valid database IDs (new chapters)
			const existingChapters = updatedChapters.filter(chapter => 
				chapter.id && !chapter.id.toString().startsWith('temp_') && !isNaN(parseInt(chapter.id))
			);
			
			if (existingChapters.length > 0) {
				try {
					const response = await fetch(`/api/courses/${courseId || id}/chapters/reorder`, {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							chapters: existingChapters.map(chapter => ({
								id: chapter.id,
								order: chapter.order
							}))
						})
					});
					
					if (!response.ok) {
						throw new Error('Failed to save chapter order');
					}
					console.log('Chapter order saved successfully');
				} catch (error) {
					console.error('Error saving chapter order:', error);
					showAlert('error', 'Failed to save chapter order');
				}
			}
		}
	};

	const [initialCourseData, setInitialCourseData] = useState(null);
	const [courseId, setCourseId] = useState("");
	const [accessDuration, setAccessDuration] = useState("");
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
					// Sort chapters by order when loading
					const sortedChapters = (data.data.chapters || []).sort((a, b) => 
						parseInt(a.order || 0) - parseInt(b.order || 0)
					);
					setInitialChapters(sortedChapters);
					setCourseId(data.data.id);
					if (data.data.accessDurationMonths) {
						setAccessDuration(data.data.accessDurationMonths.toString());
					}
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
	const [currentFinalExam, setCurrentFinalExam] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoadingFinalExams(true);
			try {
				const response = await fetch(`/api/questionnaire/list?courseId=${id || courseId}`);
				if (!response.ok) throw new Error("Failed to fetch final exams");

				const data = await response.json();
				setAvailableFinalExams(data.questionnaires);
				
				// After loading available exams, fetch current final exam
				if (courseId) {
					const finalExamResponse = await fetch(`/api/courses/final-exam/${courseId}`);
					if (finalExamResponse.ok) {
						const finalExamData = await finalExamResponse.json();
						if (finalExamData.finalExamId) {
							setSelectedFinalExam(finalExamData.finalExamId);
							const examDetails = data.questionnaires.find(
								exam => exam.id === finalExamData.finalExamId
							);
							setCurrentFinalExam(examDetails);
						}
					}
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				showAlert("error", "Failed to load exam data");
			} finally {
				setIsLoadingFinalExams(false);
			}
		};

		fetchData();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [courseId]);

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
			const response = await fetch(`/api/courses/final-exam/${courseId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					finalExamId: selectedFinalExam,
				}),
			});

			if (!response.ok) throw new Error("Failed to assign final exam");

			// Update the current final exam
			const examDetails = availableFinalExams.find(
				exam => exam.id === selectedFinalExam
			);
			setCurrentFinalExam(examDetails);
			showAlert("success", "Final Exam assigned successfully!");
		} catch (error) {
			console.error("Error assigning final exam:", error);
			showAlert("error", "Failed to assign final exam.");
		}
	};

	// Add this function in CreateCoursePrimary component
	const fetchCurrentFinalExam = async () => {
		if (!courseId) return;

		try {
			const response = await fetch(`/api/courses/final-exam/${courseId}`);
			if (!response.ok) throw new Error("Failed to fetch final exam");

			const data = await response.json();
			if (data.finalExamId) {
				setSelectedFinalExam(data.finalExamId);
				// Find the exam details from availableFinalExams
				const examDetails = availableFinalExams.find(exam => exam.id === data.finalExamId);
				setCurrentFinalExam(examDetails);
			}
		} catch (error) {
			console.error("Error fetching current final exam:", error);
			showAlert("error", "Failed to load current final exam");
		}
	};

	const handleRemoveFinalExam = async () => {
		if (!courseId) {
			showAlert("error", "Course ID is missing.");
			return;
		}

		try {
			const response = await fetch(`/api/courses/final-exam/${courseId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					finalExamId: null,
				}),
			});

			if (!response.ok) throw new Error("Failed to remove final exam");

			setCurrentFinalExam(null);
			setSelectedFinalExam("");
			showAlert("success", "Final Exam removed successfully!");
		} catch (error) {
			console.error("Error removing final exam:", error);
			showAlert("error", "Failed to remove final exam.");
		}
	};

	// ---------------------------- END: Final Exam Selection ---------------------------- //

	// Function to update course status
	const updateCourseStatus = async (passedCourseId) => {
		const finalCourseId = passedCourseId || courseId || id || initialCourseData?.id;
		
		if (!finalCourseId) {
			showAlert("error", "Course ID is missing. Please save the course first.");
			return;
		}

		try {
			const updateData = { isPublished: true };
			if (accessDuration) {
				updateData.accessDurationMonths = parseInt(accessDuration);
			}

			const response = await fetch(`/api/courses/${finalCourseId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updateData),
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
				router.push(`/courses/${finalCourseId}`);
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

							{/* Course Final Examination Component */}
							<li className="accordion mb-5">
								<div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-md p-6">
									<div className="border-b pb-4 mb-4">
										<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
											Course Final Examination
										</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
											Assign a final exam that students must complete to finish the course
										</p>
									</div>
							
									{currentFinalExam ? (
										<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
											<div className="flex justify-between items-center">
												<div>
													<h4 className="font-medium text-blue-700 dark:text-blue-300">
														{currentFinalExam.title}
													</h4>
													<p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
														{currentFinalExam.questionsCount} questions
													</p>
												</div>
												<button
													onClick={handleRemoveFinalExam}
													className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 
															 transition-colors duration-200 flex items-center gap-2 px-3 py-1 rounded-md 
															 hover:bg-red-50 dark:hover:bg-red-900/20"
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
													<span>Remove Exam</span>
												</button>
											</div>
										</div>
									) : (
										<div className="space-y-4">
											<div className="relative">
												<select
													value={selectedFinalExam}
													onChange={(e) => setSelectedFinalExam(e.target.value)}
													className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primaryColor 
															 focus:border-primaryColor bg-white dark:bg-gray-800
															 disabled:bg-gray-100 dark:disabled:bg-gray-700"
													disabled={isLoadingFinalExams}
												>
													<option value="">
														{isLoadingFinalExams ? "Loading available exams..." : "Select an exam to assign"}
													</option>
													{availableFinalExams.map((exam) => (
														<option key={exam.id} value={exam.id}>
															{exam.title} ({exam.questionsCount} questions)
														</option>
													))}
												</select>
											</div>
											
											<div className="flex justify-end">
												<button
													onClick={handleAssignFinalExam}
													disabled={!selectedFinalExam || isLoadingFinalExams}
													className="px-6 py-2.5 bg-primaryColor text-white rounded-lg
															 hover:bg-opacity-90 transition-colors duration-200
															 disabled:opacity-50 disabled:cursor-not-allowed
															 flex items-center gap-2"
												>
													<svg 
														xmlns="http://www.w3.org/2000/svg" 
														width="16" 
														height="16" 
														fill="currentColor" 
														viewBox="0 0 16 16"
													>
														<path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
													</svg>
													<span>Assign Final Exam</span>
												</button>
											</div>
										</div>
									)}
								</div>
							</li>

							{/* Course FAQs Section */}
							<li className="accordion mb-5">
								<div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-md p-6">
									<div className="border-b pb-4 mb-4">
										<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
											Course FAQs
										</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
											Add frequently asked questions for this course
										</p>
									</div>
									<CourseFAQManager courseId={id || courseId} />
								</div>
							</li>

							{/* Course Reviews Section */}
							<li className="accordion mb-5">
								<div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-md p-6">
									<div className="border-b pb-4 mb-4">
										<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
											Course Reviews
										</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
											Manage reviews that will be displayed on the course page
										</p>
									</div>
									<CourseReviewManager courseId={id || courseId} />
								</div>
							</li>

							{/* Dynamic Chapters */}
							{chapters.map((chapter, index) => (
								<ChapterItem
									key={chapter.id}
									courseId={id || courseId}
									chapter={chapter}
									index={index}
									updateChapter={updateChapter}
									removeChapter={removeChapter}
									onReorderChapters={handleReorderChapters}
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
						<div className="mt-10">
							{/* Access Duration Section */}
						<div className="bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-md p-6 mb-5">
							<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
								Course Access Duration
							</h3>
							<select
								id="accessDuration"
								value={accessDuration}
								onChange={(e) => setAccessDuration(e.target.value)}
								className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primaryColor focus:border-primaryColor bg-white dark:bg-gray-800"
							>
								<option value="">Select duration</option>
								<option value="1">1 Month</option>
								<option value="2">2 Months</option>
								<option value="3">3 Months</option>
								<option value="4">4 Months</option>
								<option value="5">5 Months</option>
								<option value="6">6 Months</option>
								<option value="7">7 Months</option>
								<option value="8">8 Months</option>
								<option value="9">9 Months</option>
								<option value="10">10 Months</option>
								<option value="11">11 Months</option>
								<option value="12">12 Months</option>
							</select>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
								Students will get access for this duration from their enrollment date
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-30px gap-y-5">
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