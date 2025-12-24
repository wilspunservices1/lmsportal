"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const TestimonialsSlider = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/google-reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
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

  if (loading) return <div className="text-center py-10">Loading reviews...</div>;
  if (reviews.length === 0) return <div className="text-center py-10">No reviews available</div>;

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