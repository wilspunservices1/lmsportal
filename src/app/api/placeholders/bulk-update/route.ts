import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { placeholders as placeholdersTable } from "@/db/schemas/placeholders";
import { eq } from "drizzle-orm";

interface PlaceholderUpdate {
  id: string;
  x: number;
  y: number;
  value?: string;
  font_size?: number;
  color?: string;
  font_family?: string;
  is_visible?: boolean;
}

export async function PUT(req: NextRequest) {
  try {
    const { placeholders } = await req.json();

    // Validate input
    if (!Array.isArray(placeholders)) {
      return NextResponse.json(
        { error: "Invalid input: placeholders must be an array" },
        { status: 400 }
      );
    }

    // Validate each placeholder
    for (const ph of placeholders) {
      if (!ph.id || typeof ph.x !== 'number' || typeof ph.y !== 'number') {
        return NextResponse.json(
          { 
            error: "Invalid placeholder data", 
            details: "Each placeholder must have an id and valid x,y coordinates"
          },
          { status: 400 }
        );
      }
    }

    // Update all placeholders in the database
    const updates = await Promise.all(placeholders.map(async (ph: PlaceholderUpdate) => {
      try {
        // Convert coordinates to numbers and ensure they're valid
        const x = Math.round(parseFloat(ph.x as any) || 0);
        const y = Math.round(parseFloat(ph.y as any) || 0);
        const fontSize = ph.font_size ? Math.round(parseFloat(ph.font_size as any)) : undefined;

        if (isNaN(x) || isNaN(y)) {
          throw new Error(`Invalid coordinates for placeholder ${ph.id}`);
        }

        const result = await db
          .update(placeholdersTable)
          .set({
            x,
            y,
            value: ph.value,
            font_size: fontSize,
            color: ph.color,
            font_family: ph.font_family,
            is_visible: ph.is_visible,
          })
          .where(eq(placeholdersTable.id, ph.id))
          .returning({ 
            id: placeholdersTable.id,
            x: placeholdersTable.x,
            y: placeholdersTable.y,
            value: placeholdersTable.value,
            font_size: placeholdersTable.font_size,
            color: placeholdersTable.color,
            font_family: placeholdersTable.font_family,
            is_visible: placeholdersTable.is_visible,
          });

        return result[0];
      } catch (err) {
        console.error(`Failed to update placeholder ${ph.id}:`, err);
        throw err;
      }
    }));

    return NextResponse.json({
      message: "Placeholders updated successfully",
      updated: updates
    });
  } catch (error) {
    console.error("Bulk update error:", error);
    return NextResponse.json(
      {
        error: "Failed to update placeholders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}