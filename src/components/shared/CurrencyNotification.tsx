'use client';
import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { CURRENCIES } from '@/utils/currency';
import { MapPin, X } from 'lucide-react';

const CurrencyNotification: React.FC = () => {
  const { currency, isAutoDetected, changeCurrency } = useCurrency();
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Show notification only once when currency is auto-detected
    if (isAutoDetected && !hasBeenShown && currency !== 'USD') {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasBeenShown(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isAutoDetected, hasBeenShown, currency]);

  useEffect(() => {
    // Auto-hide after 8 seconds
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible || !isAutoDetected) return null;

  const currentCurrency = CURRENCIES.find(c => c.code === currency);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 animate-slide-in-right">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900">
              Currency Auto-Detected
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              We've set your currency to <strong>{currentCurrency?.name} ({currency})</strong> based on your location.
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={() => setIsVisible(false)}
                className="text-xs text-green-600 hover:text-green-800 font-medium"
              >
                Keep {currency}
              </button>
              <button
                onClick={() => {
                  changeCurrency('USD');
                  setIsVisible(false);
                }}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Use USD
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyNotification;