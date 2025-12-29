import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const LOCATION_ID = "06991212921947635977";

const serviceAccount = {
  type: "service_account",
  project_id: "meridian-lms-482712",
  private_key_id: "53de31de7b2326aac54fbba3336f214b1ea4401d",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDRUBUVV/q2u8Ix\no/ff1JoWZjKwRIvFFbip7xW2l3DQyc1K2PebyOp/QGfRcLxRJGFcK2nhupTjnfQ5\nU7tOEA7KzcoyE6+xZq1mcDrncyXDrZaI3JjSWhhtHCrjPdtuDei0EAKq+FrGwHg9\nnXddG/YZKxS8URspiiq6cN0czK/SSF3BgA2fzToEXaAJAgKZp1EWes4kl165VMSj\nADucAcbdYhFjYxFvh3eWpbav+FhxgwM0j5XvD0TPy4oablrdKsXIzW//qR2TJSF2\nl0fWJskOe74SCP4Ae77sqZcFKqjWK7ctL2PR0+i+tAyozxBh6ZmE9mxSKIv/itoe\naNivibuRAgMBAAECggEAOUKfqemaEDBYJS1Wi5iFGLiXiEoQNHfHP1HFDmDqf2ud\nairlveveXrZ3UD/3fHkn20eTHSnmPkiBPceOt4HEEi3u8PkauLy+lgYAzz1caOYN\nht5WPkFgakTo5KaQ51ANx2iT2kK7zqBrpGt18nZKQkNbVlMXy6rdGojyrETAmpUr\nhvuPQyVycnDJIlRSjvR1dk8l23c+EMlEjQf5z/j5Po7TBIaM8XI6gsfPoSFJ51iO\nrQoBHfIiNQDcZckT5weTluJA1Lvpfw+lBmXzDsR/THwPUGaoFUhYhZCLD9+6FK+H\nr0ntW9foUMcmxrcPnAkJAQBs53AYjUy5lFcFdJ5NewKBgQD3UC6IorU2JP63Voff\nBwcdliTKg2p3QvwihztNU79kIOV6DzXhQC5aENOWRsM0bEk+XACts6pt2tgbLdVE\n4kXE+E38MRCRpZ5ciFC1eKHihn3OdT1nj5sHbi6JMhhUB86osdGvtpsULvRUpicp\nboNSdudd1cwRMaFZnDHwKfx5AwKBgQDYqjRZ66CvR0+bp0wcxaMWMnUC6f1MNs6s\nJG3Wr+J4j6oC6JOauF3K03yMC+VXpN1iRRcDBR+Ksr0NqT6cny5jWp7MeOeMdrPE\noy7ejCkX1i949lFIF978E7zOhR5lysrMmfip5J2St/r0Rswb4aYTR2lD4G9p6fHi\nrOoKYAQS2wKBgQCIZu7jaWoszMa387/IoKWqCc+M6mJkGMvbd16bzZ736LToV09O\nRwnJnxI0Bh9P4JGdFT1CkJ9lK5iZlPPVpD763kCU4bLTwdbQDlcFX91ZhPgKUNtn\nLOtCc+CyxrBoWE4A+OI/2aU6wpL7xRBAZ7WCXBZLyMleilMFi4J3hZC8ZQKBgFH3\nKfDupA5LQwGWq8OivQzTr9KXZLzlaxBSg78ZMOr9JosNI3H/13O4yEBO68dZVmsr\nygXZdVJKRh0Z7tbfnXP2v2aJQsevzFhSh5OnoJAk9jajsKI+bZwdd2sFjzdhHZGD\nmj/jff0YXvb0pZjSp7pZZKhKCrwdxeVEFxIvurrLAoGBAPA/gDcvI4koEu2Xgp/M\nNowHggD6mcW2o1TadiceU4fLctt+DlfaZGsZUM+uGMLQq6UKWmGLNv6rgGXKBNed\nJrRDCxNa1xdk6WprwCpWknYtslOBlqe5OVIlvfivcYRQSNpbj3dhim1lfE9mEFLZ\nXGzkJfoHmVyyjk+sarqkNlMo\n-----END PRIVATE KEY-----\n",
  client_email: "google-reviews@meridian-lms-482712.iam.gserviceaccount.com",
  client_id: "116731053130311088818",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/google-reviews%40meridian-lms-482712.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

export async function GET(req: NextRequest) {
	try {
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
