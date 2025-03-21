import InstructorWishlistMain from "@/components/layout/main/dashboards/InstructorWishlistMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Instructor Wishlist | Meridian LMS - Education LMS Template",
  description: "Instructor Wishlist | Meridian LMS - Education LMS Template",
};
const Instructor_Wishlist = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <InstructorWishlistMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Instructor_Wishlist;
