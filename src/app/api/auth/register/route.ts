import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
import bcrypt from "bcryptjs";
import { db } from "../../../../db/index";
import { user } from "../../../../db/schemas/user";
import { eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "@/libs/email/emailService"; // Adjust this path to the actual location of your email servic
import { BASE_URL } from "@/actions/constant";
import { generateUniqueIdentifier } from "@/utils/generateUniqueIdentifier"; // Create this utility function

function generateUserName(fullName: string): string {
	const base = fullName.replace(/\s+/g, "").toLowerCase(); // Remove spaces & lowercase

	const now = new Date();
	const pad = (n: number) => n.toString().padStart(2, "0");

	const yy = now.getFullYear().toString().slice(-2);
	const MM = pad(now.getMonth() + 1);
	const dd = pad(now.getDate());
	const hh = pad(now.getHours());
	const mm = pad(now.getMinutes());

	const timestamp = `${yy}${MM}${dd}${hh}${mm}`; // YYMMDDhhmm
	return `${base}${timestamp}`;
}

// POST handler for user registration
export async function POST(req: Request) {
	try {
		const body = await req.json();
		let { email, password, username, resendOnly } = body;

		// Handle resend verification email request
		if (resendOnly) {
			if (!email) {
				return NextResponse.json({ message: "Email is required" }, { status: 400 });
			}

			email = email.toLowerCase();

			// Find existing unverified user
			const existingUser = await db
				.select()
				.from(user)
				.where(sql`LOWER(${user.email}) = ${email}`)
				.then((res) => res[0]);

			if (!existingUser) {
				return NextResponse.json({ message: "User not found" }, { status: 404 });
			}

			if (existingUser.isVerified) {
				return NextResponse.json({ message: "Email is already verified" }, { status: 400 });
			}

			// Generate new activation token
			const newActivationToken = uuidv4();

			// Update user with new token
			await db
				.update(user)
				.set({ activationToken: newActivationToken })
				.where(eq(user.id, existingUser.id));

			// Send verification email
			try {
				console.log('Sending verification email to:', email);
				console.log('Activation link:', `${BASE_URL}/pass/activate?token=${newActivationToken}`);
				
				const emailResult = await sendEmail({
					to: email,
					subject: "Email Verification Required - Meridian LMS",
					text: "Please verify your email address to complete registration.",
					templateName: "activationEmailTemplate",
					templateData: {
						name: existingUser.name || existingUser.username,
						activationLink: `${BASE_URL}/pass/activate?token=${newActivationToken}`,
					},
				});
				
				console.log('Email sent successfully:', emailResult.messageId);
			} catch (emailError) {
				console.error('Failed to send verification email:', emailError);
				return NextResponse.json({ message: "Failed to send verification email" }, { status: 500 });
			}

			return NextResponse.json({ message: "Verification email sent successfully" }, { status: 200 });
		}

		// Check for required fields for registration
		if (!email || !password || !username) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}

		// Normalize email to lowercase
		email = email.toLowerCase();

		// Check for duplicate email (case-insensitive)
		const existingUser = await db
			.select()
			.from(user)
			.where(sql`LOWER(${user.email}) = ${email}`)
			.then((res) => res);
		if (existingUser.length > 0) {
			return NextResponse.json(
				{
					message: "Email already registered. Please login or verify your email.",
				},
				{ status: 409 }
			);
		}

		const hashPassword = await bcrypt.hash(password, 10);
		const activationToken = uuidv4();
		const uniqueIdentifier = await generateUniqueIdentifier("user");

		// Send activation email using the centralized sendEmail function
		try {
			console.log('Sending registration email to:', email);
			console.log('Activation link:', `${BASE_URL}/pass/activate?token=${activationToken}`);
			
			const emailSent = await sendEmail({
				to: email,
				subject: "Email Verification Required - Meridian LMS",
				text: "Please verify your email address to complete registration.",
				templateName: "activationEmailTemplate",
				templateData: {
					name: username,
					activationLink: `${BASE_URL}/pass/activate?token=${activationToken}`,
				},
			});
			
			console.log('Registration email sent successfully:', emailSent.messageId);
		} catch (emailError) {
			console.error('Failed to send registration email:', emailError);
			return NextResponse.json(
				{ message: "Failed to send verification email. Try again later." },
				{ status: 500 }
			);
		}

		// Insert user into the database only if email is successfully sent
		await db.insert(user).values({
			uniqueIdentifier,
			email, // Email is already normalized to lowercase
			password: hashPassword,
			username: generateUserName(username),
			name: username.trim(),
			roles: JSON.stringify(["user"]),
			isVerified: false,
			activationToken,
		});

		return NextResponse.json(
			{
				message: "User created. Please check your email to activate your account.",
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
	}
}