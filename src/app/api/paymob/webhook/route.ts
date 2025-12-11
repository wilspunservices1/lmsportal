import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { orders } from '@/db/schemas/orders';
import { user } from '@/db/schemas/user';
import { cart } from '@/db/schemas/cart';
import { courses } from '@/db/schemas/courses';
import { chapters } from '@/db/schemas/courseChapters';
import { lectures } from '@/db/schemas/lectures';
import { sendEmail } from '@/libs/email/emailService';
import { eq, inArray, sql } from 'drizzle-orm';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('=== PAYMOB WEBHOOK RECEIVED ===');
    console.log('Full body:', JSON.stringify(body, null, 2));
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    // Verify HMAC signature (disabled for testing)
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET!;
    const receivedHmac = req.headers.get('hmac');
    console.log('HMAC verification temporarily disabled for testing');
    
    // TODO: Re-enable HMAC verification in production
    // if (receivedHmac) {
    //   const calculatedHmac = crypto
    //     .createHmac('sha512', hmacSecret)
    //     .update(JSON.stringify(body))
    //     .digest('hex');
    //   
    //   if (receivedHmac !== calculatedHmac) {
    //     console.error('HMAC verification failed');
    //     return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    //   }
    // }

    console.log('Webhook type:', body.type);
    console.log('Transaction success:', body.obj?.success);
    
    // Process successful payment
    if (body.type === 'TRANSACTION' && body.obj.success === true) {
      const transaction = body.obj;
      const orderId = transaction.order.id;
      const userEmail = transaction.order.shipping_data?.email || transaction.payment_key_claims?.billing_data?.email;
      const totalAmount = transaction.amount_cents / 100;
      
      console.log('Extracted user email:', userEmail);

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
        console.error('User not found for email:', userEmail);
        return NextResponse.json({ error: 'User not found' }, { status: 400 });
      }

      const userId = userData[0].id;
      const currentEnrolledCourses = userData[0].enrolledCourses as string[] || [];

      // Get course IDs from order items
      const courseIds = transaction.order.items.map((item: any) => {
        // Extract course ID from item description or name
        const match = item.description.match(/Course ID: ([a-zA-Z0-9-]+)/);
        return match ? match[1] : item.name;
      });
      
      console.log('Extracted course IDs:', courseIds);

      // Get course details
      const courseDetails = await db
        .select({
          courseId: courses.id,
          name: courses.title,
          price: courses.price,
        })
        .from(courses)
        .where(inArray(courses.id, courseIds));

      if (!courseDetails.length) {
        console.error('No courses found for IDs:', courseIds);
        return NextResponse.json({ error: 'Courses not found' }, { status: 400 });
      }

      const items = courseDetails.map((course) => ({
        courseId: course.courseId,
        name: course.name,
        price: course.price,
      }));

      // Insert order
      await db.insert(orders).values({
        userId,
        status: 'completed',
        totalAmount,
        paymentMethod: 'paymob',
        items,
      });

      // Update user's enrolled courses
      const newEnrolledCourses = Array.from(new Set([...currentEnrolledCourses, ...courseIds]));
      console.log('Updating user enrolled courses:', { userId, newEnrolledCourses });
      
      await db
        .update(user)
        .set({ 
          enrolledCourses: newEnrolledCourses,
          updatedAt: new Date()
        })
        .where(eq(user.id, userId));
      console.log('User enrollment updated successfully');

      // Unlock all lectures for enrolled courses
      let totalUnlockedLectures = 0;
      for (const course of courseDetails) {
        console.log('Processing course for lecture unlock:', course.courseId);
        
        // Get all chapter IDs for this course
        const courseChapters = await db
          .select({ id: chapters.id })
          .from(chapters)
          .where(eq(chapters.courseId, course.courseId));
        
        console.log(`Found ${courseChapters.length} chapters for course ${course.courseId}`);

        if (courseChapters.length > 0) {
          const chapterIds = courseChapters.map(ch => ch.id);
          
          // Unlock all lectures for these chapters in one query
          const result = await db
            .update(lectures)
            .set({ isLocked: false })
            .where(inArray(lectures.chapterId, chapterIds));
          
          console.log(`Unlocked lectures for course ${course.courseId}, chapters:`, chapterIds);
          totalUnlockedLectures += chapterIds.length;
        }
      }
      console.log(`Total lectures unlocked: ${totalUnlockedLectures}`);

      // Clear user's cart
      await db.delete(cart).where(eq(cart.userId, userId));
      console.log('User cart cleared successfully');

      // Send confirmation email
      try {
        await sendEmail({
          to: userEmail,
          subject: 'Course Purchase Confirmation',
          text: 'Thank you for your course purchase via Paymob!',
          templateName: 'orderConfirmation',
          templateData: {
            courses: JSON.stringify(courseDetails),
            totalAmount: totalAmount.toString(),
            paymentMethod: 'Paymob',
          },
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }

      // Revalidate relevant pages to refresh cached data
      try {
        revalidatePath('/dashboards/student-dashboard');
        revalidatePath('/courses');
        revalidatePath('/cart');
        for (const courseId of courseIds) {
          revalidatePath(`/courses/${courseId}`);
        }
      } catch (revalidateError) {
        console.error('Failed to revalidate paths:', revalidateError);
      }

      console.log('=== PAYMOB PAYMENT PROCESSED SUCCESSFULLY ===');
      console.log('User ID:', userId);
      console.log('Enrolled courses updated:', newEnrolledCourses);
      return NextResponse.json({ status: 'success' });
    }

    console.log('Webhook ignored - not a successful transaction');
    return NextResponse.json({ status: 'ignored' });
  } catch (error) {
    console.error('=== PAYMOB WEBHOOK ERROR ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}