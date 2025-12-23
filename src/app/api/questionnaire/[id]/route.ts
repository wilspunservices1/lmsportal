import { NextResponse } from 'next/server';
import { db } from '@/db';
import { questionnaires } from '@/db/schemas/questionnaire';
import { questions } from '@/db/schemas/questions';
import { courseQuestionnaires } from '@/db/schemas/coursequestionnaires';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching questionnaire for id:', params.id);

    if (!params.id) {
      return NextResponse.json(
        { error: 'Questionnaire ID is required' },
        { status: 400 }
      );
    }

    const questionnaire = await db
      .select()
      .from(questionnaires)
      .where(eq(questionnaires.id, params.id))
      .limit(1);

    if (!questionnaire || questionnaire.length === 0) {
      return NextResponse.json(
        { error: 'No questionnaire found with this ID' },
        { status: 404 }
      );
    }

    const questionsList = await db
      .select()
      .from(questions)
      .where(eq(questions.questionnaireId, questionnaire[0].id));

    const formattedQuestions = questionsList.map((q) => ({
      id: q.id,
      question: q.question,
      options:
        typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
      correctAnswer: q.correctAnswer,
    }));

    // Get all assigned courses
    const assignedCourses = await db
      .select({ courseId: courseQuestionnaires.courseId })
      .from(courseQuestionnaires)
      .where(eq(courseQuestionnaires.questionnaireId, questionnaire[0].id));

    const courseIds = assignedCourses.map(c => c.courseId);

    return NextResponse.json({
      id: questionnaire[0].id,
      title: questionnaire[0].title,
      courseId: questionnaire[0].courseId,
      courseIds: courseIds,
      questions: formattedQuestions,
      createdAt: questionnaire[0].createdAt,
    });
  } catch (error) {
    console.error('Error fetching questionnaire:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questionnaire' },
      { status: 500 }
    );
  }
}

// POST handler to create a new questionnaire
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, courseId, questions: questionData, isRequired, minPassScore } = body;

    if (!title || !courseId || !questionData || questionData.length === 0) {
      return NextResponse.json(
        { error: 'Title, courseId, and at least one question are required' },
        { status: 400 }
      );
    }

    // Start a transaction to ensure atomicity
    const result = await db.transaction(async (tx) => {
      // Insert the questionnaire
      const [newQuestionnaire] = await tx.insert(questionnaires).values({
        title,
        courseId,
        isRequired,
        minPassScore,
        status: 'draft', // Default status
        createdAt: new Date(),
      }).returning();

      // Insert the questions
      const newQuestions = await Promise.all(
        questionData.map((q: any) =>
          tx.insert(questions).values({
            questionnaireId: newQuestionnaire.id,
            question: q.question,
            options: JSON.stringify(q.options), // Ensure options are stored as JSON
            correctAnswer: q.correctAnswer,
          }).returning()
        )
      );

      return { questionnaire: newQuestionnaire, questions: newQuestions };
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error creating questionnaire:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to create questionnaire' },
      { status: 500 }
    );
  }
}

// PUT handler to update an existing questionnaire
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, courseIds, questions: questionData, isRequired, minPassScore } = body;

    console.log('PUT questionnaire - courseIds:', courseIds);

    if (!title || !courseIds || courseIds.length === 0 || !questionData || questionData.length === 0) {
      return NextResponse.json(
        { error: 'Title, courseIds, and at least one question are required' },
        { status: 400 }
      );
    }

    // Start a transaction to ensure atomicity
    const result = await db.transaction(async (tx) => {
      // Update the questionnaire
      const [updatedQuestionnaire] = await tx.update(questionnaires)
        .set({
          title,
          courseId: courseIds[0],
          isRequired,
          minPassScore,
        })
        .where(eq(questionnaires.id, params.id))
        .returning();

      if (!updatedQuestionnaire) {
        throw new Error('Questionnaire not found');
      }

      // Delete existing questions for this questionnaire
      await tx.delete(questions)
        .where(eq(questions.questionnaireId, params.id));

      // Insert the updated questions
      const updatedQuestions = await Promise.all(
        questionData.map((q: any) =>
          tx.insert(questions).values({
            questionnaireId: params.id,
            question: q.question,
            options: JSON.stringify(q.options),
            correctAnswer: q.correctAnswer,
          }).returning()
        )
      );

      // Update course_questionnaires: delete old entries first
      console.log('Deleting old course assignments for questionnaire:', params.id);
      await tx.delete(courseQuestionnaires)
        .where(eq(courseQuestionnaires.questionnaireId, params.id));

      // Insert new course assignments
      if (courseIds.length > 0) {
        console.log('Inserting new course assignments:', courseIds);
        for (const courseId of courseIds) {
          try {
            await tx.insert(courseQuestionnaires).values({
              courseId,
              questionnaireId: params.id,
              isActive: true,
            });
          } catch (insertError) {
            console.error('Error inserting course assignment:', insertError);
            // Continue with next course if one fails
          }
        }
      }

      return { questionnaire: updatedQuestionnaire, questions: updatedQuestions };
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error updating questionnaire:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to update questionnaire', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
