import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import FreeCourseAllotment from "@/components/sections/sub-section/dashboards/FreeCourseAllotment";

export default function FreeCourseAllotmentPage() {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <FreeCourseAllotment />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
}
