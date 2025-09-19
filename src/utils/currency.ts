export interface Currency {
  code: string;
  symbol: string;
  name: string;
  country: string;
  rate: number; // Exchange rate relative to USD
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', country: 'US', rate: 1 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', country: 'CA', rate: 1.35 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', country: 'AE', rate: 3.67 },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', country: 'SA', rate: 3.75 },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', country: 'PK', rate: 280 }
];

export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  'US': 'USD',
  'CA': 'CAD', 
  'AE': 'AED',
  'SA': 'SAR',
  'PK': 'PKR'
};

// IP-based currency detection
export const detectCurrencyByIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const countryCode = data.country_code;
    return COUNTRY_TO_CURRENCY[countryCode] || 'USD';
  } catch (error) {
    console.log('IP detection failed, using locale fallback');
    // Fallback to locale detection
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale;
      const country = locale.split('-')[1];
      return COUNTRY_TO_CURRENCY[country] || 'USD';
    } catch {
      return 'USD';
    }
  }
};

export const getUserCurrency = (): string => {
  if (typeof window === 'undefined') return 'USD';
  
  const stored = localStorage.getItem('selectedCurrency');
  if (stored) return stored;
  
  // Return USD as default, IP detection will happen async
  return 'USD';
};

export const setCurrency = (currencyCode: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedCurrency', currencyCode);
  }
};

export const convertPrice = (usdPrice: number, toCurrency: string): number => {
  const currency = CURRENCIES.find(c => c.code === toCurrency);
  return currency ? usdPrice * currency.rate : usdPrice;
};

export const formatPrice = (price: number, currencyCode: string): string => {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  if (!currency) return `${price.toFixed(2)} USD`;
  
  return `${price.toFixed(2)} ${currency.code}`;
};

export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  return currency?.symbol || '$';
};

export const setAutoDetectedCurrency = (currencyCode: string): void => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('selectedCurrency');
    // Only set if user hasn't manually selected a currency
    if (!stored) {
      localStorage.setItem('autoDetectedCurrency', currencyCode);
    }
  }
};

export const getAutoDetectedCurrency = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('autoDetectedCurrency');
};