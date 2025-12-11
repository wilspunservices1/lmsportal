import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chapters } from '@/db/schemas/courseChapters';
import { lectures } from '@/db/schemas/lectures';
import { eq, inArray } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { userId, courseId } = await req.json();
    
    console.log('Manual unlock request:', { userId, courseId });

    const courseChapters = await db
      .select({ id: chapters.id })
      .from(chapters)
      .where(eq(chapters.courseId, courseId));

    if (courseChapters.length > 0) {
      const chapterIds = courseChapters.map(ch => ch.id);
      
      await db
        .update(lectures)
        .set({ isLocked: false })
        .where(inArray(lectures.chapterId, chapterIds));
      
      console.log(`Manually unlocked ${chapterIds.length} chapters for course ${courseId}`);
    }

    return NextResponse.json({ 
      status: 'success', 
      message: `Unlocked ${courseChapters.length} chapters for course ${courseId}` 
    });
  } catch (error) {
    console.error('Manual unlock error:', error);
    return NextResponse.json({ error: 'Failed to unlock course' }, { status: 500 });
  }
}