import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses } from "@/db/schemas/courses";
import { user } from "@/db/schemas/user";
import { sql, eq, and } from "drizzle-orm";

// Function to get global statistics
async function getGlobalCounts() {
  try {
    const [activeCourses] = await db
      .select({ count: sql`COUNT(*)` })
      .from(courses)
      .where(eq(courses.isPublished, true))
      .execute();

    const [totalCourses] = await db
      .select({ count: sql`COUNT(*)` })
      .from(courses)
      .execute();

    const [totalStudents] = await db
      .select({ count: sql`COUNT(*)` })
      .from(user)
      .execute();

    return {
      activeCourses: activeCourses.count || 0,
      totalCourses: totalCourses.count || 0,
      totalStudents: totalStudents.count || 0,
    };
  } catch (error) {
    console.error('Error fetching global counts:', error);
    throw error;
  }
}

// Enhanced function to get user-specific statistics
async function getUserCounts(userId) {
  try {
    const [currentUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .execute();

    if (!currentUser) {
      throw new Error('User not found');
    }

    // Get detailed enrolled courses with progress
    const enrolledCourses = currentUser.enrolledCourses || [];
    const completedCourses = enrolledCourses.filter(course => course.progress === 100);
    
    // Get course details for enrolled courses
    const courseIds = enrolledCourses.map(course => course.courseId);
    const courseDetails = courseIds.length > 0 
      ? await db
          .select()
          .from(courses)
          .where(and(
            eq(courses.isPublished, true),
            sql`${courses.id} IN ${courseIds}`
          ))
          .execute()
      : [];

    return {
      enrolledCourses: enrolledCourses.length,
      completedCourses: completedCourses.length,
      enrolledCoursesDetails: courseDetails,
      completedCoursesDetails: courseDetails.filter(course => 
        completedCourses.some(c => c.courseId === course.id))
    };
  } catch (error) {
    console.error('Error fetching user counts:', error);
    throw error;
  }
}

// API handler function
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const globalCounts = await getGlobalCounts();
    let userCounts = {
      enrolledCourses: 0,
      completedCourses: 0,
      enrolledCoursesDetails: [],
      completedCoursesDetails: []
    };

    if (userId) {
      userCounts = await getUserCounts(userId);
    }

    const responseData = {
      counts: [
        {
          name: "Enrolled Courses",
          data: userId ? userCounts.enrolledCourses : 0,
          symbol: "+",
          isUserSpecific: !!userId,
        },
        {
          name: "Active Courses",
          data: globalCounts.activeCourses,
          symbol: "+",
          isUserSpecific: false,
        },
        {
          name: "Completed Courses",
          data: userId ? userCounts.completedCourses : 0,
          symbol: "+",
          isUserSpecific: !!userId,
        },
        {
          name: "Total Courses",
          data: globalCounts.totalCourses,
          symbol: "+",
          isUserSpecific: false,
        },
        {
          name: "Total Students",
          data: globalCounts.totalStudents,
          symbol: "+",
          isUserSpecific: false,
        }
      ],
      courses: userId ? {
        enrolled: userCounts.enrolledCoursesDetails,
        completed: userCounts.completedCoursesDetails
      } : null,
      meta: {
        isUserDashboard: !!userId,
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in API handler:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to fetch dashboard statistics",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.message === 'User not found' ? 404 : 500 }
    );
  }
}