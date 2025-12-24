import Highlights from "@/components/sections/sub-section/dashboards/Highlights";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export default function StudentHighlightsPage() {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <Highlights />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
}
