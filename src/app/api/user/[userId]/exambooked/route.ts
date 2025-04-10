import { db } from "@/db";
import { user } from "@/db/schemas/user";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    req: Request, 
    { params }: { params: { userId: string } }
  ) {
    const { userId } = params;
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
  
    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "User ID and Course ID are required" }, 
        { status: 400 }
      );
    }
  
    try {
      const [existingUser] = await db
        .select({ enrolledCourses: user.enrolledCourses })
        .from(user)
        .where(eq(user.id, userId));
  
      if (!existingUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      const enrolledCourses = existingUser.enrolledCourses || [];
      const course = enrolledCourses.find((c: any) => c.courseId === courseId);
  
      if (course?.examBookingDateTime) {
        return NextResponse.json({
          booked: true,
          examBookingDateTime: course.examBookingDateTime,
          message: `You booked the exam on ${new Date(course.examBookingDateTime).toLocaleString()}`
        });
      }
  
      return NextResponse.json({ booked: false });
    } catch (err) {
      console.error("Error fetching exam booking status", err);
      return NextResponse.json(
        { error: "Something went wrong" }, 
        { status: 500 }
      );
    }
  }
  
  export async function POST(
    req: Request, 
    { params }: { params: { userId: string } }
  ) {
    const { userId } = params;
  
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." }, 
        { status: 400 }
      );
    }
  
    try {
      const body = await req.json();
      const { courseId } = body;
  
      if (!courseId) {
        return NextResponse.json(
          { error: "Course ID is required." }, 
          { status: 400 }
        );
      }
  
      const currentDateTime = new Date().toISOString();
      const [existingUser] = await db
        .select({ enrolledCourses: user.enrolledCourses })
        .from(user)
        .where(eq(user.id, userId));
  
      if (!existingUser) {
        return NextResponse.json(
          { message: "User not found." }, 
          { status: 404 }
        );
      }
  
      const enrolledCourses = existingUser.enrolledCourses || [];
      let courseExists = false;
  
      const updatedCourses = enrolledCourses.map((course: any) => {
        if (course.courseId === courseId) {
          courseExists = true;
          return { 
            ...course, 
            examBookingDateTime: currentDateTime,
            examBookingMessage: `You booked the exam on ${new Date(currentDateTime).toLocaleString()}`
          };
        }
        return course;
      });
  
      if (!courseExists) {
        updatedCourses.push({
          courseId,
          examBookingDateTime: currentDateTime,
          examBookingMessage: `You booked the exam on ${new Date(currentDateTime).toLocaleString()}`,
          progress: 0,
          completedLectures: []
        });
      }
  
      await db
        .update(user)
        .set({ enrolledCourses: updatedCourses })
        .where(eq(user.id, userId));
  
      return NextResponse.json({
        success: true,
        examBookingDateTime: currentDateTime,
        message: `You booked the exam on ${new Date(currentDateTime).toLocaleString()}`
      });
    } catch (error) {
      console.error("Error updating examBookingDateTime:", error);
      return NextResponse.json(
        { error: "Internal server error" }, 
        { status: 500 }
      );
    }
  }
export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required." }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required." }, { status: 400 });
    }

    const currentDateTime = new Date().toISOString(); // System long date format

    const [existingUser] = await db
      .select({ enrolledCourses: user.enrolledCourses })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const enrolledCourses = existingUser.enrolledCourses || [];

    const updatedCourses = enrolledCourses.map((course: any) => {
      if (course.courseId === courseId) {
        return { ...course, examBookingDateTime: currentDateTime };
      }
      return course;
    });

    await db
      .update(user)
      .set({ enrolledCourses: updatedCourses })
      .where(eq(user.id, userId));

    return NextResponse.json({
      message: "Exam booking time saved successfully.",
      examBookingDateTime: currentDateTime,
    });
  } catch (error) {
    console.error("Error updating examBookingDateTime:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
