"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const ReceivedContent = () => {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch(`/api/user/${session.user.id}/received-reviews`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [session]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={i < rating ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-star w-4 inline-block"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ));
  };

  if (loading) {
    return <div className="text-center py-10">Loading reviews...</div>;
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-left">
        <thead className="text-sm md:text-base text-blackColor dark:text-blackColor-dark bg-lightGrey5 dark:bg-whiteColor-dark leading-1.8 md:leading-1.8">
          <tr>
            <th className="px-5px py-10px md:px-5">Student</th>
            <th className="px-5px py-10px md:px-5">Date</th>
            <th className="px-5px py-10px md:px-5">Feedback</th>
          </tr>
        </thead>
        <tbody className="text-size-13 md:text-base text-contentColor dark:text-contentColor-dark font-normal">
          {reviews.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-5 py-10 text-center text-gray-500">
                No reviews received yet.
              </td>
            </tr>
          ) : (
            reviews.map((review, index) => (
              <tr 
                key={review.id} 
                className={`leading-1.8 md:leading-1.8 ${index % 2 === 1 ? 'bg-lightGrey5 dark:bg-whiteColor-dark' : ''}`}
              >
                <th className="px-5px py-10px md:px-5 font-normal">
                  <p className="text-blackColor dark:text-blackColor-dark text-nowrap">
                    {review.name || review.username || 'Anonymous'}
                  </p>
                </th>
                <td className="px-5px py-10px md:px-5 text-nowrap">
                  <p>{formatDate(review.created_at)}</p>
                </td>
                <td className="px-5px py-10px md:px-5">
                  <p className="md:text-size-15 text-blackColor dark:text-blackColor-dark font-bold">
                    Course: {review.courseTitle || 'N/A'}
                  </p>
                  <div className="text-primaryColor">
                    {renderStars(review.rating)}
                    <span className="md:text-sm text-blackColor dark:text-blackColor-dark font-bold ml-2">
                      ({review.rating} Stars)
                    </span>
                  </div>
                  <p>{review.comment || '-'}</p>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReceivedContent;
