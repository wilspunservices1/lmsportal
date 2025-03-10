import FeatureCourses from "@/components/sections/featured-courses/FeatureCourses";
import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import Testimonials from "@/components/sections/testimonials/Testimonials";
import AboutMeridian from "@/components/shared/about-meridian/AboutMeridian";

const AboutMain = () => {
  return (
    <>
      <HeroPrimary title="About Page" path={"About Page"} />
      {/* <About11 /> */}
      {/* <Overview /> */}
      <AboutMeridian/>
      <FeatureCourses
      
        // title={
        //   <>
        //     Choose The Best Package <br />
        //     For your Learning
        //   </>
        // }
        // course="2"
        // subTitle="Popular Courses"
      />
      <Testimonials />
      {/* <Brands /> */}
    </>
  );
};

export default AboutMain;
