"use client";
import MobileMenuItems from "./MobileItems";
import MobileItems2 from "./MobileItems2";
import MobileMenuSearch from "./MobileMenuSearch";
import MobileMyAccount from "./MobileMyAccount";
import MobileSocial from "./MobileSocial";
import MobileMenuClose from "@/components/shared/buttons/MobileMenuClose";
import useIsTrue from "@/hooks/useIsTrue";
import CurrencySelector from "@/components/shared/CurrencySelector";

const MobileMenu = () => {
  const isHome2Dart = useIsTrue("/home-2-dark");
  return (
    <div className="mobile-menu w-mobile-menu-sm md:w-mobile-menu-lg fixed top-0 -right-[280px] md:-right-[330px] transition-all duration-500 w-mobile-menu h-full shadow-dropdown-secodary bg-whiteColor dark:bg-whiteColor-dark z-high block lg:hidden">
      <MobileMenuClose />

      {/*  mobile menu wrapper */}
      <div className="px-5 md:px-30px pt-5 md:pt-10 pb-50px h-full overflow-y-auto">
        <MobileMenuSearch />
        
        {/* Currency Selector */}
        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
          <p className="text-sm font-semibold mb-2 text-blackColor dark:text-blackColor-dark">Currency</p>
          <CurrencySelector />
        </div>
        
        {/*  mobile menu accordions */}
        {isHome2Dart ? <MobileItems2 /> : <MobileMenuItems />}
        {/*  my account accordion */}
        {/* <MobileMyAccount /> */}
        {/*  Mobile menu social area */}

        <MobileSocial />
      </div>
    </div>
  );
};

export default MobileMenu;
