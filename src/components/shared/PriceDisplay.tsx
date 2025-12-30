'use client';
import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertPrice, formatPrice, getCurrencySymbol } from '@/utils/currency';

interface PriceDisplayProps {
  usdPrice: number;
  className?: string;
  showCurrencyCode?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  usdPrice, 
  className = '', 
  showCurrencyCode = true,
  size = 'md'
}) => {
  const { currency } = useCurrency();
  
  const convertedPrice = currency === 'SAR' ? usdPrice : (usdPrice / 3.75);
  const symbol = getCurrencySymbol(currency);
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold'
  };

  return (
    <span className={`${sizeClasses[size]} ${className}`}>
      {symbol}{convertedPrice.toFixed(2)}
      {showCurrencyCode && currency !== 'USD' && (
        <span className="text-xs text-gray-500 ml-1">
          {currency}
        </span>
      )}
    </span>
  );
};

export default PriceDisplay;