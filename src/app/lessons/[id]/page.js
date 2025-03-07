import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import LessonMain from "@/components/layout/main/LessonMain";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/actions/constant";
import { isUUID } from "validator"; // UUID validator

export const dynamic = "force-dynamic";

// Fetch lesson data from the API
const fetchLessonById = async (id) => {
	// Explicitly await the ID if needed
	id = await Promise.resolve(id);

	if (!id || !isUUID(id)) {
		console.error("Invalid or missing UUID:", id);
		return null;
	}

	const apiUrl = `${BASE_URL}/api/lessons/${id}`;
	console.log("Fetching lesson from API:", apiUrl); // Debugging log

	try {
		const res = await fetch(apiUrl, { method: "GET" });
		const contentType = res.headers.get("content-type");

		if (!res.ok || !contentType.includes("application/json")) {
			console.error("API Error Response:", await res.text());
			throw new Error("Failed to fetch lesson or invalid JSON response");
		}

		return await res.json();
	} catch (error) {
		console.error("Error fetching lesson:", error.message);
		return null;
	}
};

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }) {
	// Await the entire params object before using its properties
	const awaitedParams = await Promise.resolve(params);
	const lessonId = awaitedParams.id;

	if (!lessonId) {
		console.error("Lesson ID is missing in metadata generation:", lessonId);
		return {
			title: "Lesson Not Found",
			description:
				"Lesson not found in Meridian LMS - Education LMS Template",
		};
	}

	const lesson = await fetchLessonById(lessonId);

	if (!lesson) {
		return {
			title: "Lesson Not Found",
			description:
				"Lesson not found in Meridian LMS - Education LMS Template",
		};
	}

	const { title, id } = lesson;
	return {
		title: `Lesson ${
			id == 1 ? "" : id < 10 ? "0" + id : id
		} | Meridian LMS - Education LMS Template`,
		description: `${title} | Meridian LMS - Education LMS Template`,
	};
}

// The main lesson component that renders lesson data or 404 if not found
const Lesson = async ({ params }) => {
	// Explicitly await params.id
	const { id } = await Promise.resolve(params);

	if (!id) {
		console.error("Lesson ID is missing or undefined:", id);
		notFound(); // Redirect to 404 page
	}

	console.log("Fetching lesson for ID:", id); // Debugging log

	// Fetch lesson data from API
	const lesson = await fetchLessonById(id);

	// If the lesson does not exist, show a 404 page
	if (!lesson) {
		notFound();
	}

	return (
		<PageWrapper>
			<main>
				<LessonMain lesson={lesson} />
				<ThemeController />
			</main>
		</PageWrapper>
	);
};

// Export the Lesson component as the default export
export default Lesson;
