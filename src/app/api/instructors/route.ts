// src/app/api/instructors/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { user } from "@/db/schemas/user";
import { instructorApplications } from "@/db/schemas/instructor"; // Import the new schema
import { eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "@/libs/email/emailService";
import { BASE_URL } from "@/actions/constant";
import { generateUniqueIdentifier } from "@/utils/generateUniqueIdentifier";

function generateNameFromUsername(username: string) {
	const parts = username.split(" ");
	if (parts.length >= 2) {
		return `${parts[0]} ${parts[1]}`;
	}
	return username;
}

export async function POST(req: Request) {
	try {
		// Check if request is FormData or JSON
		const contentType = req.headers.get('content-type');
		let email, phone, username, password, instructorBio, qualifications;
		
		if (contentType?.includes('multipart/form-data')) {
			// Handle FormData (new form with resume)
			const formData = await req.formData();
			const name = formData.get("name") as string;
			email = formData.get("email") as string;
			const company = formData.get("company") as string;
			phone = formData.get("phone") as string;
			const bio = formData.get("bio") as string;
			const linkedIn = formData.get("linkedIn") as string;
			const resume = formData.get("resume") as File;
			
			username = name;
			password = uuidv4(); // Generate random password
			instructorBio = bio || "";
			qualifications = JSON.stringify({ company, linkedIn, resume: resume?.name });
		} else {
			// Handle JSON (old form)
			const body = await req.json();
			({ email, phone, username, password, instructorBio, qualifications } = body);
		}

		// Check for required fields
		if (!email || !password || !username) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}

		// Check for duplicate email
		const existingUser = await db
			.select()
			.from(user)
			.where(eq(user.email, email))
			.then((res: any[]) => res[0]);

		if (!existingUser) {
			// If user doesn't exist, create a new user account
			const hashPassword = await bcrypt.hash(password, 10);
			const uniqueIdentifier = await generateUniqueIdentifier("instructor");
			const activationToken = uuidv4();

			const newUser = await db
				.insert(user)
				.values({
					email,
					phone,
					password: hashPassword,
					username,
					uniqueIdentifier,
					name: generateNameFromUsername(username).trim(),
					roles: sql`'["instructor"]'::json`,
					isVerified: false,
					activationToken,
				})
				.returning()
				.then((res: any[]) => res[0]);

			// Send activation email (non-blocking)
			try {
				await sendEmail({
					to: email,
					subject: "Activate Your Account",
					text: "Please activate your account.",
					templateName: "activationEmailTemplate",
					templateData: {
						name: username,
						activationLink: `${BASE_URL}/pass/activate?token=${activationToken}`,
					},
				});
			} catch (emailError) {
				console.error("Failed to send activation email:", emailError);
			}

			// Create instructor application
			await db.insert(instructorApplications).values({
				userId: newUser.id,
				instructorBio,
				qualifications: typeof qualifications === 'string' ? qualifications : JSON.stringify(qualifications || []),
			});

			// Send notification emails (non-blocking)
			try {
				await sendEmail({
					to: process.env.INSTRUCTOR_EMAIL_RECEIVER!,
					subject: `Instructor Application – ${username}`,
					text: `
      New Instructor Application
      
      Name: ${username}
      Email: ${email}
      Phone: ${phone}
      Bio: ${instructorBio}
      Qualifications: ${Array.isArray(qualifications) ? qualifications.join(", ") : qualifications}
      `,
				});

				await sendEmail({
					to: "training@meqmp.com",
					subject: "New Instructor Application",
					text: `User ${username} has applied to become an instructor.`,
					templateName: "newInstructorApplication",
					templateData: {
						username,
						email,
						link: `${BASE_URL}/dashboards/roles`,
					},
				});
			} catch (emailError) {
				console.error("Failed to send notification emails:", emailError);
			}

			return NextResponse.json(
				{
					message:
						"Your application has been submitted. Please check your email to activate your account.",
				},
				{ status: 201 }
			);
		} else {
			// If user exists, create instructor application
			await db.insert(instructorApplications).values({
				userId: existingUser.id,
				instructorBio,
				qualifications: typeof qualifications === 'string' ? qualifications : JSON.stringify(qualifications || []),
			});

			// Send notification emails (non-blocking)
			try {
				await sendEmail({
					to: process.env.INSTRUCTOR_EMAIL_RECEIVER!,
					subject: `Instructor Application – ${username}`,
					text: `
      New Instructor Application
      
      Name: ${username}
      Email: ${email}
      Phone: ${phone}
      Bio: ${instructorBio}
      Qualifications: ${Array.isArray(qualifications) ? qualifications.join(", ") : qualifications}
      `,
				});

				await sendEmail({
					to: "training@meqmp.com",
					subject: "New Instructor Application",
					text: `User ${username} has applied to become an instructor.`,
					templateName: "newInstructorApplication",
					templateData: {
						username,
						email,
						link: `${BASE_URL}/admin/instructor-applications`,
					},
				});
			} catch (emailError) {
				console.error("Failed to send notification emails:", emailError);
			}

			return NextResponse.json(
				{
					message: "Your application has been submitted.",
				},
				{ status: 201 }
			);
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
	}
}
