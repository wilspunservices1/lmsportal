import LoginMain from "@/components/layout/main/LoginMain";

import PageWrapper from "@/components/shared/wrappers/PageWrapper";

export const metadata = {
  title: "Login/Register - Dark | Meridian LMS - Education LMS Template",
  description: "Login/Register - Dark | Meridian LMS - Education LMS Template",
};
const Login_Dark = () => {
  return (
    <PageWrapper>
      <main className="is-dark">
        <LoginMain />
      </main>
    </PageWrapper>
  );
};

export default Login_Dark;
