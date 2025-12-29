import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/libs/auth";
import { db } from "@/db";
import { reviews } from "@/db/schemas/reviews";
import { instructorReviews } from "@/db/schemas/instructorReviews";
import { courses } from "@/db/schemas/courses";
import { user } from "@/db/schemas/user";
import { orders } from "@/db/schemas/orders";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const courseId = params.id;
		const body = await req.json();
		const { rating, comment, avatar_url, is_visible, reviewerName, type, reviewDate } = body;

		// Handle instructor review (no auth required)
		if (type === "instructor") {
			if (!reviewerName || rating === undefined || !comment) {
				return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
			}

			const parsedRating = parseInt(rating);
			if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
				return NextResponse.json({ message: "Rating must be between 1 and 5" }, { status: 400 });
			}

			try {
				const newReview = await db
					.insert(instructorReviews)
					.values({
						courseId,
						reviewerName: reviewerName.trim(),
						rating: parsedRating,
						comment: comment.trim(),
						reviewDate: reviewDate || null,
					})
					.returning();

				return NextResponse.json(newReview[0], { status: 201 });
			} catch (dbError) {
				console.error("Database error inserting review:", dbError);
				return NextResponse.json({ message: "Failed to save review to database", error: dbError.message }, { status: 500 });
			}
		}

		// For student reviews, require authentication
		const session = await getSession();
		if (!session?.user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Handle student review (existing logic)
		if (!rating || !comment || !courseId) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}

		const [courseExists] = await db.select().from(courses).where(eq(courses.id, courseId));

		if (!courseExists) {
			return NextResponse.json({ message: "Course not found" }, { status: 404 });
		}

		const [purchase] = await db
			.select()
			.from(orders)
			.where(and(eq(orders.userId, session.user.id), eq(orders.status, 'completed')));

		if (!purchase) {
			return NextResponse.json({ message: "You must purchase this course to leave a review" }, { status: 403 });
		}

		const [existingReview] = await db
			.select()
			.from(reviews)
			.where(and(eq(reviews.course_id, courseId), eq(reviews.user_id, session.user.id)));

		if (existingReview) {
			return NextResponse.json({ message: "You have already reviewed this course" }, { status: 409 });
		}

		const newReview = await db
			.insert(reviews)
			.values({
				course_id: courseId,
				user_id: session.user.id,
				rating,
				comment,
				avatar_url,
				is_visible: is_visible ?? true,
			})
			.returning();

		return NextResponse.json(newReview, { status: 201 });
	} catch (error) {
		console.error("Error adding review:", error);
		return NextResponse.json({ error: "Failed to add review" }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		// Get session data
		const session = await getSession();
		if (!session?.user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Get course_id from params
		const courseId = params.id;

		// Check if the review exists for the course and user
		const reviewToDelete = await db
			.select()
			.from(reviews)
			.where(eq(reviews.course_id, courseId))
			.andWhere(eq(reviews.user_id, session.user.id))
			.first(); // Ensure it's the review for the logged-in user

		if (!reviewToDelete) {
			return NextResponse.json({ message: "Review not found" }, { status: 404 });
		}

		// Delete the review from the database
		await db.delete(reviews).where(eq(reviews.id, reviewToDelete.id));

		return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error deleting review:", error);
		return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
	}
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const url = new URL(req.url);
		const courseId = params.id;
		const userId = url.searchParams.get("userId");
		const checkEligibility = url.searchParams.get("checkEligibility");
		const type = url.searchParams.get("type"); // 'instructor' or 'student'

		// Handle instructor reviews
		if (type === "instructor") {
			const instructorReviewsList = await db
				.select()
				.from(instructorReviews)
				.where(eq(instructorReviews.courseId, courseId));

			return NextResponse.json({ reviews: instructorReviewsList }, { status: 200 });
		}

		// Handle review eligibility check
		if (checkEligibility === "true" && userId) {
			const [purchase] = await db
				.select()
				.from(orders)
				.where(and(eq(orders.userId, userId), eq(orders.status, 'completed')));

			const isPurchased = !!purchase;

			const [existingReview] = await db
				.select()
				.from(reviews)
				.where(and(eq(reviews.course_id, courseId), eq(reviews.user_id, userId)));

			const hasReviewed = !!existingReview;

			return NextResponse.json({
				isPurchased,
				hasReviewed,
				canReview: isPurchased && !hasReviewed
			});
		}

		const session = await getSession();
		if (!session?.user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		let query = db
			.select({
				...reviews,
				username: user.username,
			})
			.from(reviews)
			.leftJoin(user, eq(reviews.user_id, user.id));

		query = query.where(eq(reviews.course_id, courseId));

		if (userId) {
			query = query.where(and(eq(reviews.course_id, courseId), eq(reviews.user_id, userId)));
		}

		const reviewsList = await query;

		if (reviewsList.length === 0) {
			return NextResponse.json({ message: "No reviews found" }, { status: 404 });
		}

		return NextResponse.json(reviewsList, { status: 200 });
	} catch (error) {
		console.error("Error fetching reviews:", error);
		return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
	}
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		// Get session data to verify the user is logged in
		const session = await getSession();
		if (!session?.user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Get review_id (from the URL)
		const reviewId = params.id;

		// Parse the request body
		const { comment, rating, is_visible, avatar_url } = await req.json();

		// Initialize the update object
		const updateData: any = {};

		// Add the fields to the update object if they are provided in the payload
		if (comment !== undefined) {
			updateData.comment = comment; // Update comment if provided
		}
		if (rating !== undefined) {
			// Ensure that rating is between 1 and 5
			if (rating < 1 || rating > 5) {
				return NextResponse.json(
					{ message: "Rating must be between 1 and 5" },
					{ status: 400 }
				);
			}
			updateData.rating = rating; // Update rating if provided
		}
		if (is_visible !== undefined) {
			updateData.is_visible = is_visible; // Update is_visible if provided
		}
		if (avatar_url !== undefined) {
			updateData.avatar_url = avatar_url; // Update avatar_url if provided
		}

		// If no fields are provided in the payload, return a bad request
		if (Object.keys(updateData).length === 0) {
			return NextResponse.json({ message: "No fields to update" }, { status: 400 });
		}

		// Check if the review exists and belongs to the logged-in user
		const review = await db
			.select()
			.from(reviews)
			.where(eq(reviews.id, reviewId))
			.andWhere(eq(reviews.user_id, session.user.id)) // Ensure the review belongs to the logged-in user
			.first();

		if (!review) {
			return NextResponse.json(
				{ message: "Review not found or unauthorized" },
				{ status: 404 }
			);
		}

		// Update the review with the provided data
		await db
			.update(reviews)
			.set(updateData) // Update the fields based on the `updateData` object
			.where(eq(reviews.id, reviewId));

		// Return the updated review data
		return NextResponse.json({ message: "Review updated successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error updating review:", error);
		return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
	}
}