import { NextResponse } from "next/server";
import { db } from "@/db";
import { getServerSession } from "next-auth/next";
import { quizAttempts } from "@/db/schemas/quizAttempts";
import { and, eq, desc } from "drizzle-orm";
import { options as authOptions } from "@/libs/auth";

export const dynamic = "force-dynamic"; // ✅ Forces dynamic rendering

export async function GET(req: Request) {
	try {
		// Get user session
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const user_id = session.user.id;

		// Fetch all quiz attempts for the user
		const allAttempts = await db
			.select({
				questionnaire_id: quizAttempts.questionnaire_id,
				score: quizAttempts.score,
			})
			.from(quizAttempts)
			.where(eq(quizAttempts.user_id, user_id));

		// If no attempts found, return empty progress
		if (!allAttempts.length) {
			return NextResponse.json({ scores: {} });
		}

		// Get the BEST score for each questionnaire
		const scores = allAttempts.reduce((acc, attempt) => {
			const currentBest = acc[attempt.questionnaire_id] || 0;
			acc[attempt.questionnaire_id] = Math.max(currentBest, attempt.score);
			return acc;
		}, {} as Record<string, number>);

		return NextResponse.json({ scores });
	} catch (error) {
		console.error("Error fetching progress:", error);
		return NextResponse.json(
			{ error: "Failed to fetch progress" },
			{ status: 500 }
		);
	}
}
