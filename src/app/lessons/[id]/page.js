import ThemeController from "@/components/shared/others/ThemeController";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import LessonMain from "@/components/layout/main/LessonMain";
import { notFound } from "next/navigation";
import { BASE_URL_API } from "@/actions/constant";
import { isUUID } from "validator"; // Use a UUID validator

export const dynamic = 'force-dynamic';

// Fetch lesson data from the API
const fetchLessonById = async (id) => {
  // Validate UUID before making the request
  if (!isUUID(id)) {
    console.error("Invalid UUID format:", id);
    return null;
  }

  try {

    const res = await fetch(`${BASE_URL_API}/lessons/${id}`, { method: "GET" });


    const contentType = res.headers.get("content-type");

    // Check if the response is OK and JSON formatted
    if (!res.ok || !contentType.includes("application/json")) {
      console.error("Error response:", await res.text());
      throw new Error("Failed to fetch the lesson or invalid JSON response");
    }

    return await res.json(); // Return parsed lesson data
  } catch (error) {
    console.error("Error fetching lesson:", error.message || error);
    return null; // Handle failure gracefully
  }
};

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }) {
  const lesson = await fetchLessonById(params.id);


  if (!lesson) {
    return {
      title: "Lesson Not Found",
      description: "Lesson not found in Meridian LMS - Education LMS Template",
    };
  }

  const { title, id } = lesson;
  return {
    title: `Lesson ${id == 1 ? "" : id < 10 ? "0" + id : id} | Meridian LMS - Education LMS Template`,
    description: `${title} | Meridian LMS - Education LMS Template`,
  };
}

// The main lesson component that renders lesson data or 404 if not found
const Lesson = async ({ params }) => {
  const { id } = params;
  console.log("✅✅params", params)

  // Fetch lesson data from the API
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