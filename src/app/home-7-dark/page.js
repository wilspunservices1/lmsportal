import Home7 from "@/components/layout/main/Home7";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Home-7 University - Dark | Meridian LMS - Education LMS Template",
  description:
    "Home-7 University - Dark | Meridian LMS - Education LMS Template",
};
const Home_7_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <Home7 />
      </main>
    </PageWrapper>
  );
};

export default Home_7_Dark;
