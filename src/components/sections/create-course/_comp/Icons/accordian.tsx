import React from 'react';

const ArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`transition-all duration-500 rotate-0 ${className}`}
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="#212529"
  >
    <path
      fillRule="evenodd"
      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
    ></path>
  </svg>
);

export default ArrowIcon;
