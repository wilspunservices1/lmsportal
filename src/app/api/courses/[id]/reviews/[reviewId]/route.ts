import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/libs/auth";
import { db } from "@/db";
import { instructorReviews } from "@/db/schemas/instructorReviews";
import { eq } from "drizzle-orm";

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string; reviewId: string } }
) {
	try {
		const session = await getSession();
		if (!session?.user) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		const reviewId = params.reviewId;

		await db.delete(instructorReviews).where(eq(instructorReviews.id, reviewId));

		return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error deleting review:", error);
		return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
	}
}
