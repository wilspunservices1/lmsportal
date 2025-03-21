import EditCourseMain from "@/components/layout/main/EditCourseMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Edit Course | Meridian LMS - Education LMS Template",
  description: "Edit Course | Meridian LMS - Education LMS Template",
};
const Edit_Course = ({ params }) => {
  return (
    <PageWrapper>
      <main>
        <EditCourseMain />
      </main>
    </PageWrapper>
  );
};

export default Edit_Course;
