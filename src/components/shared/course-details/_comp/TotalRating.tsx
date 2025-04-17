import React from "react";

const TotalRating = ({ reviews, averageRating, ratingDistribution }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-x-30px gap-y-5">
      {/* Average Rating Box */}
      <div className="lg:col-start-1 lg:col-span-4 px-10px py-30px bg-whiteColor dark:bg-whiteColor-dark shadow-review text-center">
        <p className="text-7xl font-extrabold text-blackColor dark:text-blackColor-dark leading-90px">
          {averageRating.toFixed(1)}
        </p>
        <div className="text-secondaryColor">
          {[5, 4, 3, 2, 1].map((star) => (
            <i
              key={star}
              className={`icofont-star ${
                star <= Math.round(averageRating) ? "text-primaryColor" : ""
              }`}
            ></i>
          ))}
        </div>
        <p className="text-blackColor dark:text-blackColor-dark leading-26px font-medium">
          ({reviews.length} Reviews)
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="lg:col-start-5 lg:col-span-8 px-15px">
        <ul className="flex flex-col gap-y-3">
          {[...ratingDistribution]
            .sort((a, b) => b.star - a.star)
            .map(({ star, count }) => (
              <li
                key={star}
                className="flex items-center text-blackColor dark:text-blackColor-dark"
              >
                <div>
                  <span>{star}</span>{" "}
                  <span>
                    <i className="icofont-star text-secondaryColor"></i>
                  </span>
                </div>
                <div className="flex-grow relative mx-10px md:mr-10 lg:mr-10px">
                  <span className="h-10px w-full bg-borderColor dark:bg-borderColor-dark rounded-full block"></span>
                  <span
                    className="absolute left-0 top-0 h-10px bg-secondaryColor rounded-full"
                    style={{ width: `${(count / reviews.length) * 100}%` }}
                  ></span>
                </div>
                <div>
                  <span>{count}</span>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default TotalRating;