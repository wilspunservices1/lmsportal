export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { user } from "@/db/schemas/user";
import { courses } from "@/db/schemas/courses";
import { eq, inArray } from "drizzle-orm";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");

		if (!userId) {
			return NextResponse.json(
				{ message: "User ID is required" },
				{ status: 400 }
			);
		}

		const userData = await db
			.select()
			.from(user)
			.where(eq(user.id, userId))
			.limit(1);

		if (!userData.length) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		const enrolledCourses = userData[0].enrolledCourses || [];
		
		if (enrolledCourses.length === 0) {
			return NextResponse.json({ highlights: [] });
		}

		const courseIds = enrolledCourses.map((ec) => ec.courseId);
		
		const coursesData = await db
			.select()
			.from(courses)
			.where(inArray(courses.id, courseIds));

		const highlights = enrolledCourses
			.map(ec => {
				const course = coursesData.find(c => c.id === ec.courseId);
				if (!course) return null;

				// Calculate expiry if not set but course has accessDurationMonths
				let expiryDate = ec.expiryDate;
				let enrollmentDate = ec.enrollmentDate || new Date().toISOString();

				if (!expiryDate && course.accessDurationMonths) {
					const startDate = new Date(enrollmentDate);
					const expiry = new Date(startDate);
					expiry.setMonth(expiry.getMonth() + parseInt(course.accessDurationMonths.toString()));
					expiryDate = expiry.toISOString();
				}

				// Only show courses with expiry dates
				if (!expiryDate) return null;

				// Calculate renewal price (25% of original price)
				const renewalPrice = course.price ? (parseFloat(course.price.toString()) * 0.25).toFixed(2) : null;

				return {
					courseId: ec.courseId,
					title: course.title,
					enrollmentDate,
					expiryDate,
					progress: ec.progress || 0,
					renewPrice: renewalPrice,
				};
			})
			.filter(h => h !== null);

		return NextResponse.json({ highlights });
	} catch (error) {
		console.error("Error fetching highlights:", error);
		return NextResponse.json(
			{ message: "Error fetching highlights", error: error.message },
			{ status: 500 }
		);
	}
}
