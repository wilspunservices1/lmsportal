import FilterController from "@/components/shared/courses/FilterController";
import HeadingPrimary from "@/components/shared/headings/HeadingPrimary";
import SectionName from "@/components/shared/section-names/SectionName";
import FilterControllerWrapper from "@/components/shared/wrappers/FilterControllerWrapper";
import FilterCards from "@/components/shared/courses/FilterCards";
import HeadingPrimaryXl from "@/components/shared/headings/HeadingPrimaryXl ";
const CoursesFilter = () => {
  return (
    <section>
      <div className="pt-50px pb-10 md:pt-70px md:pb-50px lg:pt-20 2xl:pt-100px 2xl:pb-70px bg-whiteColor dark:bg-whiteColor-dark overflow-hidden">
        <div className="filter-container container">
          <div className="flex gap-15px lg:gap-30px flex-wrap lg:flex-nowrap items-center ">
            {/* courses Left */}
            <div className="basis-full lg:basis-[500px]" data-aos="fade-up">
              <HeadingPrimaryXl>
                Our  Courses
              </HeadingPrimaryXl>
              <div>
                <p>Flexible Learning, Courses made by Experts, and <br></br>Career-Defining Growth.</p>
              </div>
            </div>
            {/* courses right */}
            <FilterControllerWrapper>
              <FilterController />
            </FilterControllerWrapper>
          </div>

          {/* course cards */}
          <FilterCards />
        </div>
      </div>
    </section>
  );
};

export default CoursesFilter;
