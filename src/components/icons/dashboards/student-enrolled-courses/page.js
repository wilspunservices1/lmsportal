import AdminDashboardMain from "@/components/layout/main/dashboards/AdminDashboardMain";
import StudentEnrolledCoursesMain from "@/components/layout/main/dashboards/StudentEnrolledCoursesMain";
import DashboardContainer from "@/components/shared/containers/DashboardContainer";

import DsahboardWrapper from "@/components/shared/wrappers/DsahboardWrapper";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
export const metadata = {
  title: "Student Enrolled Courses | Meridian LMS - Education LMS Template",
  description:
    "Student Enrolled Courses | Meridian LMS - Education LMS Template",
};
const Student_Enrolled_Courses = () => {
  return (
    <PageWrapper>
      <main>
        <DsahboardWrapper>
          <DashboardContainer>
            <StudentEnrolledCoursesMain />
          </DashboardContainer>
        </DsahboardWrapper>
      </main>
    </PageWrapper>
  );
};

export default Student_Enrolled_Courses;
