"use client";
import useIsTrue from "@/hooks/useIsTrue";
import React from "react";

const HeaderTop = () => {
  const isHome1 = useIsTrue("/");
  const isHome1Dark = useIsTrue("/home-1-dark");
  const isHome4 = useIsTrue("/home-4");
  const isHome4Dark = useIsTrue("/home-4-dark");
  const isHome5 = useIsTrue("/home-5");
  const isHome5Dark = useIsTrue("/home-5-dark");

  return (
    <div className="bg-blackColor2 dark:bg-lightGrey10-dark hidden lg:block">
      <div
        className={`${
          isHome1 ||
          isHome1Dark ||
          isHome4 ||
          isHome4Dark ||
          isHome5 ||
          isHome5Dark
            ? "lg:container 3xl:container2-lg"
            : "container 3xl:container-secondary-lg "
        } 4xl:container mx-auto text-whiteColor text-size-12 xl:text-sm py-5px xl:py-9px`}
      >
        <div className="flex justify-between items-center">
          <div>
            <p>Call Us: +971 58 267 6585 - Mail Us: wilspun_lms@mail.com</p>
          </div>
          <div className="flex gap-37px items-center">
            <div>
              <p>
                <i className="icofont-location-pin text-primaryColor text-size-15 mr-5px"></i>
                <span>Dammam Saudi Arabia Dubai United Arab Emirates Seef Bahrain</span>
              </p>
            </div>
            <div>
              {/* header social list  */}
              <ul className="flex gap-[18px] text-size-15">
                <li>
                  <a
                    className="hover:text-primaryColor"
                    href="https://www.facebook.com/meqmp.net/"
                  >
                    <i className="icofont-facebook"></i>
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primaryColor"
                    href="https://www.linkedin.com/company/meridian-quality-management/"
                  >
                    <i className="icofont-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primaryColor"
                    href="https://www.youtube.com/@MeridianQMP"
                  >
                    <i className="icofont-youtube-play"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
