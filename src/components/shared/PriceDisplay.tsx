'use client';
import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PriceDisplayProps {
  usdPrice: number;
  className?: string;
  showCurrencyCode?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  'SAR': 'ر.س',
  'USD': '$',
  'AED': 'د.إ',
  'PKR': '₨',
  'CAD': 'C$'
};

const CURRENCY_RATES: Record<string, number> = {
  'SAR': 1,
  'USD': 0.27,
  'AED': 0.97,
  'PKR': 74.66,
  'CAD': 0.37
};

const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  usdPrice, 
  className = '', 
  showCurrencyCode = true,
  size = 'md'
}) => {
  const { currency } = useCurrency();
  
  // usdPrice is actually SAR price, just display it without conversion
  const displayPrice = usdPrice;
  const symbol = CURRENCY_SYMBOLS[currency] || 'ر.س';
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold'
  };

  return (
    <span className={`${sizeClasses[size]} ${className}`}>
      {symbol}{displayPrice.toFixed(2)}
      {showCurrencyCode && currency !== 'SAR' && (
        <span className="text-xs text-gray-500 ml-1">
          {currency}
        </span>
      )}
    </span>
  );
};

export default PriceDisplay;