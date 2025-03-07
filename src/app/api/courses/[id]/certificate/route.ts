import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schemas/user";
import { courses } from "@/db/schemas/courses";
import { certification } from "@/db/schemas/certification";
import { placeholders } from "@/db/schemas/placeholders";
import { eq } from "drizzle-orm";

export async function GET(
	req: NextRequest,
	context: { params: { id: string } }
) {
	try {
		const params = await Promise.resolve(context.params); // Await params to ensure proper access
		const courseId = params.id; // Now safely access params.id

		console.log(`Fetching certificate for courseId: ${courseId}`);

		// 🔹 Extract userId from query parameters
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{ message: "User ID is required" },
				{ status: 400 }
			);
		}

		console.log(`Fetching data for userId: ${userId}`);

		// 🔹 Fetch user details and enrolled courses
		const [userData] = await db
			.select({
				id: user.id,
				name: user.name,
				email: user.email,
				enrolledCourses: user.enrolledCourses,
			})
			.from(user)
			.where(eq(user.id, userId))
			.limit(1);

		if (!userData) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		console.log("User Data:", userData);

		// 🔹 Check if the user is enrolled in the course
		const enrolledCourse = userData.enrolledCourses?.find(
			(c: any) => c.courseId === courseId
		);

		if (!enrolledCourse) {
			return NextResponse.json(
				{ message: "User is not enrolled in this course" },
				{ status: 403 }
			);
		}

		// 🔹 Fetch course details including certificate ID
		const [courseData] = await db
			.select({
				certificateId: courses.certificateId,
				title: courses.title,
			})
			.from(courses)
			.where(eq(courses.id, courseId))
			.limit(1);

		if (!courseData || !courseData.certificateId) {
			return NextResponse.json(
				{ message: "Certificate not found for this course" },
				{ status: 404 }
			);
		}

		console.log("Course Data:", courseData);

		// 🔹 Fetch certificate details (image URL, no "template")
		const [certificateData] = await db
			.select()
			.from(certification)
			.where(eq(certification.id, courseData.certificateId))
			.limit(1);

		if (!certificateData) {
			return NextResponse.json(
				{ message: "Certificate data not found" },
				{ status: 404 }
			);
		}

		console.log("Certificate Data:", certificateData);

		// 🔹 Fetch placeholders related to the certificate
		const placeholdersData = await db
			.select()
			.from(placeholders)
			.where(eq(placeholders.certificate_id, courseData.certificateId));

		console.log("Placeholders:", placeholdersData);

		// 🔹 Return structured JSON response
		return NextResponse.json({
			userId: userData.id,
			userData: userData,
			courseId,
			certificateData,
			placeholders: placeholdersData || [],
		});
	} catch (error) {
		console.error("Error fetching certificate data:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
