"use client";

import { useState } from 'react';

interface PaymentMethodSelectorProps {
  selectedMethod: 'paymob';
  onMethodChange: (method: 'paymob') => void;
}

const PaymentMethodSelector = ({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) => {
  return (
    <div className="mb-6">
      <h4 className="text-lg font-medium text-blackColor dark:text-blackColor-dark mb-4">
        Select Payment Method
      </h4>
      
      <div className="space-y-3">
        {/* Paymob Option */}
        <div className="flex items-center gap-3 p-4 border border-borderColor dark:border-borderColor-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <input
            type="radio"
            id="paymob"
            name="paymentMethod"
            value="paymob"
            checked={selectedMethod === 'paymob'}
            onChange={() => onMethodChange('paymob')}
            className="w-4 h-4 text-primaryColor"
          />
          <label htmlFor="paymob" className="flex items-center gap-3 cursor-pointer flex-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <div>
                <div className="font-medium text-blackColor dark:text-blackColor-dark">
                  Paymob
                </div>
                <div className="text-sm text-contentColor dark:text-contentColor-dark">
                  Local payment methods, Mobile wallets
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;