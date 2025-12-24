"use client";
import { usePathname } from "next/navigation";
import NavItems from "./NavItems";
import NavbarLogo from "./NavbarLogo";
import NavbarRight from "./NavbarRight";
import NavItems2 from "./NavItems2";
import useIsTrue from "@/hooks/useIsTrue";
import NavbarTop from "./NavbarTop";
import CurrencySelector from "@/components/shared/CurrencySelector";
import { useSearch } from "@/contexts/SearchContext";
import DropdownCart from "./DropdownCart";
import DropdownUser from "@/components/shared/user/DropdownUser";
import { useSession } from "next-auth/react";
import Link from "next/link";
import MobileMenuOpen from "@/components/shared/buttons/MobileMenuOpen";

const Navbar = () => {
  const isHome1 = useIsTrue("/");
  const isHome1Dark = useIsTrue("/home-1-dark");
  const isHome2 = useIsTrue("/home-2");
  const isHome2Dark = useIsTrue("/home-2-dark");
  const isHome4 = useIsTrue("/home-4");
  const isHome4Dark = useIsTrue("/home-4-dark");
  const isHome5 = useIsTrue("/home-5");
  const isHome5Dark = useIsTrue("/home-5-dark");
  const { isDrawerOpen } = useSearch();
  const { data: session } = useSession();

  return (
    <div
      className={`transition-all duration-500 sticky-header z-medium dark:bg-whiteColor-dark ${
        isHome2 || isHome2Dark
          ? "lg:border-b border-borderColor dark:border-borderColor-dark"
          : ""
      }`}
    >
      <nav>
        <div
          className={`py-15px lg:py-0 px-15px ${
            isHome1 ||
            isHome1Dark ||
            isHome4 ||
            isHome4Dark ||
            isHome5 ||
            isHome5Dark
              ? "lg:container 3xl:container2-lg"
              : isHome2 || isHome2Dark
              ? "container sm:container-fluid lg:container 3xl:container-secondary "
              : "lg:container 3xl:container-secondary-lg "
          } 4xl:container mx-auto relative`}
        >
          {isHome4 || isHome4Dark || isHome5 || isHome5Dark ? (
            <NavbarTop />
          ) : (
            ""
          )}
          <div className="flex flex-col lg:grid lg:grid-cols-12 items-center gap-15px w-full">
            {/* First row on mobile: Logo + Cart + Profile/Get Started + Mobile Menu */}
            <div className="flex lg:contents items-center justify-between w-full">
              {/* navbar left */}
              <NavbarLogo />
              
              {/* Cart, Profile, Get Started, Mobile Menu on mobile - first row */}
              <div className="flex lg:hidden items-center gap-2">
                <ul className="relative nav-list flex justify-end items-center">
                  {!isHome2Dark && (
                    <li className="px-2 group">
                      <DropdownCart />
                    </li>
                  )}
                  {!isHome2Dark && session ? (
                    <li className="px-2 group">
                      <DropdownUser />
                    </li>
                  ) : null}
                  {!session && (
                    <li>
                      <Link
                        href="/login"
                        className="text-xs text-whiteColor bg-primaryColor block border-primaryColor border hover:text-primaryColor hover:bg-white px-3 py-2 rounded-standard dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor whitespace-nowrap"
                      >
                        Get Started
                      </Link>
                    </li>
                  )}
                  <li className="ml-2">
                    <MobileMenuOpen />
                  </li>
                </ul>
              </div>
            </div>

            {/* Second row on mobile: Search + Currency */}
            <div className="flex lg:hidden w-full justify-end">
              <ul className="relative nav-list flex justify-end items-center">
                <li
                  className="px-2 text-gray-500 flex items-center hover:text-gray-600 hover:cursor-pointer"
                  onClick={() => document.getElementById('search-toggle')?.click()}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </li>
                <li className="px-2">
                  <CurrencySelector />
                </li>
              </ul>
            </div>

            {/* Main menu - desktop only */}
            <div className="hidden lg:block lg:col-start-3 lg:col-span-7">
              {isHome2Dark ? <NavItems2 /> : <NavItems />}
            </div>

            {/* navbar right - desktop only */}
            <div className="hidden lg:block lg:col-start-10 lg:col-span-3">
              <NavbarRight isHome2Dark={isHome2Dark} />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
