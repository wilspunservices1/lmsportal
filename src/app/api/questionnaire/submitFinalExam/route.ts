import { NextResponse } from "next/server";
import { db } from "@/db";
import { getServerSession } from "next-auth/next";
import { questionnaires } from "@/db/schemas/questionnaire";
import { questions } from "@/db/schemas/questions";
import { quizAttempts } from "@/db/schemas/quizAttempts";
import { and, eq } from "drizzle-orm";
import { user } from "@/db/schemas/user";
import { options as authOptions } from "@/libs/auth";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		console.log("Session Data:", session);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const user_id = session.user.id;

		// Parse request body
		const { questionnaire_id, answers } = await req.json();
		console.log("Questionnaire ID:", questionnaire_id);
		console.log("Answers:", answers);

		// Validate questionnaire_id
		if (!questionnaire_id) {
			return NextResponse.json({ error: "Missing questionnaire_id" }, { status: 400 });
		}

		// Check if the questionnaire exists
		const questionnaire = await db
			.select()
			.from(questionnaires)
			.where(eq(questionnaires.id, questionnaire_id))
			.limit(1);

		if (!questionnaire || questionnaire.length === 0) {
			console.error("Questionnaire not found:", questionnaire_id);
			return NextResponse.json({ error: "Questionnaire not found" }, { status: 404 });
		}

		// Fetch questions for the questionnaire
		const questionsList = await db
			.select({
				id: questions.id,
				question: questions.question,
				correct_answer: questions.correctAnswer,
				options: questions.options,
			})
			.from(questions)
			.where(eq(questions.questionnaireId, questionnaire_id));

		console.log("Fetched Questions from DB:", questionsList);

		if (!questionsList || questionsList.length === 0) {
			return NextResponse.json(
				{ error: "No questions found for this quiz" },
				{ status: 400 }
			);
		}

		// Calculate score
		let correctAnswers = 0;
		const totalQuestions = questionsList.length;

		questionsList.forEach((question) => {
			const userAnswer = answers[question.id]
				? answers[question.id].trim().toLowerCase()
				: null;
			const correct_answer = question.correct_answer
				? question.correct_answer.trim().toLowerCase()
				: null;

			if (userAnswer === correct_answer) {
				correctAnswers++;
			}
		});

		// Store user answer data
		const answerDetails = questionsList.map((question) => {
			const userAnswer = answers[question.id]
				? answers[question.id].trim().toLowerCase()
				: null;
			const correct_answer = question.correct_answer
				? question.correct_answer.trim().toLowerCase()
				: null;
			const isCorrect = userAnswer === correct_answer;

			return {
				questionId: question.id,
				userAnswer,
				correct_answer,
				isCorrect,
			};
		});

		const score = Math.round((correctAnswers / totalQuestions) * 100);

		// Check existing attempts
		const existingAttempts = await db
			.select({ id: quizAttempts.id })
			.from(quizAttempts)
			.where(
				and(
					eq(quizAttempts.user_id, user_id),
					eq(quizAttempts.questionnaire_id, questionnaire_id)
				)
			);

		const totalAttempts = existingAttempts.length;

		// Enforce attempt limit
		if (totalAttempts >= 100) {
			return NextResponse.json(
				{
					error: "Maximum quiz attempts reached",
					attemptCount: totalAttempts,
				},
				{ status: 400 }
			);
		}

		// Insert new attempt
		const attempt = await db
			.insert(quizAttempts)
			.values({
				user_id,
				questionnaire_id,
				score,
				answers: JSON.stringify(answerDetails),
				created_at: new Date(),
				updated_at: new Date(),
			})
			.returning({ id: quizAttempts.id });

		console.log("Insert Result:", attempt);

		if (!attempt || attempt.length === 0) {
			return NextResponse.json({ error: "Quiz submission failed" }, { status: 500 });
		}

		if (!questionnaire?.[0]?.courseId) {
			return NextResponse.json({ error: "Course ID not found for questionnaire" }, { status: 400 });
		  }
		  const courseId = questionnaire[0].courseId;
		  

			if (courseId) {
			const userData = await db
				.select({ enrolledCourses: user.enrolledCourses })
				.from(user)
				.where(eq(user.id, user_id))
				.limit(1);

			const enrolled = userData?.[0]?.enrolledCourses || [];
			console.log('📚 Before update - enrolled courses:', enrolled);

			const updatedEnrolled = enrolled.map((course: any) => {
				if (course.courseId === courseId) {
					console.log(`✅ Setting finalExamStatus=true for course ${courseId}, score: ${score}`);
					return {
						...course,
						finalExamStatus: score >= 70,
					};
				}
				return course;
			});
			console.log('📚 After update - enrolled courses:', updatedEnrolled);

			await db
				.update(user)
				.set({ enrolledCourses: updatedEnrolled })
				.where(eq(user.id, user_id));
				
			console.log('💾 Database updated successfully');
		}

		

		// Return success response
		const updatedAttemptCount = totalAttempts + 1;
		return NextResponse.json({
			success: true,
			score,
			attemptCount: updatedAttemptCount,
			correctAnswers,
			totalQuestions,
			feedback: {
				questions: answerDetails,
			},
		});
	} catch (error) {
		console.error("Error submitting quiz:", error);
		return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
	}
}
