import AdminHighlights from "@/components/sections/sub-section/dashboards/AdminHighlights";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";
import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export default function AdminHighlightsPage() {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <AdminHighlights />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
}
