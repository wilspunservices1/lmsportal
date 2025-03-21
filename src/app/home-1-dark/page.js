import Home1 from "@/components/layout/main/Home1";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
export const metadata = {
  title: "Home 1 Dark | Meridian LMS - Education LMS Template",
};
const Home1Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <Home1 />
      </main>
    </PageWrapper>
  );
};

export default Home1Dark;
