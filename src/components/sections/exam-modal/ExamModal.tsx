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

	// Add new state to track answered questions
	const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

	if (!examData) return null;

	const totalQuestions = examData.questions.length;

	/**
	 * Timer logic for the exam.
	 * The timer counts down from 60 minutes (3600 seconds).
	 * When the timer runs out, the exam is automatically submitted.
	 */
	// eslint-disable-next-line react-hooks/rules-of-hooks
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
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [examData]);

	/** Handle user's option selection */
	const handleOptionChange = (questionIndex: number, option: string) => {
		setSelectedAnswers((prev) => ({
			...prev,
			[questionIndex]: option,
		}));
		setAnsweredQuestions((prev) => new Set(Array.from(prev).concat(questionIndex)));
	};

	/** Move to next question or submit if it's the last */
	const handleNextQuestion = () => {
		if (currentIndex < totalQuestions - 1) {
			setCurrentIndex(currentIndex + 1);
		} else {
			handleSubmitExam();
		}
	};

	/** Move to previous question */
	const handlePrevQuestion = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	};

	/** Select a specific question */
	const handleQuestionSelect = (index: number) => {
		setCurrentIndex(index);
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
				`${BASE_URL}/api/questionnaire/submitFinalExam`,
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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			{/* Increased container size and improved layout */}
			<div className="bg-white w-full max-w-7xl min-h-[90vh] rounded-lg shadow-2xl relative flex flex-col">
				{/* Header with Timer and Close Button */}
				<div className="bg-gray-50 p-4 rounded-t-lg border-b flex items-center justify-between">
					<h2 className="text-2xl font-bold text-gray-800">Final Examination</h2>
					<div className="flex items-center gap-4">
						<div className="bg-white px-4 py-2 rounded-md border">
							<span className="text-red-600 font-semibold">
								Time Remaining: {formatTime(timeLeft)}
							</span>
						</div>
						<button
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700"
							aria-label="Close"
						>
							<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>

				{/* Main Content Area */}
				<div className="flex flex-1 overflow-hidden">
					{/* Left Sidebar: Question Navigation */}
					<div className="w-64 bg-gray-50 p-4 border-r overflow-y-auto">
						<h3 className="text-sm font-semibold text-gray-600 mb-3">Question Navigation</h3>
						<div className="grid grid-cols-4 gap-2">
							{examData.questions.map((_, idx) => (
								<button
									key={idx}
									onClick={() => handleQuestionSelect(idx)}
									className={`
										p-2 rounded text-center text-sm font-medium
										${currentIndex === idx ? 'ring-2 ring-blue-500' : ''}
										${answeredQuestions.has(idx) 
											? 'bg-green-100 text-green-800 border-green-200' 
											: 'bg-gray-100 text-gray-600 border-gray-200'}
										hover:bg-gray-200 transition-colors
									`}
								>
									{idx + 1}
								</button>
							))}
						</div>
						
						<div className="mt-4 p-3 bg-blue-50 rounded-md">
							<h4 className="text-sm font-semibold text-blue-800 mb-2">Progress</h4>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Answered:</span>
									<span className="font-medium">{answeredQuestions.size}/{totalQuestions}</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div 
										className="bg-blue-600 h-2 rounded-full transition-all duration-300"
										style={{ width: `${(answeredQuestions.size/totalQuestions) * 100}%` }}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Main Question Area */}
					<div className="flex-1 p-6 overflow-y-auto">
						<div className="max-w-3xl mx-auto">
							{/* Question Header */}
							<div className="mb-6">
								<h3 className="text-xl font-bold text-gray-800 mb-2">
									Question {currentIndex + 1} of {totalQuestions}
								</h3>
								<p className="text-gray-600">
									Select the best answer for the question below
								</p>
							</div>

							{/* Question Content */}
							<div className="bg-white rounded-lg border p-6 mb-6">
								<p className="text-lg font-medium text-gray-800 mb-6">
									{currentQuestion.question}
								</p>

								{/* Options */}
								<div className="space-y-3">
									{options.map((option, idx) => (
										<label
											key={idx}
											className={`
												flex items-center p-4 rounded-lg border cursor-pointer
												${selectedAnswers[currentIndex] === option 
													? 'bg-blue-50 border-blue-200' 
													: 'hover:bg-gray-50'}
												transition-colors
											`}
										>
											<input
												type="radio"
												name={`question-${currentIndex}`}
												value={option}
												className="w-4 h-4 text-blue-600"
												onChange={() => handleOptionChange(currentIndex, option)}
												checked={selectedAnswers[currentIndex] === option}
											/>
											<span className="ml-3">{option}</span>
										</label>
									))}
								</div>
							</div>

							{/* Navigation Buttons */}
							<div className="flex justify-between items-center mt-6">
								<button
									onClick={handlePrevQuestion}
									disabled={currentIndex === 0}
									className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 
											 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
											 transition-colors flex items-center gap-2"
								>
									<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
									</svg>
									Previous
								</button>

								{currentIndex < totalQuestions - 1 ? (
									<button
										onClick={handleNextQuestion}
										className="px-6 py-2.5 bg-yellow text-white rounded-lg
											 hover:bg-blue-700 transition-colors flex items-center gap-2"
									>
										Next
										<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
										</svg>
									</button>
								) : (
									<button
										onClick={handleSubmitExam}
										className="px-6 py-2.5 bg-green-600 text-white rounded-lg
											 hover:bg-green-700 transition-colors flex items-center gap-2"
									>
										Submit Exam
										<svg className="w-5 h-5" fill="none" viewBox="0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ExamModal;