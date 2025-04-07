import { NextResponse } from "next/server";
import { db } from "../../../../db/index";
import { user } from "../../../../db/schemas/user";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/libs/email/emailService"; // Adjust path as needed
import { BASE_URL_API } from "@/actions/constant";
import { v4 as uuidv4 } from "uuid"; // Import UUID for generating new tokens

export async function POST(req) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json({ message: "Email is required" }, { status: 400 });
		}

		// Find user by email
		const foundUser = await db
			.select()
			.from(user)
			.where(eq(user.email, email))
			.then((res) => res[0]);

		if (!foundUser) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		if (foundUser.isVerified) {
			return NextResponse.json(
				{ message: "Account already verified. Please log in." },
				{ status: 400 }
			);
		}

		// Generate a new activation token
		const newActivationToken = uuidv4();

		// Update the user record with the new token
		await db
			.update(user)
			.set({ activationToken: newActivationToken })
			.where(eq(user.email, email));

		// Resend activation email with the new token
		await sendEmail({
			to: email,
			subject: "Resend: Activate Your Account",
			text: "Please activate your account.",
			templateName: "activationEmailTemplate",
			templateData: {
				name: foundUser.username,
				activationLink: `${BASE_URL_API}/auth/activate?token=${newActivationToken}`,
			},
		});

		return NextResponse.json(
			{ message: "Activation link resent. Please check your email." },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error resending activation email:", error);
		return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
	}
}
