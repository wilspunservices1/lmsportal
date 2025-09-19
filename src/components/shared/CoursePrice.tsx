'use client';
import React from 'react';
import PriceDisplay from './PriceDisplay';

interface CoursePriceProps {
  price: number;
  originalPrice?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CoursePrice: React.FC<CoursePriceProps> = ({ 
  price, 
  originalPrice, 
  className = '',
  size = 'md'
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <PriceDisplay 
        usdPrice={price} 
        size={size}
        className="text-primaryColor font-bold"
      />
      {originalPrice && originalPrice > price && (
        <PriceDisplay 
          usdPrice={originalPrice} 
          size="sm"
          className="text-gray-500 line-through"
          showCurrencyCode={false}
        />
      )}
    </div>
  );
};

export default CoursePrice;