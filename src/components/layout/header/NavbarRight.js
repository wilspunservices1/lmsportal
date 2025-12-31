"use client";
import React from "react";
import DropdownCart from "./DropdownCart";
import Link from "next/link";
import MobileMenuOpen from "@/components/shared/buttons/MobileMenuOpen";
import useIsTrue from "@/hooks/useIsTrue";
import DropdownUser from "@/components/shared/user/DropdownUser";
import { useSession } from "next-auth/react";
import SearchField from "./_comp/SearchField";
import { useSearch } from "@/contexts/SearchContext";
import SearchIcon from "./_comp/SearchIcon";
import CurrencySelector from "@/components/shared/CurrencySelector";

const NavbarRight = () => {
  const isHome4 = useIsTrue("/home-4");
  const isHome4Dark = useIsTrue("/home-4-dark");
  const isHome5 = useIsTrue("/home-5");
  const isHome5Dark = useIsTrue("/home-5-dark");
  const isHome2Dark = useIsTrue("/home-2-dark");

  const { data: session } = useSession();
  const { toggleDrawer, isDrawerOpen } = useSearch(); // Access both toggleDrawer and isDrawerOpen from context

  return (
    <div className="w-full lg:col-start-10 lg:col-span-3 flex-shrink-0">
      <ul className="relative nav-list flex justify-end items-center">
        {/* Search Icon - desktop only */}
        <button id="search-toggle" className="hidden" onClick={toggleDrawer}></button>
        {!isDrawerOpen && (
          <li
            className="flex px-2 text-gray-500 items-center hover:text-gray-600 hover:cursor-pointer lg:px-2 lg:py-4 group"
            onClick={toggleDrawer}
          >
            <SearchIcon />
          </li>
        )}

        {/* Render the search field inline - all screens */}
        {isDrawerOpen && (
          <li className="block px-2">
            <SearchField />
          </li>
        )}

        {/* Currency Selector - desktop only */}
        <li className="hidden lg:block px-2 lg:px-2 lg:py-4">
          <CurrencySelector />
        </li>

        {/* Dropdown for cart */}
        {!isHome2Dark && (
          <li className="px-2 lg:px-2 lg:py-4 group">
            <DropdownCart />
          </li>
        )}

        {/* Dropdown for user */}
        {!isHome2Dark && session ? (
          <li className="px-2 lg:px-2 lg:py-4 group">
            <DropdownUser />
          </li>
        ) : null}

        {/* Login button if no session */}
        {!session && (
          <li className="lg:ml-2">
            <Link
              href="/login"
              className="text-xs text-whiteColor bg-primaryColor block border-primaryColor border hover:text-primaryColor hover:bg-white px-3 py-2 rounded-standard dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor whitespace-nowrap"
            >
              {isHome2Dark
                ? "Get Started Free"
                : isHome4 || isHome4Dark || isHome5 || isHome5Dark
                  ? "Get Start Here"
                  : "Get Started"}
            </Link>
          </li>
        )}

        {/* Mobile menu button */}
        <li className="block lg:hidden ml-2">
          <MobileMenuOpen />
        </li>
      </ul>
    </div>
  );
};

export default NavbarRight;







// "use client";
// import React from "react";
// import DropdownCart from "./DropdownCart";
// import Link from "next/link";
// import MobileMenuOpen from "@/components/shared/buttons/MobileMenuOpen";
// import useIsTrue from "@/hooks/useIsTrue";
// import LoginButton from "./LoginButton";
// import DropdownUser from "@/components/shared/user/DropdownUser";
// import { useSession } from "next-auth/react";
// import SearchDropdown from "./_comp/SearchDropDown";
// import SearchIcon from "./_comp/SearchIcon";


// const NavbarRight = () => {

//   const isHome4 = useIsTrue("/home-4");
//   const isHome4Dark = useIsTrue("/home-4-dark");
//   const isHome5 = useIsTrue("/home-5");
//   const isHome5Dark = useIsTrue("/home-5-dark");
//   const isHome2Dark = useIsTrue("/home-2-dark");

//   const { data: session } = useSession();

//   return (
//     <div className="lg:col-start-10 lg:col-span-3">
//       <ul className="relative nav-list flex justify-end items-center">

//         {/* Search Bar to searh items */}
//         <li className="px-5 text-gray-500 hover:text-gray-600 hover:cursor-pointer lg:px-10px 2xl:px-5 lg:py-4 2xl:py-26px 3xl:py-9 group">
//           <SearchIcon />
//         </li>

//         {/* dropdown menu */}
//         {!isHome2Dark && (
//           <li className="px-5 lg:px-10px 2xl:px-5 lg:py-4 2xl:py-26px 3xl:py-9 group">
//             <DropdownCart />
//           </li>
//         )}
//         {!isHome2Dark && session ? (
//           <li className="px-5 lg:px-10px 2xl:px-5 lg:py-4 2xl:py-26px 3xl:py-9 group">
//             <DropdownUser />
//           </li>
//         ) : (
//           ""
//         )}



//         {!session && (
//           <li className="hidden lg:block">
//             <Link
//               href="/login"
//               className="text-size-12 2xl:text-size-15 text-whiteColor bg-primaryColor block border-primaryColor border hover:text-primaryColor hover:bg-white px-15px py-2 rounded-standard dark:hover:bg-whiteColor-dark dark: dark:hover:text-whiteColor"
//             >
//               {isHome2Dark
//                 ? "Get Started Free"
//                 : isHome4 || isHome4Dark || isHome5 || isHome5Dark
//                   ? "Get Start Here"
//                   : "Get Started"}
//             </Link>
//           </li>
//         )}
//         <li className="block lg:hidden">
//           <MobileMenuOpen />
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default NavbarRight;
