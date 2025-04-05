import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
import bcrypt from "bcryptjs";
import { db } from "../../../../db/index";
import { user } from "../../../../db/schemas/user";
import { eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "@/libs/emial/emailService"; // Adjust this path to the actual location of your email servic
import { BASE_URL } from "@/actions/constant";
import { generateUniqueIdentifier } from "@/utils/generateUniqueIdentifier"; // Create this utility function

function generateNameFromUsername(username: string): string {
	const parts = username.split(" ");
	if (parts.length >= 2) {
		return `${parts[0]} ${parts[1]}`;
	}
	return username;
}

// POST handler for user registration
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { email, password, username } = body;

		// Check for required fields
		if (!email || !password || !username) {
			return NextResponse.json(
				{ message: "Missing required fields" },
				{ status: 400 }
			);
		}

    // Check for duplicate email
		const existingUser = await db
			.select()
			.from(user)
			.where(eq(user.email, email))
			.then((res) => res);
		if (existingUser.length > 0) {
			return NextResponse.json(
				{
					message:
						"Email already registered. Please login or verify your email.",
				},
				{ status: 409 }
			);
		}

    const hashPassword = await bcrypt.hash(password, 10);
    const activationToken = uuidv4();
    const uniqueIdentifier = await generateUniqueIdentifier('user');

	
		// Send activation email using the centralized sendEmail function
    const emailSent = await sendEmail({
      to: email,
      subject: "Activate Your Account",
      text: "Please activate your account.",
      templateName: "activationEmailTemplate",
      templateData: {
        name: username,
        activationLink: `${BASE_URL}/pass/activate?token=${activationToken}`,
      },
    });

    if (!emailSent) {
      return NextResponse.json({ message: "Failed to send verification email. Try again later." }, { status: 500 });
    }

    // Insert user into the database only if email is successfully sent
    await db.insert(user).values({
      uniqueIdentifier,
      email,
      password: hashPassword,
      username,
      name: username.trim(),
	  roles: JSON.stringify(["user"]),      isVerified: false,
      activationToken,
    });

		return NextResponse.json(
			{
				message:
					"User created. Please check your email to activate your account.",
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Error", error: error.message },
			{ status: 500 }
		);
	}
}
