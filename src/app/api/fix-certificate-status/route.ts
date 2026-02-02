import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schemas/user";
import { eq } from "drizzle-orm";
import { getSession } from "@/libs/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();
    
    if (!courseId) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 });
    }

    // Get user's enrolled courses
    const userData = await db
      .select({ enrolledCourses: user.enrolledCourses })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    const enrolled = userData?.[0]?.enrolledCourses || [];
    
    // Update finalExamStatus to true for the specific course
    const updatedEnrolled = enrolled.map((course: any) => {
      if (course.courseId === courseId) {
        return {
          ...course,
          finalExamStatus: true,
        };
      }
      return course;
    });

    await db
      .update(user)
      .set({ enrolledCourses: updatedEnrolled })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ 
      success: true, 
      message: "Certificate status updated" 
    });
  } catch (error) {
    console.error("Error fixing certificate status:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}