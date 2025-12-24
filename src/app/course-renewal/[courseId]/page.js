"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CourseRenewal({ params }) {
	const { courseId } = params;
	const { data: session } = useSession();
	const router = useRouter();
	const [course, setCourse] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCourse = async () => {
			const res = await fetch(`/api/courses/${courseId}`);
			const data = await res.json();
			setCourse(data.data);
			setLoading(false);
		};
		fetchCourse();
	}, [courseId]);

	const handleRenewal = async () => {
		const renewalPrice = (parseFloat(course.price) * 0.25).toFixed(2);
		
		const response = await fetch("/api/paymob/checkout", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				items: [{
					courseId,
					name: `${course.title} - Renewal (30 days)`,
					price: renewalPrice,
					quantity: 1,
					image: course.thumbnail,
					isRenewal: true,
				}],
				userId: session?.user?.id,
				email: session?.user?.email,
				phone: session?.user?.phone || '+966500000000',
			}),
		});

		const data = await response.json();
		if (data.iframeUrl) {
			window.location.href = data.iframeUrl;
		}
	};

	if (loading) return <div className="container py-20">Loading...</div>;

	const renewalPrice = (parseFloat(course.price) * 0.25).toFixed(2);

	return (
		<div className="container py-20">
			<div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
				<h1 className="text-3xl font-bold mb-4">Renew Course Access</h1>
				<h2 className="text-xl text-gray-700 dark:text-gray-300 mb-6">{course.title}</h2>
				
				<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
					<h3 className="font-semibold mb-3">Renewal Details:</h3>
					<ul className="space-y-2 text-sm">
						<li>✅ 30 days additional access</li>
						<li>✅ Continue from where you left off</li>
						<li>✅ Access all course materials</li>
						<li>✅ Special renewal price: ${renewalPrice} (25% of original)</li>
					</ul>
				</div>

				<div className="flex gap-4">
					<button
						onClick={handleRenewal}
						className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
					>
						Renew for ${renewalPrice}
					</button>
					<button
						onClick={() => router.back()}
						className="px-6 py-3 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
