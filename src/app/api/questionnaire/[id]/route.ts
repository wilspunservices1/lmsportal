import { NextResponse } from 'next/server';
import { db } from '@/db';
import { questionnaires } from '@/db/schemas/questionnaire';
import { questions } from '@/db/schemas/questions';
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

    return NextResponse.json({
      id: questionnaire[0].id,
      title: questionnaire[0].title,
      courseId: questionnaire[0].courseId,
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
    const { title, courseId, questions: questionData, isRequired, minPassScore } = body;

    if (!title || !courseId || !questionData || questionData.length === 0) {
      return NextResponse.json(
        { error: 'Title, courseId, and at least one question are required' },
        { status: 400 }
      );
    }

    // Start a transaction to ensure atomicity
    const result = await db.transaction(async (tx) => {
      // Update the questionnaire
      const [updatedQuestionnaire] = await tx.update(questionnaires)
        .set({
          title,
          courseId,
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
            options: JSON.stringify(q.options), // Ensure options are stored as JSON
            correctAnswer: q.correctAnswer,
          }).returning()
        )
      );

      return { questionnaire: updatedQuestionnaire, questions: updatedQuestions };
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error updating questionnaire:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Failed to update questionnaire' },
      { status: 500 }
    );
  }
}