import Home2 from "@/components/layout/main/Home2";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Home 2 | Meridian LMS - Education LMS Template",
  description: "Home 2 | Meridian LMS - Education LMS Template",
};

const Home_2 = async () => {
  return (
    <PageWrapper>
      <main>
        <Home2 />
      </main>
    </PageWrapper>
  );
};

export default Home_2;
