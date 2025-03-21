import Home3 from "@/components/layout/main/Home3";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Home-3 Dark | Meridian LMS - Education LMS Template",
  description: "Home-3 Dark | Meridian LMS - Education LMS Template",
};
const Home_2_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <Home3 />
      </main>
    </PageWrapper>
  );
};

export default Home_2_Dark;
