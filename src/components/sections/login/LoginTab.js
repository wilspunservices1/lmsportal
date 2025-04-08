"use client";
import TabButtonPrimary from "@/components/shared/buttons/TabButtonPrimary";
import LoginForm from "@/components/shared/login/LoginForm";
import SignUpForm from "@/components/shared/login/SignUpForm";
import TabContentWrapper from "@/components/shared/wrappers/TabContentWrapper";
import Image from "next/image";
import shapImage2 from "@/assets/images/education/hero_shape2.png";
import shapImage3 from "@/assets/images/education/hero_shape3.png";
import shapImage4 from "@/assets/images/education/hero_shape4.png";
import shapImage5 from "@/assets/images/education/hero_shape5.png";
import useTab from "@/hooks/useTab";

const LoginTab = () => {
  const { currentIdx, handleTabClick } = useTab();
  const tabButtons = [
    {
      name: "Login",
      content: <LoginForm switchToSignUp={() => handleTabClick(1)} />,
    },
    {
      name: "Sign up",
      content: <SignUpForm switchToLogin={() => handleTabClick(0)} />,
    },
  ];

  return (
    <section
      className="
        relative
        min-h-screen
        flex
        items-center
        justify-center
        w-full
      "
    >
      {/* Container with increased max-width */}
      <div className="relative max-w-[1300px] w-full mx-auto px-4 py-8 md:py-12">
        <div className="tab w-full">
          {/* Tab controller with reduced width and centered */}
          <div className="max-w-[900px] mx-auto grid grid-cols-2 gap-3 text-blackColor text-lg lg:text-size-22 font-semibold font-hind mb-8">
            {tabButtons.map(({ name }, idx) => (
              <TabButtonPrimary
                key={idx}
                idx={idx}
                handleTabClick={handleTabClick}
                currentIdx={currentIdx}
                button="lg"
                name={name}
              />
            ))}
          </div>

          {/* Tab contents with increased width */}
          <div
            className="
              shadow-container
              bg-whiteColor dark:bg-whiteColor-dark
              px-5 py-6 md:px-12 md:py-10
              rounded-5px
              max-w-[1400px]
              mx-auto
            "
          >
            {tabButtons.map(({ content }, idx) => (
              <TabContentWrapper key={idx} isShow={idx === currentIdx || false}>
                {content}
              </TabContentWrapper>
            ))}
          </div>
        </div>
      </div>

      {/* Adjusted positions for animated icons */}
      <Image
        loading="lazy"
        className="absolute right-[10%] top-[30%] animate-move-var"
        src={shapImage2}
        alt="Shape"
      />
      <Image
        loading="lazy"
        className="absolute left-[10%] top-1/2 animate-move-hor"
        src={shapImage3}
        alt="Shape"
      />
      <Image
        loading="lazy"
        className="absolute left-[45%] bottom-[10px] animate-spin-slow"
        src={shapImage4}
        alt="Shape"
      />
      <Image
        loading="lazy"
        className="absolute right-[45%] top-10 animate-spin-slow"
        src={shapImage5}
        alt="Shape"
      />
    </section>
  );
};

export default LoginTab;
