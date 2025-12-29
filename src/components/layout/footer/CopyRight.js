import Image from "next/image";
import React from "react";
import logoImage from "@/assets/images/logo/favicon.png";
import useIsSecondary from "@/hooks/useIsSecondary";
import Link from "next/link";
const CopyRight = () => {
  const { isSecondary } = useIsSecondary();
  return (
    <div>
      {isSecondary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-10 lg:mt-4 items-center border-t border-darkcolor">
          <div>
            <p className="text-base text-center sm:text-start text-darkgray">
              © {new Date().getFullYear()} Powered by{" "}
              <a href="#" className="hover:text-primaryColor">
                MeridianLMS
              </a>{" "}
              . All Rights Reserved.
            </p>
          </div>

          <div>
            <ul className="flex items-center justify-center sm:justify-end">
              <li>
                <a
                  href="#"
                  className="text-base text-darkgray hover:text-primaryColor pr-4 border-r border-darkgray leading-1"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-darkgray hover:text-primaryColor pl-4"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-30px pt-10 items-center">
         
          <div className="lg:col-start-1 lg:col-span-3">
            <Link
              href="/"
              className="flex items-center justify-center w-full py-2"
            >
              <Image src={logoImage} alt="" placeholder="blur" />
            </Link>
          </div>

          <div className="lg:col-start-4 lg:col-span-6 pl-10">
            <p className="text-whiteColor">
              Copyright © {new Date().getFullYear()} by
              MeridianLMS. All Rights Reserved.
            </p>
          </div>

          <div className="lg:col-start-10 lg:col-span-3">
            <ul className="flex gap-3 lg:gap-2 2xl:gap-3 lg:justify-end">
              <li>
                <a
                  href="https://www.facebook.com/meqmp.net/"
                  className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-primaryColor text-center"
                >
                  <i className="icofont-facebook text-xl"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/meridian-quality-management/"
                  className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-primaryColor text-center"
                >
                  <i className="icofont-linkedin text-xl"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@MeridianQMP"
                  className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-primaryColor text-center"
                >
                  <i className="icofont-youtube text-xl"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/966509394640"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-40.19px lg:w-35px 2xl:w-40.19px h-37px lg:h-35px 2xl:h-37px leading-37px lg:leading-35px 2xl:leading-37px text-whiteColor bg-whiteColor bg-opacity-10 hover:bg-primaryColor text-center inline-flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyRight;
