import ZoomMeetingsMain from "@/components/layout/main/ZoomMeetingsMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Zoom Meetings | Meridian LMS - Education LMS Template",
  description: "Zoom Meetings | Meridian LMS - Education LMS Template",
};
const Zoom_Meetings = () => {
  return (
    <PageWrapper>
      <main>
        <ZoomMeetingsMain />
      </main>
    </PageWrapper>
  );
};

export default Zoom_Meetings;
