import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schemas/reviews";
import { instructorReviews } from "@/db/schemas/instructorReviews";
import { courses } from "@/db/schemas/courses";
import { user } from "@/db/schemas/user";
import { eq, inArray } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
	try {
		const userId = params.userId;
		console.log("Fetching reviews for userId:", userId);

		const userCourses = await db
			.select({ id: courses.id, title: courses.title })
			.from(courses)
			.where(eq(courses.userId, userId));

		console.log("User courses:", userCourses);

		if (userCourses.length === 0) {
			console.log("No courses found for user");
			return NextResponse.json([]);
		}

		const courseIds = userCourses.map(c => c.id);
		console.log("Course IDs:", courseIds);

		// Fetch student reviews
		const studentReviews = await db
			.select({
				id: reviews.id,
				rating: reviews.rating,
				comment: reviews.comment,
				created_at: reviews.created_at,
				name: user.name,
				username: user.username,
				courseId: reviews.course_id,
			})
			.from(reviews)
			.leftJoin(user, eq(reviews.user_id, user.id))
			.where(inArray(reviews.course_id, courseIds));

		console.log("Student reviews:", studentReviews);

		// Fetch instructor reviews
		const instructorReviewsList = await db
			.select()
			.from(instructorReviews)
			.where(inArray(instructorReviews.courseId, courseIds));

		console.log("Instructor reviews:", instructorReviewsList);

		if (studentReviews.length === 0 && instructorReviewsList.length === 0) {
			console.log("No reviews found");
			return NextResponse.json([]);
		}

		// Combine and format all reviews
		const allReviews = [
			...studentReviews.map(review => {
				const course = userCourses.find(c => c.id === review.courseId);
				return {
					id: review.id,
					rating: review.rating,
					comment: review.comment,
					created_at: review.created_at,
					name: review.name || review.username || 'Anonymous',
					courseTitle: course?.title || 'Unknown Course'
				};
			}),
			...instructorReviewsList.map(review => {
				const course = userCourses.find(c => c.id === review.courseId);
				return {
					id: review.id,
					rating: review.rating,
					comment: review.comment,
					created_at: review.reviewDate,
					name: review.reviewerName,
					courseTitle: course?.title || 'Unknown Course'
				};
			})
		];

		console.log("All reviews:", allReviews);
		return NextResponse.json(allReviews);
	} catch (error) {
		console.error("Error fetching received reviews:", error);
		return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
	}
}
