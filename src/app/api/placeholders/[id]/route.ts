//src\app\api\placeholders\[id]\route.ts
// @ts-nocheck
// @ts-expect-error - Override Next.js route type mismatch
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { placeholders as placeholdersTable } from "@/db/schemas/placeholders";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const { id } = params; // Placeholder ID
		const { x, y, value, font_size, color, font_family, is_visible } = await req.json();

		// Validate input (optional, but recommended)
		if (
			typeof x !== "number" ||
			typeof y !== "number" ||
			typeof value !== "string" ||
			typeof font_size !== "number" ||
			typeof color !== "string" ||
			typeof font_family !== "string" ||
			typeof is_visible !== "boolean"
		) {
			return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
		}

		// Update the placeholder in the database
		await db
			.update(placeholdersTable)
			.set({ x, y, value, font_size, color, font_family, is_visible })
			.where(eq(placeholdersTable.id, id));

		return NextResponse.json({
			message: "Placeholder updated successfully",
		});
	} catch (error) {
		console.error("Error updating placeholder:", error);
		return NextResponse.json(
			{
				error: "Failed to update placeholder",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
