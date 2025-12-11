import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schemas/user';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const userData = await db
      .select({ 
        id: user.id, 
        enrolledCourses: user.enrolledCourses 
      })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      userId: userData[0].id,
      enrolledCourses: userData[0].enrolledCourses
    });
  } catch (error) {
    console.error('Error fetching user enrollment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}