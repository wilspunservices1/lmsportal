import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { user } from "@/db/schemas/user";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
	try {
		const { userEmail, courseId } = await req.json();

		if (!userEmail || !courseId) {
			return NextResponse.json(
				{ message: "Email and Course ID are required" },
				{ status: 400 }
			);
		}

		const userData = await db
			.select()
			.from(user)
			.where(eq(user.email, userEmail));

		if (!userData.length) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		const userRecord = userData[0];
		const enrolledCourses = userRecord.enrolledCourses || [];

		const alreadyEnrolled = enrolledCourses.some(
			(ec: any) => ec.courseId === courseId
		);

		if (alreadyEnrolled) {
			return NextResponse.json(
				{ message: "Already enrolled" },
				{ status: 400 }
			);
		}

		const updatedEnrolledCourses = [
			...enrolledCourses,
			{
				courseId,
				enrollmentDate: new Date().toISOString(),
				progress: 0,
			},
		];

		await db
			.update(user)
			.set({ enrolledCourses: updatedEnrolledCourses })
			.where(eq(user.email, userEmail));

		return NextResponse.json(
			{ message: "Course allotted successfully" },
			{ status: 200 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ message: "Error", error: error?.message },
			{ status: 500 }
		);
	}
}
