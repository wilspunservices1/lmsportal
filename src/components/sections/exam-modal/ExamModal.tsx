"use client";

import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

interface Question {
	id: number;
	question: string;
	correct_answer: string;
	options: string[] | string;
}

interface ExamData {
	questionnaireId: number | string;
	title: string;
	questions: Question[];
}

interface ExamModalProps {
	examData: ExamData | null;
	onClose: () => void;
	quizScores: any;
	setQuizScores: any;
	quizAttempts: any;
	setQuizAttempts: any;
	setProgressRefresh: any;
	BASE_URL: string;
}

/** Format seconds into MM:SS */
function formatTime(seconds: number) {
	const mm = Math.floor(seconds / 60);
	const ss = seconds % 60;
	return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

const ExamModal: React.FC<ExamModalProps> = ({
	examData,
	onClose,
	quizScores,
	setQuizScores,
	quizAttempts,
	setQuizAttempts,
	setProgressRefresh,
	BASE_URL,
}) => {
	// Current question index
	const [currentIndex, setCurrentIndex] = useState(0);
	// Track user's selected answers
	const [selectedAnswers, setSelectedAnswers] = useState<{
		[index: number]: string;
	}>({});
	// Ref to hold latest selectedAnswers (to avoid resetting timer on every selection)
	const selectedAnswersRef = useRef(selectedAnswers);
	useEffect(() => {
		selectedAnswersRef.current = selectedAnswers;
	}, [selectedAnswers]);

	// Timer logic: 60 minutes (3600 seconds) for the entire exam
	const [timeLeft, setTimeLeft] = useState(3600);

	if (!examData) return null;

	const totalQuestions = examData.questions.length;

	/**
	 * Timer logic for the exam.
	 * The timer counts down from 60 minutes (3600 seconds).
	 * When the timer runs out, the exam is automatically submitted.
	 */
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					// Handle exam time-out
					Swal.fire({
						icon: "warning",
						title: "Time's up!",
						text: "Your final exam time has ended. Submitting your answers...",
						timer: 1500,
						showConfirmButton: false,
					});
					handleSubmitExam();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [examData]);

	/** Handle user's option selection */
	const handleOptionChange = (questionIndex: number, option: string) => {
		setSelectedAnswers((prev) => ({
			...prev,
			[questionIndex]: option,
		}));
	};

	/** Move to next question or submit if it's the last */
	const handleNextQuestion = () => {
		if (currentIndex < totalQuestions - 1) {
			setCurrentIndex(currentIndex + 1);
		} else {
			handleSubmitExam();
		}
	};

	/** Final submission logic */
	const handleSubmitExam = async () => {
		console.log("Submitting exam with data:", examData);

		try {
			let correctAnswers = 0;
			const userAnswers: Record<number, string | null> = {};

			examData.questions.forEach((q, i) => {
				const userAnswer =
					selectedAnswers[i]?.toLowerCase().trim() || null;
				const correct = (
					q.correct_answer ||
					(q as any).correctAnswer ||
					""
				)
					.toLowerCase()
					.trim();

				if (userAnswer === correct) correctAnswers++;
				userAnswers[q.id] = userAnswer;
			});

			const scorePercentage =
				totalQuestions > 0
					? Math.round((correctAnswers / totalQuestions) * 100)
					: 0;

			// ✅ Ensure questionnaire_id is assigned correctly
			const questionnaireId = examData.questionnaireId;

			if (!questionnaireId) {
				console.error("Error: Missing questionnaire_id", examData);
				Swal.fire({
					icon: "error",
					title: "Submission Error",
					text: "Exam data is missing questionnaire ID.",
				});
				return;
			}

			// Prepare request payload
			const examAttemptData = {
				questionnaire_id: questionnaireId, // ✅ Now this will always be set
				answers: userAnswers,
			};

			// Submit to API
			const response = await fetch(
				`${BASE_URL}/api/questionnaire/submit`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(examAttemptData),
				}
			);

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || "Failed to submit exam");
			}

			console.log("Exam submitted successfully!", data);

			// Update local states with the latest attempt's score.
			setQuizScores((prev: any) => ({
				...prev,
				[questionnaireId]: scorePercentage,
			}));

			setProgressRefresh((prev: number) => prev + 1);

			// Display result and eligibility for certificate
			if (scorePercentage >= 70) {
				Swal.fire({
					icon: "success",
					title: "Congratulations!",
					text: `You scored ${scorePercentage}%. You have passed the exam and are eligible for a certificate.`,
					showConfirmButton: true,
				});
			} else {
				Swal.fire({
					icon: "error",
					title: "Exam Result",
					text: `You scored ${scorePercentage}%. Unfortunately, you did not pass. Please contact your instructor for further guidance.`,
					showConfirmButton: true,
				});
			}

			onClose();
		} catch (error: any) {
			console.error("Error submitting exam:", error);
			Swal.fire({
				icon: "error",
				title: "Submission Error",
				text:
					error.message || "Something went wrong. Please try again.",
			});
		}
	};

	// Current question object
	const currentQuestion = examData.questions[currentIndex];

	// Parse options (if stored as a JSON string)
	let options: string[] = [];
	if (typeof currentQuestion.options === "string") {
		try {
			options = JSON.parse(currentQuestion.options);
		} catch {
			options = [];
		}
	} else {
		options = currentQuestion.options as string[];
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			{/* Increased container size */}
			<div className="bg-white w-full max-w-5xl min-h-[80vh] mx-4 rounded shadow-lg relative p-8">
				{/* Top Bar: Question Navigation (disabled) + Timer */}
				<div className="flex items-center justify-between border-b pb-2 mb-4">
					<div className="space-x-2">
						{examData.questions.map((_, idx) => (
							<button
								key={idx}
								disabled
								className={`px-2 py-1 border rounded cursor-not-allowed ${
									currentIndex === idx
										? "bg-green-600 text-white border-green-600"
										: "bg-gray-100 text-gray-600"
								}`}
							>
								{idx + 1}
							</button>
						))}
					</div>
					<div className="text-red-600 font-semibold">
						Total Time Remaining: {formatTime(timeLeft)}
					</div>
				</div>

				{/* Question Title & Directions */}
				<h3 className="text-lg font-bold mb-2">
					Final Exam - Question {currentIndex + 1} of {totalQuestions}
				</h3>
				<p className="text-sm text-gray-600 mb-3">
					Final Exam: Answer all questions within the allotted time.
				</p>

				{/* Question & Options Layout */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Left: Question Text */}
					<div className="border p-4 rounded">
						<p className="font-medium mb-2">
							{currentQuestion.question}
						</p>
					</div>

					{/* Right: Options */}
					<div className="border p-4 rounded">
						<p className="font-semibold mb-2">
							Choose the correct option:
						</p>
						{options.map((option, idx) => (
							<label
								key={idx}
								className="flex items-center mb-2 cursor-pointer"
							>
								<input
									type="radio"
									name={`question-${currentIndex}`}
									value={option}
									className="mr-2"
									onChange={() =>
										handleOptionChange(currentIndex, option)
									}
									checked={
										selectedAnswers[currentIndex] === option
									}
								/>
								<span>{option}</span>
							</label>
						))}
					</div>
				</div>

				{/* Bottom Navigation */}
				<div className="flex justify-end space-x-2 mt-6">
					{currentIndex < totalQuestions - 1 ? (
						<button
							onClick={handleNextQuestion}
							className="px-6 py-3 bg-blue text-white rounded hover:bg-blue-700 transition-colors"
						>
							Save & Next
						</button>
					) : (
						<button
							onClick={handleSubmitExam}
							className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
						>
							Submit Exam
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default ExamModal;