import { BASE_URL } from "@/actions/constant";

// export const fetchLessonById = async (id : string) => {
//   try {
//     const res = await fetch(`${BASE_URL}/api/lessons/${id}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//     });
//     if (!res.ok) {
//       throw new Error("Failed to fetch lesson");
//     }
//     const lesson = await res.json();
//     return lesson;
//   } catch (error) {
//     console.error("Error fetching lesson:", error);
//     return null;
//   }
// };

export const fetchLessonById = async (id: string): Promise<any> => {
	// Ensure a valid ID is provided before attempting to fetch.
	if (!id) {
		console.warn(
			"fetchLessonById: No valid lesson ID provided. Please supply a valid ID."
		);
		// Optionally wait briefly (here, 1 second) before returning.
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return null;
	}

	try {
		// Attempt to fetch the lesson using the provided valid ID.
		const res = await fetch(`${BASE_URL}/api/lessons/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		// Check if the response is successful.
		if (!res.ok) {
			throw new Error(
				`Failed to fetch lesson with ID ${id}. Status: ${res.statusText}`
			);
		}

		// Parse and return the lesson data as JSON.
		const lesson = await res.json();
		return lesson;
	} catch (error) {
		console.error("Error fetching lesson:", error);
		return null;
	}
};

export const fetchEnrolledCourses = async (userId: string) => {
	try {
		const res = await fetch(
			`${BASE_URL}/api/user/${userId}/enrollCourses`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			}
		);
		if (!res.ok) {
			throw new Error("Failed to fetch enrolled courses");
		}
		const enrolledCourses = await res.json();
		return enrolledCourses;
	} catch (error) {
		console.error("Error fetching enrolled courses:", error);
		return [];
	}
};

// Fetch course data based on chapterId
export const fetchCourseByChapterId = async (chapterId: string) => {
	try {
		const res = await fetch(
			`${BASE_URL}/api/courses/chapters/${chapterId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			}
		);
		if (!res.ok) {
			if (res.status === 404) {
				throw new Error("Chapter not found");
			}
			throw new Error("Failed to fetch course by chapterId");
		}
		const courseData = await res.json();
		return courseData;
	} catch (error) {
		console.error("Error fetching course:", error);
		return null;
	}
};

// Convert local path to URL for videos
export const convertLocalPathToUrl = (videoUrl: string) => {
	if (videoUrl.startsWith("D:\\AI_LMS\\public\\uploads\\")) {
		return videoUrl.replace("D:\\AI_LMS\\public\\uploads\\", "/uploads/");
	}
	return videoUrl;
};
