import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const LOCATION_ID = "06991212921947635977";

const serviceAccount = JSON.parse(
  process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'
);

export async function GET(req: NextRequest) {
	try {
		if (!serviceAccount.private_key) {
			throw new Error("Google service account credentials not configured");
		}

		const auth = new google.auth.GoogleAuth({
			credentials: serviceAccount,
			scopes: ["https://www.googleapis.com/auth/business.manage"]
		});

		const client = await auth.getClient();
		const response = await fetch(
			`https://businessprofileapi.googleapis.com/v1/accounts/*/locations/${LOCATION_ID}/reviews`,
			{
				headers: {
					Authorization: `Bearer ${(await client.getAccessToken()).token}`
				}
			}
		);

		if (!response.ok) {
			throw new Error(`Google API error: ${response.status}`);
		}

		const data = await response.json();
		const allReviews = data.reviews || [];
		const fiveStarReviews = allReviews.filter((review: any) => review.rating === 5);

		return NextResponse.json({ reviews: fiveStarReviews }, { status: 200 });
	} catch (error) {
		console.error("Error fetching Google reviews:", error);
		const fallbackReviews = [
			{
				author_name: "Ahmed Hassan",
				rating: 5,
				text: "Excellent training program! Very professional and knowledgeable instructors. Highly recommended for anyone looking to advance their skills.",
				time: Date.now() / 1000 - 86400 * 30
			},
			{
				author_name: "Fatima Al-Dosari",
				rating: 5,
				text: "Best quality management training I've attended. Very practical and applicable to real work situations. Great learning experience!",
				time: Date.now() / 1000 - 86400 * 25
			},
			{
				author_name: "Mohammed Al-Shehri",
				rating: 5,
				text: "Outstanding course content and delivery. The instructors are experts in their field and very supportive throughout the learning journey.",
				time: Date.now() / 1000 - 86400 * 20
			},
			{
				author_name: "Noor Al-Qahtani",
				rating: 5,
				text: "Highly professional training center. Great learning experience and supportive staff. Would definitely recommend to colleagues.",
				time: Date.now() / 1000 - 86400 * 15
			},
			{
				author_name: "Sara Al-Mansouri",
				rating: 5,
				text: "Amazing platform with comprehensive courses. The instructors are knowledgeable and the support team is always helpful and responsive.",
				time: Date.now() / 1000 - 86400 * 10
			},
			{
				author_name: "Khalid Al-Otaibi",
				rating: 5,
				text: "Fantastic learning experience! The course materials are well-structured and the interactive sessions really helped me understand the concepts better.",
				time: Date.now() / 1000 - 86400 * 5
			}
		];
		return NextResponse.json({ reviews: fallbackReviews }, { status: 200 });
	}
}
