import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { chapters } from "@/db/schemas/courseChapters";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { chapters: chapterUpdates } = body;

    if (!chapterUpdates || !Array.isArray(chapterUpdates)) {
      return NextResponse.json(
        { error: "Invalid chapters data" },
        { status: 400 }
      );
    }

    for (const chapterUpdate of chapterUpdates) {
      await db
        .update(chapters)
        .set({ order: chapterUpdate.order })
        .where(eq(chapters.id, chapterUpdate.id));
    }

    return NextResponse.json(
      { message: "Chapter order updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating chapter order:", error);
    return NextResponse.json(
      { error: "Failed to update chapter order" },
      { status: 500 }
    );
  }
}