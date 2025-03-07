// src/app/api/user/email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schemas/user";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic"; // Forces runtime execution

export async function GET(req: NextRequest) {
	try {
		// Extract email from query parameters
		const { searchParams } = new URL(req.url);
		const email = searchParams.get("email");

		if (!email) {
			return NextResponse.json(
				{ error: "Email is required" },
				{ status: 400 }
			);
		}

		// Fetch user details using email
		const [userData] = await db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.email, email))
			.limit(1);

		if (!userData) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ userId: userData.id });
	} catch (error) {
		console.error("Error fetching user by email:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
