import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses } from "@/db/schemas/courses";
import { getSession } from "@/libs/auth";
import { eq } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const courseId = params.id;
    
    const [course] = await db
      .select({ faqs: courses.faqs })
      .from(courses)
      .where(eq(courses.id, courseId));

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      faqs: course.faqs || []
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courseId = params.id;
    const { question, answer } = await req.json();

    if (!question?.trim() || !answer?.trim()) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
    }

    // Get current FAQs
    const [course] = await db
      .select({ faqs: courses.faqs })
      .from(courses)
      .where(eq(courses.id, courseId));

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const currentFaqs = course.faqs || [];
    const newFaq = {
      id: Date.now().toString(),
      question: question.trim(),
      answer: answer.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedFaqs = [...currentFaqs, newFaq];

    await db
      .update(courses)
      .set({ faqs: updatedFaqs })
      .where(eq(courses.id, courseId));

    return NextResponse.json({
      success: true,
      message: "FAQ added successfully",
      faq: newFaq
    });
  } catch (error) {
    console.error("Error adding FAQ:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}