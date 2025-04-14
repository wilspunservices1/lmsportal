import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { questionnaires } from "@/db/schemas/questionnaire";
import { chapters } from "@/db/schemas/courseChapters";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Validation schema for unassigning questionnaire
const removeSchema = z.object({
    courseId: z.string().min(1, "Course ID is required"),
    chapterId: z.string().min(1, "Chapter ID is required"),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Remove questionnaire request body:", body);

        const { courseId, chapterId } = removeSchema.parse(body);

        // 1. Verify chapter exists and belongs to the course
        const [chapter] = await db
            .select()
            .from(chapters)
            .where(eq(chapters.id, chapterId))
            .limit(1);

        if (!chapter) {
            return NextResponse.json(
                { success: false, error: "Chapter not found" },
                { status: 404 }
            );
        }

        // 2. Update the chapter to remove questionnaire reference
        const [updatedChapter] = await db
            .update(chapters)
            .set({
                questionnaireId: null,
            })
            .where(eq(chapters.id, chapterId))
            .returning({
                id: chapters.id,
                questionnaireId: chapters.questionnaireId,
            });

        if (!updatedChapter) {
            return NextResponse.json(
                { success: false, error: "Failed to update chapter" },
                { status: 500 }
            );
        }

        // 3. Update questionnaires that were linked to this chapter
        await db
            .update(questionnaires)
            .set({
                chapterId: null,
                updatedAt: new Date(),
            })
            .where(eq(questionnaires.chapterId, chapterId));

        return NextResponse.json({
            success: true,
            message: "Questionnaire unassigned successfully",
            data: updatedChapter,
        });
    } catch (error) {
        console.error("Error removing questionnaire assignment:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Validation error",
                    details: error.errors,
                },
                { status: 400 }
            );
        }
        return NextResponse.json(
            {
                success: false,
                error: "Failed to remove questionnaire",
            },
            { status: 500 }
        );
    }
}