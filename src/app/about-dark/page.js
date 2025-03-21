import AboutMain from "@/components/layout/main/AboutMain";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
export const metadata = {
  title: "About - Dark | Meridian LMS - Education LMS Template",
  description: "About - Dark | Meridian LMS - Education LMS Template",
};
const About_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <AboutMain />
      </main>
    </PageWrapper>
  );
};

export default About_Dark;
