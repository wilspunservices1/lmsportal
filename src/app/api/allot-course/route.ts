import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { user } from "@/db/schemas/user";
import { ilike } from "drizzle-orm";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		console.log("Request body:", body);
		
		let { userEmail, courseId } = body;

		console.log("Raw userEmail:", userEmail, "Raw courseId:", courseId);

		userEmail = userEmail?.trim();
		courseId = courseId?.trim();

		console.log("Trimmed userEmail:", userEmail, "Trimmed courseId:", courseId);

		if (!userEmail || !courseId) {
			console.log("Missing fields - userEmail:", !!userEmail, "courseId:", !!courseId);
			return NextResponse.json(
				{ message: "Email and Course ID are required" },
				{ status: 400 }
			);
		}

		const userData = await db
			.select()
			.from(user)
			.where(ilike(user.email, userEmail));

		console.log("User found:", userData.length > 0);

		if (!userData.length) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		const userRecord = userData[0];
		const enrolledCourses = userRecord.enrolledCourses || [];

		console.log("Enrolled courses:", enrolledCourses.length);
		console.log("Checking if already enrolled for courseId:", courseId);

		const alreadyEnrolled = enrolledCourses.some(
			(ec: any) => String(ec.courseId).trim() === String(courseId).trim()
		);

		console.log("Already enrolled:", alreadyEnrolled);

		if (alreadyEnrolled) {
			return NextResponse.json(
				{ message: "User already enrolled in this course" },
				{ status: 400 }
			);
		}

		const updatedEnrolledCourses = [
			...enrolledCourses,
			{
				courseId: String(courseId),
				enrollmentDate: new Date().toISOString(),
				progress: 0,
				isFreeAllotment: true,
			},
		];

		await db
			.update(user)
			.set({ enrolledCourses: updatedEnrolledCourses })
			.where(ilike(user.email, userEmail));

		return NextResponse.json(
			{ message: "Course allotted successfully" },
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Error:", error);
		return NextResponse.json(
			{ message: "Error allotting course", error: error?.message },
			{ status: 500 }
		);
	}
}
