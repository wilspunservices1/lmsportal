import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { user } from "@/db/schemas/user";
import { courses } from "@/db/schemas/courses";
import { eq, inArray, lte, gte } from "drizzle-orm";
import { sendEmail } from "@/libs/email/emailService";
import { courseExpiryNotification } from "@/libs/email/templates/courseExpiryNotification";

export async function POST(req: NextRequest) {
	try {
		const today = new Date();
		const thirtyDaysFromNow = new Date(today);
		thirtyDaysFromNow.setDate(today.getDate() + 30);

		const expiringCourses = await db
			.select()
			.from(courses)
			.where(
				lte(courses.expiryDate, thirtyDaysFromNow)
			);

		if (expiringCourses.length === 0) {
			return NextResponse.json({ message: "No expiring courses found" });
		}

		const notifications = [];

		for (const course of expiringCourses) {
			const courseCreator = await db
				.select()
				.from(user)
				.where(eq(user.id, course.createdBy))
				.limit(1);

			const enrolledUsers = await db
				.select()
				.from(user)
				.where(inArray(user.id, course.purchasedUsers || []));

			const expiryDate = new Date(course.expiryDate).toLocaleDateString();
			const courseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${course.id}`;

			if (courseCreator.length > 0) {
				await sendEmail({
					to: courseCreator[0].email,
					subject: `Course Expiry Notice: ${course.title}`,
					html: courseExpiryNotification({
						userName: courseCreator[0].name,
						courseTitle: course.title,
						expiryDate,
						courseUrl,
					}),
				});
				notifications.push({ type: "creator", email: courseCreator[0].email });
			}

			for (const enrolledUser of enrolledUsers) {
				await sendEmail({
					to: enrolledUser.email,
					subject: `Course Expiry Notice: ${course.title}`,
					html: courseExpiryNotification({
						userName: enrolledUser.name,
						courseTitle: course.title,
						expiryDate,
						courseUrl,
					}),
				});
				notifications.push({ type: "student", email: enrolledUser.email });
			}
		}

		return NextResponse.json({
			message: "Notifications sent successfully",
			count: notifications.length,
		});
	} catch (error) {
		console.error("Error sending notifications:", error);
		return NextResponse.json(
			{ message: "Error sending notifications", error: error.message },
			{ status: 500 }
		);
	}
}
