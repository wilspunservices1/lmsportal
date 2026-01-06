import { NextRequest, NextResponse } from "next/server";
import { db } from "src/db";
import { lectures } from "src/db/schemas/lectures";
import { questionnaires } from "src/db/schemas/questionnaire";
import { quizAttempts } from "src/db/schemas/quizAttempts";
import { user } from "src/db/schemas/user";
import { eq, and } from "drizzle-orm";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    console.log("Received request for lesson ID:", params.id);

    if (!params.id) {
        return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 });
    }

    try {
        const lessonId = params.id;

        // Get user session
        const token = await getToken({ req });
        if (!token || !token.sub) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = token.sub as string;

        // Fetch lesson details
        const lessonData = await db
            .select({
                id: lectures.id,
                title: lectures.title,
                videoUrl: lectures.videoUrl,
                isLocked: lectures.isLocked,
                chapterId: lectures.chapterId,
                duration: lectures.duration,
            })
            .from(lectures)
            .where(eq(lectures.id, lessonId))
            .limit(1);

        if (lessonData.length === 0) {
            return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
        }

        let lesson = lessonData[0];

        // Check if lesson is marked as completed in user.enrolledCourses.completedLectures
        const userData = await db
            .select({
                enrolledCourses: user.enrolledCourses,
            })
            .from(user)
            .where(eq(user.id, userId))
            .limit(1);

        let lessonCompleted = false;
        if (userData.length > 0 && userData[0].enrolledCourses) {
            const enrolledCourses = Array.isArray(userData[0].enrolledCourses) 
                ? userData[0].enrolledCourses 
                : [];

            lessonCompleted = enrolledCourses.some((course: any) => 
                course?.completedLectures?.includes(lessonId)
            );
        }

        // Fetch questionnaire related to the chapterId
        const questionnaireData = await db
            .select({
                id: questionnaires.id,
                title: questionnaires.title,
            })
            .from(questionnaires)
            .where(eq(questionnaires.chapterId, lesson.chapterId))
            .limit(1);

        let isChapterDone = false;

        if (questionnaireData.length === 0) {
            // Introductory chapter (no questionnaire)
            isChapterDone = lessonCompleted;
            lesson = { ...lesson, isLocked: false };
            return NextResponse.json({
                lesson,
                questionnaire: null,
                isChapterDone,
            });
        }

        const questionnaireId = questionnaireData[0].id;

        // Check if the user has attempted the quiz
        const quizAttempt = await db
            .select({ id: quizAttempts.id })
            .from(quizAttempts)
            .where(
                and(
                    eq(quizAttempts.questionnaire_id, questionnaireId),
                    eq(quizAttempts.user_id, userId)
                )
            )
            .limit(1);

        // Mark as done only if lesson is completed (duration elapsed)
        if (lessonCompleted) {
            isChapterDone = true;
            lesson = { ...lesson, isLocked: false };
        }

        return NextResponse.json({
            lesson,
            questionnaire: questionnaireData[0],
            isChapterDone,
        });
    } catch (error) {
        console.error("Error fetching lesson details:", error);
        return NextResponse.json(
            { error: "Failed to fetch lesson details", details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}