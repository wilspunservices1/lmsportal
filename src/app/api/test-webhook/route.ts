import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schemas/user';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { userEmail, courseIds } = await req.json();
    
    console.log('Testing manual enrollment for:', userEmail, courseIds);
    
    // Get user by email
    const userData = await db
      .select({ 
        id: user.id, 
        enrolledCourses: user.enrolledCourses 
      })
      .from(user)
      .where(eq(user.email, userEmail))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    const userId = userData[0].id;
    const currentEnrolledCourses = userData[0].enrolledCourses as string[] || [];
    
    // Update user's enrolled courses
    const newEnrolledCourses = Array.from(new Set([...currentEnrolledCourses, ...courseIds]));
    
    await db
      .update(user)
      .set({ 
        enrolledCourses: newEnrolledCourses,
        updatedAt: new Date()
      })
      .where(eq(user.id, userId));

    console.log('Manual enrollment successful:', newEnrolledCourses);
    
    return NextResponse.json({ 
      success: true, 
      userId,
      enrolledCourses: newEnrolledCourses 
    });
    
  } catch (error) {
    console.error('Manual enrollment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}