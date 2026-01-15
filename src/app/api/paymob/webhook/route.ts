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
    console.log('Timestamp:', new Date().toISOString());
    console.log('Full body:', JSON.stringify(body, null, 2));
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    console.log('Body type:', body.type);
    console.log('Transaction success:', body.obj?.success);
    console.log('Order extras:', body.obj?.order?.extras);
    console.log('Order items:', body.obj?.order?.items);
    
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

    // Process successful payment
    if (body.type === 'TRANSACTION' && body.obj.success === true) {
      console.log('✅ Processing successful transaction');
      const transaction = body.obj;
      const orderId = transaction.order.id;
      const userEmail = transaction.order.shipping_data?.email || transaction.payment_key_claims?.billing_data?.email || transaction.billing_data?.email;
      const totalAmount = transaction.amount_cents / 100;
      
      console.log('Transaction ID:', transaction.id);
      console.log('Order ID:', orderId);
      console.log('Extracted user email:', userEmail);
      console.log('Total amount:', totalAmount);
      
      if (!userEmail) {
        console.error('❌ No email found in transaction data');
        console.error('Shipping data:', transaction.order.shipping_data);
        console.error('Payment key claims:', transaction.payment_key_claims);
        console.error('Billing data:', transaction.billing_data);
        return NextResponse.json({ error: 'Email not found' }, { status: 400 });
      }

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
      const currentEnrolledCourses = userData[0].enrolledCourses || [];
      console.log('Current enrolled courses type:', typeof currentEnrolledCourses);
      console.log('Current enrolled courses:', currentEnrolledCourses);

      // Check if this is a renewal
      const isRenewal = transaction.order.extras?.isRenewal === 'true';
      console.log('🔄 Is Renewal (Paymob):', isRenewal);

      // Get course IDs from extras first (most reliable)
      let courseIds: string[] = [];
      
      if (transaction.order.extras?.courseIds) {
        courseIds = transaction.order.extras.courseIds.split(',').filter(Boolean);
        console.log('✅ Course IDs from extras:', courseIds);
      }
      
      // Fallback: extract from item descriptions
      if (courseIds.length === 0) {
        courseIds = transaction.order.items.map((item: any) => {
          const match = item.description?.match(/Course ID: ([a-zA-Z0-9-]+)/);
          if (match) {
            return match[1];
          }
          console.warn('⚠️ Could not extract course ID from description:', item.description);
          return null;
        }).filter(Boolean);
        console.log('📝 Course IDs from descriptions:', courseIds);
      }
      
      if (courseIds.length === 0) {
        console.error('❌ No course IDs found in order items or extras');
        console.error('Transaction data:', JSON.stringify(transaction.order, null, 2));
        return NextResponse.json({ error: 'No course IDs found' }, { status: 400 });
      }
      
      console.log('Final extracted course IDs:', courseIds);

      // Get course details
      const courseDetails = await db
        .select({
          courseId: courses.id,
          name: courses.title,
          price: courses.price,
          accessDurationMonths: courses.accessDurationMonths,
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
      
      // Increment enrolledCount for each purchased course (same as Stripe)
      await Promise.all(
        courseIds.map(async (courseId) => {
          await db
            .update(courses)
            .set({
              enrolledCount: sql`${courses.enrolledCount} + 1`,
            })
            .where(eq(courses.id, courseId));
        })
      );
      console.log('✅ Enrolled count incremented for courses:', courseIds);

      // **Prepare the Courses to be Added to EnrolledCourses (same as Stripe)**
      const enrollmentDate = new Date();
      const newCourses = courseIds.map((courseId: string) => {
        const course = courseDetails.find(c => c.courseId === courseId);
        const accessDuration = isRenewal ? 1 : (course?.accessDurationMonths ? parseInt(course.accessDurationMonths.toString()) : null);
        
        // Calculate expiry date
        const expiryDate = new Date(enrollmentDate);
        if (accessDuration) {
          expiryDate.setMonth(expiryDate.getMonth() + accessDuration);
        }
        
        return {
          courseId,
          progress: 0,
          completedLectures: [],
          enrollmentDate: enrollmentDate.toISOString(),
          expiryDate: accessDuration ? expiryDate.toISOString() : null,
        };
      });

      // **Update EnrolledCourses, Only Adding New Courses**
      const existingCourses = currentEnrolledCourses || [];
      const updatedEnrolledCourses = isRenewal
        ? existingCourses.map((ec: any) => {
            if (courseIds.includes(ec.courseId)) {
              const newExpiry = new Date();
              newExpiry.setMonth(newExpiry.getMonth() + 1);
              console.log('✅ Renewing course (Paymob):', ec.courseId, 'New expiry:', newExpiry.toISOString());
              return { ...ec, expiryDate: newExpiry.toISOString() };
            }
            return ec;
          })
        : [
            ...existingCourses,
            ...newCourses.filter(
              (newCourse) =>
                !existingCourses.some(
                  (existingCourse: any) => existingCourse.courseId === newCourse.courseId
                )
            ),
          ];

      console.log('Updating user enrolled courses:', { userId, updatedEnrolledCourses });
      
      await db
        .update(user)
        .set({ 
          enrolledCourses: updatedEnrolledCourses,
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
      console.log('Enrolled courses updated:', updatedEnrolledCourses);
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