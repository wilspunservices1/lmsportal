import BlogsMain from "@/components/layout/main/BlogsMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import React from "react";
export const metadata = {
  title: "Blog - Dark | Meridian LMS - Education LMS Template",
  description: "Blog - Dark | Meridian LMS - Education LMS Template",
};
const Blog_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <BlogsMain />
      </main>
    </PageWrapper>
  );
};

export default Blog_Dark;
