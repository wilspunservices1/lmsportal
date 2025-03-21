import Home6 from "@/components/layout/main/Home6";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Home-6 Marketplace - Dark | Meridian LMS - Education LMS Template",
  description:
    "Home-6 Marketplace - Dark | Meridian LMS - Education LMS Template",
};
const Home_6_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <Home6 />
      </main>
    </PageWrapper>
  );
};

export default Home_6_Dark;
