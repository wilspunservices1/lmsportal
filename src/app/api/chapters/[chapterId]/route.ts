import { db } from '@/db'; // Import your Drizzle ORM DB instance
import { chapters } from '@/db/schemas/courseChapters'; // Import the chapters schema
import { lectures } from '@/db/schemas/lectures'; // Import the lectures schema
import { eq, asc, inArray } from 'drizzle-orm'; // Import required operators
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { courseId } = req.query; // Get course ID from query params

    if (!courseId) {
        return res.status(400).json({ message: 'Course ID is required' });
    }

    try {
        // Fetch all chapters in the course, sorted by `order`
        const courseChapters = await db
            .select()
            .from(chapters)
            .where(eq(chapters.courseId, courseId as string))
            .orderBy(asc(chapters.order)); // Ensure chapters are ordered correctly

        if (!courseChapters.length) {
            return res.status(404).json({ message: 'No chapters found for this course' });
        }

        // Fetch lectures for all chapters in the course, sorted by `order`
        const chapterIds = courseChapters.map(chapter => chapter.id);
        const lecturesData = await db
            .select()
            .from(lectures)
            .where(inArray(lectures.chapterId, chapterIds)) // ✅ Corrected inArray usage
            .orderBy(asc(lectures.order)); // Ensure lectures are ordered correctly

        // Map lectures to their respective chapters
        const chapterMap = new Map();
        courseChapters.forEach(chapter => {
            chapterMap.set(chapter.id, { ...chapter, lectures: [] });
        });

        lecturesData.forEach(lecture => {
            const chapter = chapterMap.get(lecture.chapterId);
            if (chapter) {
                chapter.lectures.push(lecture);
            }
        });

        // Convert map back to an ordered array
        const orderedChaptersWithLectures = Array.from(chapterMap.values());

        return res.status(200).json(orderedChaptersWithLectures);
    } catch (error) {
        console.error('Error fetching course chapters and lectures:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}