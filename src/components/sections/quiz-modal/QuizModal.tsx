"use client";

import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

interface Question {
	id: number;
	question: string;
	correct_answer: string;
	options: string[] | string;
}

interface QuizData {
	questionnaireId: number | string;
	title: string;
	questions: Question[];
}

interface QuizModalProps {
	quizData: QuizData | null;
	onClose: () => void;
	quizScores: any;
	setQuizScores: any;
	quizAttempts: any;
	setQuizAttempts: any;
	setProgressRefresh: any;
	BASE_URL: string;
	isFinalExam?: boolean; // New prop to differentiate between quiz and exam
}

/** Format seconds into MM:SS */
function formatTime(seconds: number) {
	const mm = Math.floor(seconds / 60);
	const ss = seconds % 60;
	return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

const QuizModal: React.FC<QuizModalProps> = ({
	quizData,
	onClose,
	quizScores,
	setQuizScores,
	quizAttempts,
	setQuizAttempts,
	setProgressRefresh,
	BASE_URL,
	isFinalExam = false, // Default to false for quizzes
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

	// Timer logic
	const [timeLeft, setTimeLeft] = useState(isFinalExam ? 3600 : 60); // 60 minutes for exam, 60 seconds per question for quiz

	if (!quizData) return null;

	const totalQuestions = quizData.questions.length;

	/**
	 * Reset timer each time we move to a new question (for quizzes).
	 * For exams, the timer counts down from 60 minutes.
	 */
	useEffect(() => {
		if (!isFinalExam) {
			setTimeLeft(60); // Reset timer for each question in quizzes
		}

		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					if (isFinalExam) {
						// Handle exam time-out
						Swal.fire({
							icon: "warning",
							title: "Time's up!",
							text: "Your final exam time has ended. Submitting your answers...",
							timer: 1500,
							showConfirmButton: false,
						});
						handleSubmitQuiz();
						return 0;
					} else {
						// Handle quiz time-out for individual questions
						if (!selectedAnswersRef.current[currentIndex]) {
							Swal.fire({
								icon: "warning",
								title: "Time's up!",
								text: `You missed Question #${
									currentIndex + 1
								}. Moving on...`,
								timer: 1500,
								showConfirmButton: false,
							});
						}
						if (currentIndex < totalQuestions - 1) {
							setCurrentIndex((prevIndex) => prevIndex + 1);
						} else {
							handleSubmitQuiz();
						}
						return 60; // Reset timer for next question in quizzes
					}
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [currentIndex, quizData, isFinalExam]); // No dependency on selectedAnswers

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
			handleSubmitQuiz();
		}
	};

	/** Final submission logic */
	const handleSubmitQuiz = async () => {
		console.log("Submitting quiz with data:", quizData);

		try {
			let correctAnswers = 0;
			const userAnswers: Record<number, string | null> = {};

			quizData.questions.forEach((q, i) => {
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
			const questionnaireId = quizData.questionnaireId;

			if (!questionnaireId) {
				console.error("Error: Missing questionnaire_id", quizData);
				Swal.fire({
					icon: "error",
					title: "Submission Error",
					text: "Quiz data is missing questionnaire ID.",
				});
				return;
			}

			// Prepare request payload
			const quizAttemptData = {
				questionnaire_id: questionnaireId, // ✅ Now this will always be set
				answers: userAnswers,
			};

			// Submit to API
			const response = await fetch(
				`${BASE_URL}/api/questionnaire/submit`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(quizAttemptData),
				}
			);

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || "Failed to submit quiz");
			}

			console.log("Quiz submitted successfully!", data);

			// Update local states with the latest attempt's score.
			setQuizScores((prev: any) => ({
				...prev,
				[questionnaireId]: scorePercentage,
			}));

			setProgressRefresh((prev: number) => prev + 1);

			Swal.fire({
				icon: "success",
				title: isFinalExam ? "Exam Submitted" : "Quiz Attempted",
				text: isFinalExam
					? "Your final exam has been submitted successfully!"
					: "Your quiz has been submitted successfully!",
				timer: 3000,
				showConfirmButton: false,
			});

			onClose();
		} catch (error: any) {
			console.error("Error submitting quiz:", error);
			Swal.fire({
				icon: "error",
				title: "Submission Error",
				text:
					error.message || "Something went wrong. Please try again.",
			});
		}
	};

	// Current question object
	const currentQuestion = quizData.questions[currentIndex];

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
						{quizData.questions.map((_, idx) => (
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
						{isFinalExam
							? `Total Time Remaining: ${formatTime(timeLeft)}`
							: `Time Per Question: ${formatTime(timeLeft)}`}
					</div>
				</div>

				{/* Question Title & Directions */}
				<h3 className="text-lg font-bold mb-2">
					{isFinalExam
						? `Final Exam - Question ${currentIndex + 1} of ${totalQuestions}`
						: `Question No ${currentIndex + 1}`}
				</h3>
				<p className="text-sm text-gray-600 mb-3">
					{isFinalExam
						? "Final Exam: Answer all questions within the allotted time."
						: `Directions [Set of ${totalQuestions} Questions]: Read the following passage and answer the questions that follow.`}
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
							onClick={handleSubmitQuiz}
							className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
						>
							{isFinalExam ? "Submit Exam" : "Submit Quiz"}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default QuizModal;