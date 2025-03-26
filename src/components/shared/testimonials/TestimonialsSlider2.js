"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { useCallback } from "react";

// Import your Google review images
const reviewImages = [
  { src: require("@/assets/images/testimonial/review1.png"), alt: "Google review 1" },
  { src: require("@/assets/images/testimonial/review2.png"), alt: "Google review 2" },
  { src: require("@/assets/images/testimonial/review3.png"), alt: "Google review 3" },
  { src: require("@/assets/images/testimonial/review4.png"), alt: "Google review 4" },
  { src: require("@/assets/images/testimonial/review5.png"), alt: "Google review 5" },
  { src: require("@/assets/images/testimonial/review6.png"), alt: "Google review 6" },
  { src: require("@/assets/images/testimonial/review7.png"), alt: "Google review 7" },
  { src: require("@/assets/images/testimonial/review8.png"), alt: "Google review 8" },
  { src: require("@/assets/images/testimonial/review9.png"), alt: "Google review 9" },
  { src: require("@/assets/images/testimonial/review10.png"), alt: "Google review 10" },
  { src: require("@/assets/images/testimonial/review11.png"), alt: "Google review 11" },
  { src: require("@/assets/images/testimonial/review12.png"), alt: "Google review 12" },
  { src: require("@/assets/images/testimonial/review13.png"), alt: "Google review 13" }
];

const TestimonialsSlider = () => {
  // Style objects
  const containerStyle = {
    position: 'relative',
    paddingBottom: '60px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const swiperSlideStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    padding: '0 20px',
    overflow: 'hidden'
  };

  const imageContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center'
  };

  const imageStyle = {
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    objectFit: 'contain',
    width: '100%',
    height: '100%'
  };

  const navContainerStyle = {
    position: 'absolute',
    bottom: '10px',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    padding: '10px 0'
  };

  const navButtonStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s'
  };

  // Memoized event handlers
  const handleMouseEnter = useCallback((e) => {
    e.currentTarget.style.backgroundColor = '#d1d5db';
  }, []);

  const handleMouseLeave = useCallback((e) => {
    e.currentTarget.style.backgroundColor = '#e5e7eb';
  }, []);

  return (
    <div style={containerStyle}>
      <Swiper
        style={{
          padding: '20px 0',
          '--swiper-navigation-size': '20px',
          '--swiper-navigation-color': '#4b5563',
        }}
        slidesPerView={1}
        loop={true}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        modules={[Navigation]}
      >
        {reviewImages.map((review, index) => (
          <SwiperSlide key={index}>
            <div style={swiperSlideStyle}>
              <div style={imageContainerStyle}>
                <Image 
                  src={review.src} 
                  alt={review.alt}
                  fill
                  style={imageStyle}
                  placeholder="blur"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority={index < 3} // Prioritize loading first 3 images
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div style={navContainerStyle}>
        <button 
          className="custom-prev" 
          style={navButtonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="Previous testimonial"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563">
            <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button 
          className="custom-next" 
          style={navButtonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="Next testimonial"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563">
            <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TestimonialsSlider;