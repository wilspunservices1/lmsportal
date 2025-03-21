import ErrorMain from "@/components/layout/main/ErrorMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Error | Meridian LMS - Education LMS Template",
  description: "Error | Meridian LMS - Education LMS Template",
};

const Error = async () => {
  return (
    <PageWrapper>
      <main>
        <ErrorMain />
      </main>
    </PageWrapper>
  );
};

export default Error;
