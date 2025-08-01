import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses } from "@/db/schemas/courses";
import { getSession } from "@/libs/auth";
import { eq } from "drizzle-orm";

export async function PUT(req: Request, { params }: { params: { id: string; faqId: string } }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: courseId, faqId } = params;
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
    const faqIndex = currentFaqs.findIndex((faq: any) => faq.id === faqId);

    if (faqIndex === -1) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    // Update the FAQ
    const updatedFaqs = [...currentFaqs];
    updatedFaqs[faqIndex] = {
      ...updatedFaqs[faqIndex],
      question: question.trim(),
      answer: answer.trim(),
      updatedAt: new Date().toISOString()
    };

    await db
      .update(courses)
      .set({ faqs: updatedFaqs })
      .where(eq(courses.id, courseId));

    return NextResponse.json({
      success: true,
      message: "FAQ updated successfully"
    });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string; faqId: string } }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: courseId, faqId } = params;

    // Get current FAQs
    const [course] = await db
      .select({ faqs: courses.faqs })
      .from(courses)
      .where(eq(courses.id, courseId));

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const currentFaqs = course.faqs || [];
    const updatedFaqs = currentFaqs.filter((faq: any) => faq.id !== faqId);

    await db
      .update(courses)
      .set({ faqs: updatedFaqs })
      .where(eq(courses.id, courseId));

    return NextResponse.json({
      success: true,
      message: "FAQ deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}