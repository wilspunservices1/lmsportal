//src\app\api\courses\chapters\lectures\questionnaires\[id]\route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { questionnaires } from "@/db/schemas/questionnaire";
import { questions } from "@/db/schemas/questions";
import { eq } from "drizzle-orm";

//course_questionnaires_questionnaire_id_questionnaires_id_fk

export async function DELETE(request: Request, { params }: { params?: { id?: string } }) {
	try {
		if (!params?.id) {
			return NextResponse.json({ error: "Missing questionnaire ID" }, { status: 400 });
		}

		// Delete all related questions first
		await db.delete(questions).where(eq(questions.questionnaireId, params.id));

		// Then delete the questionnaire
		await db.delete(questionnaires).where(eq(questionnaires.id, params.id));

		// ✅ Return JSON with success
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Error deleting questionnaire:", error);
		return NextResponse.json({ error: "Failed to delete questionnaire" }, { status: 500 });
	}
}

export async function GET(request: Request, { params }: { params?: { id?: string } }) {
	try {
		if (!params || !params.id) {
			return NextResponse.json({ error: "Missing questionnaire ID" }, { status: 400 });
		}

		console.log("Fetching questionnaire for id:", params.id);

		// Get the questionnaire by its ID
		const questionnaire = await db
			.select()
			.from(questionnaires)
			.where(eq(questionnaires.id, params.id))
			.limit(1);

		if (!questionnaire || questionnaire.length === 0) {
			return NextResponse.json(
				{ error: "No questionnaire found with this ID" },
				{ status: 404 }
			);
		}

		// Get all questions for this questionnaire
		const questionsList = await db
			.select()
			.from(questions)
			.where(eq(questions.questionnaireId, questionnaire[0].id));

		// Format the questions to match the expected interface
		const formattedQuestions = questionsList.map((q) => ({
			id: q.id,
			question: q.question,
			options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
			correctAnswer: q.correctAnswer,
		}));

		return NextResponse.json({
			id: questionnaire[0].id,
			title: questionnaire[0].title,
			courseId: questionnaire[0].courseId,
			questions: formattedQuestions,
			createdAt: questionnaire[0].createdAt,
			status: questionnaire[0].status,
		});
	} catch (error) {
		console.error("Error fetching questionnaire:", error);
		return NextResponse.json({ error: "Failed to fetch questionnaire" }, { status: 500 });
	}
}
