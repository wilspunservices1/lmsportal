import TestimonialsSlider2 from "@/components/shared/testimonials/TestimonialsSlider2";
import SectionNameSecondary from "@/components/shared/section-names/SectionNameSecondary";
import HeadingPrimaryXl from "@/components/shared/headings/HeadingPrimaryXl ";

const Testimonials2 = () => {
  return (
    <section>
      <div className="testimonial bg-lightGrey10 dark:bg-lightGrey10-dark relative z-0 overflow-hidden">
        <div className="container py-50px md:py-70px lg:py-20 2xl:pt-145px 2xl:pb-154px">
          <div className="w-full">
            {/* testimonial content */}
            <div data-aos="fade-up">
              <SectionNameSecondary>Reviews</SectionNameSecondary>
              <HeadingPrimaryXl>
              What Our Clients Say
              </HeadingPrimaryXl>

              {/* Swiper */}
              <TestimonialsSlider2 />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials2;
