// src/app/api/placeholders/bulk-update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { placeholders as placeholdersTable } from "@/db/schemas/placeholders";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest) {
	try {
		const { placeholders } = await req.json();

		console.log("😂😂😂😂Received placeholders:", placeholders);

		// Validate input
		if (!Array.isArray(placeholders)) {
			return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
		}

		// Update all placeholders in the database
		for (const ph of placeholders) {
			await db
				.update(placeholdersTable)
				.set({
					x: ph.x,
					y: ph.y,
					value: ph.value,
					font_size: ph.font_size,
					color: ph.color,
					font_family: ph.font_family, // New field
					is_visible: ph.is_visible,
				})
				.where(eq(placeholdersTable.id, ph.id));
		}

		return NextResponse.json({
			message: "Placeholders updated successfully",
		});
	} catch (error) {
		console.error("Error updating placeholders:", error);
		return NextResponse.json(
			{
				error: "Failed to update placeholders",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
