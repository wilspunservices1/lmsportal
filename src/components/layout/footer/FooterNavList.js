import React from "react";
import FooterNavItems from "./FooterNavItems";
import FooterAbout from "./FooterAbout";
import FooterRecentPosts from "./FooterRecentPosts";

const FooterNavList = () => {
  const lists = [
    {
      heading: "Useful Links",
      items: [
        {
          name: "Complaint Policy",
          path: "/complaint-policy",
        },
        {
          name: "Refund Policy",
          path: "/refund-policy",
        },
        {
          name: "Privacy Policy",
          path: "/privacy-policy",
        },
        {
          name: "Contact Us",
          path: "/contact-us-form",
        },
        {
          name: "About Us",
          path: "/about",
        },
      ],
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-12 md:grid-cols-2 lg:grid-cols-12 gap-30px md:gap-y-5 lg:gap-y-0 pt-60px pb-50px md:pt-30px md:pb-30px lg:pt-110px lg:pb-20">
        {/* left */}
        <FooterAbout />

        {/* nav area */}
        {lists.map((list, idx) => (
          <FooterNavItems key={idx} list={list} idx={idx} />
        ))}

        {/* right */}
        <FooterRecentPosts />
      </div>
    </section>
  );
};

export default FooterNavList;
