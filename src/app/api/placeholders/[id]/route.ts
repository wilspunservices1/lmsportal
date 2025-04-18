import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { placeholders as placeholdersTable } from "@/db/schemas/placeholders";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const updates = await req.json();

        // Validate that we received at least one valid field to update
        const validFields = ['x', 'y', 'value', 'font_size', 'color', 'font_family', 'is_visible'];
        const hasValidField = Object.keys(updates).some(key => validFields.includes(key));

        if (!hasValidField) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }

        // Validate types for provided fields only
        for (const [key, value] of Object.entries(updates)) {
            if (key === 'x' || key === 'y' || key === 'font_size') {
                if (typeof value !== 'number') {
                    return NextResponse.json({ 
                        error: `Invalid type for ${key}. Expected number` 
                    }, { status: 400 });
                }
            }
            if (key === 'value' || key === 'color' || key === 'font_family') {
                if (typeof value !== 'string') {
                    return NextResponse.json({ 
                        error: `Invalid type for ${key}. Expected string` 
                    }, { status: 400 });
                }
            }
            if (key === 'is_visible' && typeof value !== 'boolean') {
                return NextResponse.json({ 
                    error: "Invalid type for is_visible. Expected boolean" 
                }, { status: 400 });
            }
        }

        // Update only the provided fields
        await db
            .update(placeholdersTable)
            .set(updates)
            .where(eq(placeholdersTable.id, id));

        return NextResponse.json({
            message: "Placeholder updated successfully",
            updates
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