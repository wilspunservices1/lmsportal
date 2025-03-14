// src/app/api/courses/final-exam/[courseId]/route.ts

import { NextResponse } from "next/server";
import { db } from "@/db"; // Adjust the import based on your db setup
import { courses } from "@/db/schemas/courses"; // Adjust the import based on your schema
import { eq } from "drizzle-orm";

// ✅ PATCH: Update Final Exam ID for a course
export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { courseId } = params; // Extract courseId from dynamic route params
		const { finalExamId } = await req.json(); // Extract finalExamId from request body

		// Validate input
		if (!courseId || !finalExamId) {
			return NextResponse.json(
				{ error: "Missing courseId or finalExamId" },
				{ status: 400 }
			);
		}

		// Update the course with the new finalExamId
		await db
			.update(courses)
			.set({ finalExamId })
			.where(eq(courses.id, courseId));

		return NextResponse.json({
			message: "Final Exam assigned successfully!",
		});
	} catch (error) {
		console.error("Error updating Final Exam:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// ✅ GET: Fetch Final Exam ID for a course
export async function GET(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { courseId } = params; // Extract courseId from dynamic route params

		// Validate input
		if (!courseId) {
			return NextResponse.json(
				{ error: "Missing courseId" },
				{ status: 400 }
			);
		}

		// Fetch the course from the database
		const course = await db
			.select()
			.from(courses)
			.where(eq(courses.id, courseId))
			.limit(1);

		// Check if the course exists
		if (!course.length) {
			return NextResponse.json(
				{ error: "Course not found" },
				{ status: 404 }
			);
		}

		// Return the finalExamId
		return NextResponse.json({ finalExamId: course[0].finalExamId });
	} catch (error) {
		console.error("Error fetching Final Exam:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
