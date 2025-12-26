import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schemas/reviews";
import { courses } from "@/db/schemas/courses";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
	try {
		const userId = params.userId;

		const userReviews = await db
			.select({
				id: reviews.id,
				rating: reviews.rating,
				comment: reviews.comment,
				created_at: reviews.created_at,
				courseId: reviews.course_id,
			})
			.from(reviews)
			.where(eq(reviews.user_id, userId));

		const reviewsWithCourses = await Promise.all(
			userReviews.map(async (review) => {
				const [course] = await db
					.select({ title: courses.title })
					.from(courses)
					.where(eq(courses.id, review.courseId));
				
				return {
					...review,
					courseTitle: course?.title || 'Unknown Course'
				};
			})
		);

		return NextResponse.json(reviewsWithCourses);
	} catch (error) {
		console.error("Error fetching given reviews:", error);
		return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
	}
}
