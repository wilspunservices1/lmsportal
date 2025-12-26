"use client";

import { useEffect, useState } from "react";
import useSweetAlert from "@/hooks/useSweetAlert";

const FreeCourseAllotment = () => {
	const creteAlert = useSweetAlert();
	const [courses, setCourses] = useState([]);
	const [userEmail, setUserEmail] = useState("");
	const [selectedCourse, setSelectedCourse] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await fetch("/api/courses?includeAllStatuses=true");
				if (response.ok) {
					const data = await response.json();
					setCourses(data.data || []);
				}
			} catch (err) {
				console.error("Error fetching courses:", err);
			}
		};

		fetchCourses();
	}, []);

	const handleAllotment = async (e) => {
		e.preventDefault();
		if (!userEmail || !selectedCourse) {
			creteAlert("warning", "Please enter email and select a course");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch("/api/allot-course", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userEmail,
					courseId: selectedCourse,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				creteAlert("success", `Course allotted successfully to ${userEmail}!`);
				setUserEmail("");
				setSelectedCourse("");
			} else if (response.status === 400 && data.message?.includes("already enrolled")) {
				creteAlert("warning", "User is already enrolled in this course");
			} else {
				creteAlert("error", data.message || "Failed to allot course");
			}
		} catch (err) {
			creteAlert("error", "Error allotting course");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mb-10">
			<div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-l-4 border-green-500">
				<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
					🎁 Free Course Allotment
				</h2>

				<form onSubmit={handleAllotment} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							User Email
						</label>
						<input
							type="email"
							value={userEmail}
							onChange={(e) => setUserEmail(e.target.value)}
							placeholder="Enter user email"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Select Course
						</label>
						<select
							value={selectedCourse}
							onChange={(e) => setSelectedCourse(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
						>
							<option value="">-- Choose a course --</option>
							{courses.map((course) => (
								<option key={course.id} value={course.id}>
									{course.title}
								</option>
							))}
						</select>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
					>
						{loading ? "Processing..." : "Allot Course"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default FreeCourseAllotment;
