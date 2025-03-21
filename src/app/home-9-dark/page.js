import Home9 from "@/components/layout/main/Home9";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Home-9 Kindergarten - Dark | Meridian LMS - Education LMS Template",
  description:
    "Home-9 Kindergarten - Dark | Meridian LMS - Education LMS Template",
};
const Home_9_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <Home9 />
      </main>
    </PageWrapper>
  );
};

export default Home_9_Dark;
