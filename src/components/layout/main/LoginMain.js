import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import LoginTab from "@/components/sections/login/LoginTab";

const LoginMain = () => {
  return (
    <>
      <HeroPrimary path={"Log In"} title={"Get Started"} />
      <LoginTab />
    </>
  );
};

export default LoginMain;
