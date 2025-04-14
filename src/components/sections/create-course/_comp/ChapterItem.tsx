"use client";
import React, { useCallback, useState, useEffect } from "react";
import CurriculumContent from "./CorriculumContent";
import { Lecture, Chapter } from "@/types/type";
import CreateLecture from "./CreateLecture";
import ChapterAdd from "./ChapterAdd";
import useSweetAlert from "@/hooks/useSweetAlert";
import Tooltip from "./Icons/Tooltip";
import DotLoader from "./Icons/DotLoader";

interface ChapterItemProps {
	chapter: Chapter;
	index: number;
	updateChapter: (index: number, updatedChapter: any) => void;
	removeChapter: (index: number) => void;
	courseId: string;
}

interface Questionnaire {
	id: string;
	title: string;
	questionsCount: number;
	status: "active" | "draft" | "archived";
}

const ChapterItem: React.FC<ChapterItemProps> = ({
	chapter,
	index,
	updateChapter,
	removeChapter,
	courseId,
}) => {
	const [isAccordionOpen, setIsAccordionOpen] = useState(false);
	const [isAddingLecture, setIsAddingLecture] = useState(false);
	const [lectures, setLectures] = useState<Lecture[]>(chapter.lectures || []);
	const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
	const [isSaved, setIsSaved] = useState(!!chapter.title);
	const [chapterId, setChapterId] = useState<string>(
		chapter.id?.toString() || ""
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const showAlert = useSweetAlert();
	const [availableQuestionnaires, setAvailableQuestionnaires] = useState<
		Questionnaire[]
	>([]);
	const [selectedQuestionnaire, setSelectedQuestionnaire] =
		useState<string>("");
		
	const fetchQuestionnaires = useCallback(async () => {
		try {
			const response = await fetch("/api/questionnaire/list");
			if (!response.ok)
				throw new Error(
					`Failed to fetch questionnaires: ${response.status} - ${response.statusText}`
				);

			const data = await response.json();
			setAvailableQuestionnaires(data.questionnaires);
		} catch (error) {
			console.error("Error fetching questionnaires:", error);
			showAlert(
				"error",
				error instanceof Error
					? error.message
					: "Failed to load questionnaires"
			);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		fetchQuestionnaires();
	}, [fetchQuestionnaires]);

	const handleAssignQuestionnaire = async () => {
		if (!selectedQuestionnaire) {
			showAlert("error", "Please select a questionnaire");
			return;
		}

		try {
			const response = await fetch("/api/questionnaire/assign", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					questionnaireId: selectedQuestionnaire,
					courseId: courseId,
					chapterId: chapterId,
				}),
			});

			if (!response.ok) throw new Error("Failed to assign questionnaire");

			const updatedChapter = {
				...chapter,
				questionnaireId: selectedQuestionnaire,
			};
			updateChapter(index, updatedChapter);
			showAlert("success", "Questionnaire assigned successfully");
		} catch (error) {
			console.error("Error assigning questionnaire:", error);
			showAlert("error", "Failed to assign questionnaire");
		}
	};

	const handleRemoveQuestionnaire = async () => {
		try {
			const response = await fetch("/api/questionnaire/remove", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					courseId: courseId,
					chapterId: chapterId,
				}),
			});
	
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to remove questionnaire");
			}
	
			const updatedChapter = {
				...chapter,
				questionnaireId: null,
			};
			updateChapter(index, updatedChapter);
			setSelectedQuestionnaire(""); // Reset selection
			showAlert("success", "Questionnaire removed successfully");
		} catch (error) {
			console.error("Error removing questionnaire:", error);
			showAlert("error", error.message || "Failed to remove questionnaire");
		}
	};

	const handleSaveChapterDetails = (details: {
		title: string;
		description: string;
		order: string;
		duration: string;
	}) => {
		const updatedChapter = {
			...chapter,
			...details,
			order: details.order || (index + 1).toString(), // Ensure order is set correctly
		};
		updateChapter(index, updatedChapter);
		setIsSaved(true);
	};

	const handleChapterSaved = (response: any) => {
		if (response && response.chapter && response.chapter.length > 0) {
			setChapterId(response.chapter[0].id);
		} else {
			console.error("Chapter ID not found in response:", response);
			showAlert("error", "Chapter ID not found in response.");
		}
		setIsSaved(true);
	};

	const handleSaveLecture = async (newLecture: Lecture) => {
		try {
			const response = await fetch(
				`/api/courses/chapters/lectures?chapterId=${chapterId}`
			);
			if (!response.ok) {
				const errorData = await response.json();
				console.error(
					"Error fetching updated lectures:",
					errorData.message
				);
				showAlert("error", "Failed to fetch updated lectures.");
				return;
			}

			const updatedLectures = await response.json();
			setLectures(updatedLectures.data);
			setCurrentLecture(null);

			const totalDurationInMinutes = updatedLectures.data.reduce(
				(total, lecture) => total + parseInt(lecture.duration),
				0
			);

			const updatedChapter = {
				...chapter,
				lectures: updatedLectures.data,
				duration: `${totalDurationInMinutes} minutes`,
			};

			updateChapter(index, updatedChapter);
			setIsAddingLecture(false);
		} catch (error) {
			console.error("An error occurred while saving the lecture:", error);
			showAlert("error", "Failed to save the lecture.");
		}
	};

	const removeLecture = async (lectureIndex: number) => {
		const lectureToRemove = lectures[lectureIndex];
		setIsLoading(true);

		try {
			const response = await fetch(
				`/api/courses/chapters/lectures/${lectureToRemove.id}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.ok) {
				const updatedLectures = lectures.filter(
					(_, idx) => idx !== lectureIndex
				);
				const result = await response.json();
				setLectures(updatedLectures);
				setIsLoading(false);
				showAlert("success", result.message);

				const updatedChapter = {
					...chapter,
					lectures: updatedLectures,
					duration: `${updatedLectures.reduce(
						(total, lecture) => total + parseInt(lecture.duration),
						0
					)} minutes`,
				};

				updateChapter(index, updatedChapter);
			} else {
				const errorData = await response.json();
				setIsLoading(false);
				console.error(`Failed to remove lecture: ${errorData.message}`);
				showAlert(
					"error",
					`Failed to remove lecture: ${errorData.message}`
				);
			}
		} catch (error) {
			setIsLoading(false);
			console.error(
				"An error occurred while removing the lecture:",
				error
			);
			showAlert("error", "An error occurred while removing the lecture.");
		}
	};

	const handleEditLecture = async (
		lecture: Lecture,
		lectureIndex: number
	) => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`/api/courses/chapters/lectures?id=${lecture.id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(lecture),
				}
			);

			if (response.ok) {
				const result = await response.json();
				const updatedLectures = lectures.map((lec, idx) =>
					idx === lectureIndex ? result.lecture[0] : lec
				);
				setLectures(updatedLectures);

				const updatedChapter = {
					...chapter,
					lectures: updatedLectures,
					duration: `${updatedLectures.reduce(
						(total, lecture) => total + parseInt(lecture.duration),
						0
					)} minutes`,
				};

				updateChapter(index, updatedChapter);
			} else {
				console.error("Failed to update lecture");
			}
		} catch (error) {
			console.error(
				"An error occurred while updating the lecture:",
				error
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancelLecture = () => {
		setIsAddingLecture(false);
		setCurrentLecture(null);
	};

	const onEditLecture = (lecture: Lecture, lectureIndex: number) => {
		setCurrentLecture(lecture);
		setIsAddingLecture(true);
	};

	const toggleAccordion = () => {
		setIsAccordionOpen(!isAccordionOpen);
	};

	const toggleAddLectureForm = () => {
		setCurrentLecture(null);
		setIsAddingLecture((prev) => !prev);
	};

	const removeChapterHandler = async () => {
		if (!chapterId) return;

		setIsLoading(true);

		try {
			const response = await fetch(
				`/api/courses/chapters?id=${chapterId}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (response.ok) {
				removeChapter(index);
				setIsLoading(false);
			} else {
				const errorData = await response.json();
				setIsLoading(false);
				console.error(`Failed to remove chapter: ${errorData.message}`);
			}
		} catch (error) {
			setIsLoading(false);
			console.error(
				"An error occurred while removing the chapter:",
				error
			);
		}
	};

	return (
		<li className="mb-5 relative">
			<div className="bg-white dark:bg-gray-800 shadow-accordion dark:shadow-accordion-dark rounded-md p-4">
				<ChapterAdd
					title={chapter.title || ""}
					description={chapter.description || ""}
					initialOrder={
						chapter.order ? parseInt(chapter.order, 10) : index + 1 // Use index + 1 as the default order
					}
					initialDuration={chapter.duration || "0 minutes"}
					onSave={handleSaveChapterDetails}
					courseId={courseId || ""}
					setChapterId={handleChapterSaved}
				/>
				{isSaved && (
					<div className="absolute top-8 right-6 pr-4 flex items-center">
						<Tooltip
							content="Click to expand Lessens"
							position="left"
						>
							<button
								type="button"
								onClick={toggleAccordion}
								className="text-gray-500 flex items-center justify-center ml-2 transform transition-transform"
								style={{
									transform: isAccordionOpen
										? "rotate(90deg)"
										: "rotate(0)",
								}}
								title="Toggle Details"
							>
								<svg
									width="20"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 16 16"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
									></path>
								</svg>
							</button>
						</Tooltip>
						<button
							type="button"
							onClick={toggleAddLectureForm}
							className="text-green-500 ml-2"
							title="Add Lecture"
						>
							<Tooltip
								content="Click to add lesson"
								position="top"
							>
								+
							</Tooltip>
						</button>
						<button
							type="button"
							onClick={removeChapterHandler}
							className="text-red-500 ml-2"
							title="Remove Chapter"
						>
							<Tooltip
								content="Click to del chapter"
								position="right"
							>
								{isLoading ? <DotLoader /> : "X"}
							</Tooltip>
						</button>
					</div>
				)}
			</div>

			{isAccordionOpen && (
				<div className="mt-4">
					<CurriculumContent
						chapters={[
							{
								id: parseInt(
									chapterId || chapter.id.toString(),
									10
								),
								title: chapter.title,
								duration: `${lectures
									.filter((lecture) => lecture !== undefined)
									.reduce(
										(total, lecture) =>
											total +
											(Number(lecture?.duration) || 0),
										0
									)} minutes`,
								lectures,
							},
						]}
						onEditLecture={onEditLecture}
						removeLecture={removeLecture}
						loading={isLoading}
					/>
				</div>
			)}

			{isAddingLecture && (
				<div className="mt-4">
					<CreateLecture
						chapterId={chapterId || ""}
						courseId={courseId || ""}
						onSave={handleSaveLecture}
						onCancel={handleCancelLecture}
						initialData={
							currentLecture ? currentLecture : undefined
						}
					/>
				</div> 
			)}

			<div className="mt-4 border-t pt-4">
				<h4 className="text-lg font-medium mb-2">Chapter Quiz</h4>
				<div className="flex gap-4">
					<select
						value={selectedQuestionnaire}
						onChange={(e) =>
							setSelectedQuestionnaire(e.target.value)
						}
						className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primaryColor"
						disabled={!!chapter.questionnaireId}
					>
						<option value="">Select a Quiz</option>
						{availableQuestionnaires.map((q) => (
							<option key={q.id} value={q.id}>
								{q.title} ({q.questionsCount} questions)
							</option>
						))}
					</select>
					{!chapter.questionnaireId ? (
						<button
							onClick={handleAssignQuestionnaire}
							className="px-4 py-2 bg-primaryColor text-white rounded hover:bg-opacity-90"
						>
							Assign Quiz
						</button>
					) : (
						<button
							onClick={handleRemoveQuestionnaire}
							className="px-4 py-2 bg-red-500 text-white rounded hover:bg-opacity-90"
						>
							Remove Quiz
						</button>
					)}
				</div>

				{chapter.questionnaireId && (
					<div className="mt-2 p-2 bg-gray-50 rounded flex justify-between items-center">
						<p className="text-sm">
							Assigned Quiz:{" "}
							{availableQuestionnaires.find(
								(q) => q.id === chapter.questionnaireId
							)?.title || "Loading..."}
						</p>
						<Tooltip content="Remove assigned quiz" position="left">
							<button
								onClick={handleRemoveQuestionnaire}
								className="text-red-500 hover:text-red-700"
							>
								<svg 
									xmlns="http://www.w3.org/2000/svg" 
									width="16" 
									height="16" 
									fill="currentColor" 
									viewBox="0 0 16 16"
								>
									<path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
								</svg>
							</button>
						</Tooltip>
					</div>
				)}
			</div>
		</li>
	);
};

export default ChapterItem;
