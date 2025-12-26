"use client";

import { useEffect, useState } from "react";

const AdminHighlights = () => {
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await fetch("/api/courses?includeAllStatuses=true");
				const data = await response.json();
				
				if (response.ok) {
					setCourses(data.data || []);
				}
			} catch (error) {
				console.error("Error fetching courses:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCourses();
	}, []);

	const calculateExpiryDate = (createdDate, accessDurationMonths) => {
		if (!accessDurationMonths) return null;
		const date = new Date(createdDate);
		date.setMonth(date.getMonth() + parseInt(accessDurationMonths));
		return date;
	};

	if (loading) return <div>Loading courses...</div>;
	if (courses.length === 0) return <div>No courses found</div>;

	return (
		<div className="container mb-10">
			<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-l-4 border-blue-500">
				<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
					📚 All Courses Overview
				</h2>
				<div className="space-y-3">
					{courses.map((course) => {
						const createdDate = new Date(course.createdAt);
						const expiryDate = calculateExpiryDate(course.createdAt, course.accessDurationMonths);

						return (
							<div
								key={course.id}
								className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200"
							>
								<div className="flex justify-between items-start">
									<div className="flex-1">
										<h3 className="font-semibold text-gray-800 dark:text-gray-200">
											{course.title}
										</h3>
										<div className="mt-2 space-y-1">
											<p className="text-sm text-gray-600 dark:text-gray-400">
												<span className="font-medium">Created:</span> {createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
											</p>
											{expiryDate && (
												<p className="text-sm text-gray-600 dark:text-gray-400">
													<span className="font-medium">Expiry:</span> {expiryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
												</p>
											)}
											<p className="text-sm text-gray-600 dark:text-gray-400">
												<span className="font-medium">Access Duration:</span> {course.accessDurationMonths || 'N/A'} months
											</p>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												<span className="font-medium">Price:</span> ${course.price || 0}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-sm font-medium text-gray-600">
											Status: <span className={course.status === 'published' ? 'text-green-600' : 'text-yellow-600'}>{course.status}</span>
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default AdminHighlights;
