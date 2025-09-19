'use client';
import React, { useState } from 'react';
import { CURRENCIES, getCurrencySymbol } from '@/utils/currency';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Globe, ChevronDown, MapPin, Check } from 'lucide-react';

const CurrencySelector: React.FC = () => {
  const { currency, changeCurrency, isAutoDetected, isDetecting } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currentCurrency = CURRENCIES.find(c => c.code === currency);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-whiteColor dark:bg-whiteColor-dark border border-borderColor dark:border-borderColor-dark rounded-standard px-3 py-2 text-sm hover:border-primaryColor focus:outline-none focus:border-primaryColor transition-all duration-300 text-headingColor dark:text-headingColor-dark"
        disabled={isDetecting}
      >
        {isDetecting ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-primaryColor border-t-transparent rounded-full"></div>
            <span className="text-contentColor dark:text-contentColor-dark">Detecting...</span>
          </>
        ) : (
          <>
            {isAutoDetected && <MapPin className="w-4 h-4 text-green-500" />}
            <span className="font-medium text-primaryColor">{getCurrencySymbol(currency)}</span>
            <span className="font-medium">{currency}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-whiteColor dark:bg-whiteColor-dark border border-borderColor dark:border-borderColor-dark rounded-standard shadow-dropdown z-50 max-h-96 overflow-y-auto">
          {isAutoDetected && (
            <div className="px-4 py-3 bg-yellow border-b border-borderColor dark:border-borderColor-dark text-xs text-primaryColor flex items-center">
              <Globe className="w-3 h-3 mr-2" />
              Auto-detected from your location
            </div>
          )}
          
          <div className="py-2">
            <button
              onClick={async () => {
                try {
                  const { detectCurrencyByIP } = await import('@/utils/currency');
                  const detectedCurrency = await detectCurrencyByIP();
                  changeCurrency(detectedCurrency);
                  setIsOpen(false);
                } catch (error) {
                  console.log('Auto-detection failed');
                }
              }}
              className="w-full text-left px-4 py-3 hover:bg-yellow hover:bg-opacity-20 transition-all duration-300 flex items-center space-x-3 text-headingColor dark:text-headingColor-dark border-b border-borderColor dark:border-borderColor-dark"
            >
              <div className="w-8 h-8 rounded-full bg-primaryColor flex items-center justify-center">
                <Globe className="w-4 h-4 text-whiteColor" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Auto-detect Currency</div>
                <div className="text-xs text-contentColor dark:text-contentColor-dark">Detect from your location</div>
              </div>
            </button>
            
            {CURRENCIES.map((curr) => (
              <button
                key={curr.code}
                onClick={() => {
                  changeCurrency(curr.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-yellow hover:bg-opacity-20 transition-all duration-300 flex items-center justify-between ${
                  currency === curr.code 
                    ? 'bg-yellow bg-opacity-20 text-black' 
                    : 'text-headingColor dark:text-headingColor-dark'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${
                    currency === curr.code 
                      ? 'bg-primaryColor text-whiteColor' 
                      : 'bg-borderColor dark:bg-borderColor-dark text-contentColor dark:text-contentColor-dark'
                  }`}>
                    {curr.symbol}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{curr.code}</div>
                    <div className="text-xs text-contentColor dark:text-contentColor-dark">{curr.name}</div>
                  </div>
                </div>
                {currency === curr.code && (
                  <Check className="w-4 h-4 text-primaryColor" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default CurrencySelector;