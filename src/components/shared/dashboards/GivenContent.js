"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const GivenContent = () => {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch(`/api/user/${session.user.id}/given-reviews`);
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
            <th className="px-5px py-10px md:px-5">Course Title</th>
            <th className="px-5px py-10px md:px-5">Review</th>
            <th className="px-5px py-10px md:px-5"></th>
          </tr>
        </thead>
        <tbody className="text-size-13 md:text-base text-contentColor dark:text-contentColor-dark font-normal">
          {reviews.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-5 py-10 text-center text-gray-500">
                No reviews given yet.
              </td>
            </tr>
          ) : (
            reviews.map((review, index) => (
              <tr 
                key={review.id} 
                className={`leading-1.8 md:leading-1.8 ${index % 2 === 1 ? 'bg-lightGrey5 dark:bg-whiteColor-dark' : ''}`}
              >
                <th className="px-5px py-10px md:px-5 font-normal">
                  <p className="text-blackColor dark:text-blackColor-dark">
                    Course: {review.courseTitle || 'N/A'}
                  </p>
                </th>
                <td className="px-5px py-10px md:px-5">
                  <div className="text-primaryColor">
                    {renderStars(review.rating)}
                    <span className="md:text-sm text-blackColor dark:text-blackColor-dark font-bold ml-2">
                      ({review.rating} Stars)
                    </span>
                  </div>
                  <p>{review.comment || '-'}</p>
                </td>
                <td className="px-5px py-10px md:px-5">
                  <div className="flex">
                    <button className="flex items-center gap-1 md:text-sm font-bold text-blackColor dark:text-blackColor-dark hover:text-primaryColor dark:hover:text-primaryColor px-10px leading-1.8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GivenContent;
