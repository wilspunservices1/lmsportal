import InstructorDetailsMain from "@/components/layout/main/InstructorDetailsMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import instructors from "@/../public/fakedata/instructors.json";
import { notFound } from "next/navigation";
export const metadata = {
  title: "Instructor Details - Dark | Meridian LMS - Education LMS Template",
  description:
    "Instructor Details - Dark | Meridian LMS - Education LMS Template",
};
const Instructor_Details_Dark = ({ params }) => {
  const { id } = params;
  const isExistinstructor = instructors?.find(
    ({ id: id1 }) => id1 === parseInt(id)
  );
  if (!isExistinstructor) {
    notFound();
  }
  return (
    <PageWrapper>
      <main className="is-dark">
        <InstructorDetailsMain />
      </main>
    </PageWrapper>
  );
};
export async function generateStaticParams() {
  return instructors?.map(({ id }) => ({ id: id.toString() }));
}
export default Instructor_Details_Dark;
