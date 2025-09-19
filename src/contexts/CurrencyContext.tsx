'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserCurrency, setCurrency, detectCurrencyByIP, setAutoDetectedCurrency, getAutoDetectedCurrency } from '@/utils/currency';

interface CurrencyContextType {
  currency: string;
  changeCurrency: (newCurrency: string) => void;
  isAutoDetected: boolean;
  isDetecting: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>('USD');
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(true);

  useEffect(() => {
    const initializeCurrency = async () => {
      const storedCurrency = getUserCurrency();
      
      if (storedCurrency !== 'USD') {
        // User has manually selected a currency
        setCurrencyState(storedCurrency);
        setIsAutoDetected(false);
        setIsDetecting(false);
      } else {
        // Check if we have auto-detected before
        const autoDetected = getAutoDetectedCurrency();
        if (autoDetected) {
          setCurrencyState(autoDetected);
          setIsAutoDetected(true);
          setIsDetecting(false);
        } else {
          // Perform IP-based detection
          try {
            const detectedCurrency = await detectCurrencyByIP();
            setCurrencyState(detectedCurrency);
            setAutoDetectedCurrency(detectedCurrency);
            setIsAutoDetected(true);
          } catch (error) {
            console.log('Currency detection failed, using USD');
            setCurrencyState('USD');
            setIsAutoDetected(false);
          } finally {
            setIsDetecting(false);
          }
        }
      }
    };

    initializeCurrency();
  }, []);

  const changeCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    setCurrency(newCurrency);
    setIsAutoDetected(false); // User manually changed currency
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, isAutoDetected, isDetecting }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};