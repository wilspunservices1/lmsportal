import EventDetailsMain from "@/components/layout/main/EventDetailsMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import events from "@/../public/fakedata/events.json";
import { notFound } from "next/navigation";
export const metadata = {
  title: "Event Details | Meridian LMS - Education LMS Template",
  description: "Event Details | Meridian LMS - Education LMS Template",
};

const Event_details = async ({ params }) => {
  const { id } = params;
  const isExistEvent = events?.find(({ id: id1 }) => id1 === parseInt(id));
  if (!isExistEvent) {
    notFound();
  }
  return (
    <PageWrapper>
      <main>
        <EventDetailsMain />
      </main>
    </PageWrapper>
  );
};
export async function generateStaticParams() {
  return events?.map(({ id }) => ({ id: id.toString() }));
}
export default Event_details;
