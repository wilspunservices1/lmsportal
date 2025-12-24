import Image from "next/image";
import React from "react";
import logo1 from "@/assets/images/logo/favicon.png";
import Link from "next/link";
const NavbarLogo = () => {
  return (
    <div className="lg:col-start-1 lg:col-span-2 flex-shrink-0">
      <Link href="/" className="flex items-center justify-center w-full py-2">
        <Image
          priority="false"
          src={logo1}
          width={180}
          alt="MeridianLMS Logo"
          className="mr-2"
        />
        {/* <div className="flex  items-start text-left">
          <span className="font-bold text-2xl text-[#0A616F]">Meridian</span>
          <span className="font-bold text-2xl pl-2 text-[#EB911E]">LMS</span>
        </div> */}
      </Link>
    </div>
  );
};

export default NavbarLogo;
