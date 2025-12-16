import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db"; // Ensure this path is correct
// import bcrypt from "bcrypt";
import bcrypt from "bcryptjs";
import { user as userSchema } from "@/db/schemas/user";
import { eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";

export const options = {
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID as string,
			clientSecret: process.env.GOOGLE_SECRET as string,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials: any) {
				if (!credentials?.email) {
					throw new Error("Email is required");
				}
				
				// Get all users and find match manually (fallback approach)
				const allUsers = await db
					.select()
					.from(userSchema);
				
				// Find user with case-insensitive email match
				const foundUser = allUsers.find(
					u => u.email.toLowerCase() === credentials.email.toLowerCase()
				);

				if (!foundUser) {
					throw new Error("No user found with this email.");
				}

				if (!foundUser.isVerified && foundUser.activationToken) {
					throw new Error("Please verify your email before logging in.");
				}

				const isValid = await bcrypt.compare(credentials.password, foundUser.password);
				if (!isValid) {
					throw new Error("Password does not match.");
				}

				return foundUser;
			},
		}),
	],
	callbacks: {
		async signIn({ user, account, profile }) {
			if (account.provider === "google" || account.provider === "github") {
				// Normalize email to lowercase
				const email = user.email ? user.email.toLowerCase() : "";

				// Check if the user already exists in the database (case-insensitive)
				const allUsers = await db.select().from(userSchema);
				let foundUser = allUsers.find(u => u.email.toLowerCase() === email);

				if (!foundUser) {
					try {
						const uniqueIdentifier = uuidv4();
						const hashedPassword = await bcrypt.hash(uuidv4(), 10);
						const baseUsername = (profile?.name || email.split("@")[0]).replace(/\s+/g, "").toLowerCase();
						
						await db.insert(userSchema).values({
							uniqueIdentifier,
							email,
							password: hashedPassword,
							username: `${baseUsername}${Date.now()}`,
							name: profile?.name || email.split("@")[0],
							image: profile?.picture,
							roles: JSON.stringify(["user"]),
							isVerified: true,
							activationToken: null,
						});
					} catch (error) {
						console.error('OAuth user creation error:', error);
						return false;
					}
				}
			}
			return true;
		},
		async jwt({ token, user, account }) {
			if (user && account) {
				if (account.provider === "google" || account.provider === "github") {
					// For OAuth users, get the database user ID
					const email = user.email?.toLowerCase();
					const allUsers = await db.select().from(userSchema);
					const dbUser = allUsers.find(u => u.email.toLowerCase() === email);
					if (dbUser) {
						token.id = dbUser.id;
						token.roles = dbUser.roles;
					}
				} else {
					// For credentials login
					token.id = user.id;
					token.roles = user.roles;
				}
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id;
			session.user.roles = token.roles; // Updated to handle multiple roles
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/login",
	},
};

export async function getSession() {
	return await getServerSession(options);
}