'use client';
import { useCurrency } from '@/contexts/CurrencyContext';
import { convertPrice, formatPrice, getCurrencySymbol } from '@/utils/currency';

export const useCurrencyConversion = () => {
  const { currency, changeCurrency, isAutoDetected, isDetecting } = useCurrency();

  const convertFromUSD = (usdPrice: number): number => {
    return convertPrice(usdPrice, currency);
  };

  const formatCurrency = (price: number): string => {
    return formatPrice(price, currency);
  };

  const getCurrencyInfo = () => ({
    code: currency,
    symbol: getCurrencySymbol(currency),
    isAutoDetected,
    isDetecting
  });

  return {
    currency,
    changeCurrency,
    convertFromUSD,
    formatCurrency,
    getCurrencyInfo,
    isAutoDetected,
    isDetecting
  };
};

export default useCurrencyConversion;