import ContactMain from "@/components/layout/main/ContactMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Contact Dark | Meridian LMS - Education LMS Template",
  description: "Contact Dark | Meridian LMS - Education LMS Template",
};

const Contact_Dark = async () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <ContactMain />
      </main>
    </PageWrapper>
  );
};

export default Contact_Dark;
