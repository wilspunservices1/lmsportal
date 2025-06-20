import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/libs/auth";
import { db } from "@/db";
import { reviews } from "@/db/schemas/reviews"; // Import your reviews schema
import { courses } from "@/db/schemas/courses"; // Import courses schema
import { user } from "@/db/schemas/user"; // Import user schema
import { orders } from "@/db/schemas/orders"; // Import orders schema
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		// Get session data
		const session = await getSession();
		if (!session?.user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Get the course_id from the params and review data from the body
		const courseId = params.id;
		const { rating, comment, avatar_url, is_visible } = await req.json();

		// Ensure all required fields are present
		if (!rating || !comment || !courseId) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}

		// Check if the course exists
		const [courseExists] = await db.select().from(courses).where(eq(courses.id, courseId));

		if (!courseExists) {
			return NextResponse.json({ message: "Course not found" }, { status: 404 });
		}

		// Check if user has purchased the course
		const [purchase] = await db
			.select()
			.from(orders)
			.where(and(eq(orders.userId, session.user.id), eq(orders.status, 'completed')));

		if (!purchase) {
			return NextResponse.json({ message: "You must purchase this course to leave a review" }, { status: 403 });
		}

		// Check if user has already reviewed this course
		const [existingReview] = await db
			.select()
			.from(reviews)
			.where(and(eq(reviews.course_id, courseId), eq(reviews.user_id, session.user.id)));

		if (existingReview) {
			return NextResponse.json({ message: "You have already reviewed this course" }, { status: 409 });
		}

		// Insert the new review into the database
		const newReview = await db
			.insert(reviews)
			.values({
				course_id: courseId,
				user_id: session.user.id,
				rating,
				comment,
				avatar_url,
				is_visible: is_visible ?? true, // Default to true if not provided
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
		// Get query parameters
		const url = new URL(req.url);
		const courseId = params.id;
		const userId = url.searchParams.get("userId");
		const checkEligibility = url.searchParams.get("checkEligibility");

		// Handle review eligibility check
		if (checkEligibility === "true" && userId) {
			// Check if user has purchased the course
			const [purchase] = await db
				.select()
				.from(orders)
				.where(and(eq(orders.userId, userId), eq(orders.status, 'completed')));

			const isPurchased = !!purchase;

			// Check if user has already reviewed the course
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

		// Get session data (authentication) for regular review fetching
		const session = await getSession();
		if (!session?.user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Initialize the query
		let query = db
			.select({
				...reviews,
				username: user.username,
			})
			.from(reviews)
			.leftJoin(user, eq(reviews.user_id, user.id));

		// Filter by course_id (use params.id)
		query = query.where(eq(reviews.course_id, courseId));

		// Filter by user_id if provided
		if (userId) {
			query = query.where(and(eq(reviews.course_id, courseId), eq(reviews.user_id, userId)));
		}

		// Execute the query and fetch reviews
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