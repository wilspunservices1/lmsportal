import React from "react";
import AccordionHome from "./AccordionHome";
import AccordionContainer from "@/components/shared/containers/AccordionContainer";
import MobileMenuItem from "./MobileItem";
import AccordionPages from "./AccordionPages";
import AccordionCourses from "./AccordionCourses";
import AccordionDashboard from "./AccordionDashboard";
import AccordionEcommerce from "./AccordionEcommerce";
import Link from "next/link";

const MobileMenuItems = () => {
  const items = [
    {
      id: 1,
      name: "Home",
      path: "/",
      accordion: "accordion",
      children: <AccordionHome />,
    },
    {
      id: 3,
      name: "Courses",
      path: "/courses",
      // accordion: "accordion",
      // children: <AccordionCourses />,
    },
    {
      id: 2,
      name: "About",
      path: "/about",
      accordion: "accordion",
      children: <AccordionPages />,
    },
    {
      id: 4,
      name: "Privacy Policy",
      path: "/privacy-policy",
      // accordion: "accordion",
      // children: <AccordionPages />,
    },
    // {
    //   id: 4,
    //   name: "Dashboard",
    //   path: "/dashboards/instructor-dashboard",
    //   // accordion: "accordion",
    //   // children: <AccordionDashboard />,
    // },
    // {
    //   id: 5,
    //   name: "Ecommerce",
    //   path: "/ecommerce/shop",
    //   accordion: "accordion",
    //   children: <AccordionEcommerce />,
    // },
  ];

  return (
    <div className="pt-8 pb-6 border-b border-borderColor dark:border-borderColor-dark">
      <AccordionContainer>
        {items.map((item, idx) => (
          <MobileMenuItem key={idx} item={item} />
        ))}
      </AccordionContainer>
      
      {/* Add Get Started button for mobile */}
      <div className="mt-4 px-4">
        <Link
          href="/login"
          className="text-size-12 text-whiteColor bg-primaryColor block border-primaryColor border hover:text-primaryColor hover:bg-white px-4 py-2 rounded-standard dark:hover:bg-whiteColor-dark dark:hover:text-whiteColor text-center"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default MobileMenuItems;
