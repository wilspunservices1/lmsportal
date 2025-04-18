import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { questionnaires } from "@/db/schemas/questionnaire";
import { questions } from "@/db/schemas/questions";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
	try {
		console.log("Attempting to fetch questionnaires");

		const { searchParams } = new URL(req.url);
		const courseId = searchParams.get("courseId");

		// Build base query
		let query = db
			.select({
				id: questionnaires.id,
				title: questionnaires.title,
				courseId: questionnaires.courseId,
				createdAt: questionnaires.createdAt,
			})
			.from(questionnaires);

		// Apply filter if courseId is provided
		if (courseId) {
			query = query.where(eq(questionnaires.courseId, courseId));
		}

		const allQuestionnaires = await query;

		if (!allQuestionnaires) {
			return NextResponse.json({
				success: true,
				questionnaires: [],
			});
		}

		console.log("Fetched questionnaires:", allQuestionnaires);

		const formattedQuestionnaires = await Promise.all(
			allQuestionnaires.map(async (questionnaire) => {
				const questionsList = await db
					.select({
						id: questions.id,
						question: questions.question,
						options: questions.options,
						correctAnswer: questions.correctAnswer,
					})
					.from(questions)
					.where(eq(questions.questionnaireId, questionnaire.id));

				console.log(`Questions for questionnaire ${questionnaire.id}:`, questionsList);

				return {
					id: questionnaire.id,
					title: questionnaire.title,
					courseId: questionnaire.courseId,
					createdAt: questionnaire.createdAt?.toISOString() || new Date().toISOString(),
					status: questionnaire.status || "active",
					questions: questionsList.map(
						(q: { id: any; question: any; options: string; correctAnswer: any }) => ({
							id: q.id,
							question: q.question,
							options: q.options
								? typeof q.options === "string"
									? JSON.parse(q.options)
									: Array.isArray(q.options)
									? q.options
									: []
								: [],
							correctAnswer: q.correctAnswer || "",
						})
					),
				};
			})
		);

		return NextResponse.json({
			success: true,
			questionnaires: formattedQuestionnaires,
		});
	} catch (error) {
		console.error("Error fetching questionnaires:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to fetch questionnaires",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
