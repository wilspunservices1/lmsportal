// Map currency codes to country information for Paymob billing
export interface CountryInfo {
    name: string;
    code: string; // ISO 2-letter country code
    phoneCode: string; // International dialing code
    defaultPhoneFormat: string; // Example format for user
}

export const CURRENCY_TO_COUNTRY: Record<string, CountryInfo> = {
    'USD': {
        name: 'United States',
        code: 'US',
        phoneCode: '+1',
        defaultPhoneFormat: '+12025551234'
    },
    'CAD': {
        name: 'Canada',
        code: 'CA',
        phoneCode: '+1',
        defaultPhoneFormat: '+14165551234'
    },
    'AED': {
        name: 'United Arab Emirates',
        code: 'AE',
        phoneCode: '+971',
        defaultPhoneFormat: '+971501234567'
    },
    'SAR': {
        name: 'Saudi Arabia',
        code: 'SA',
        phoneCode: '+966',
        defaultPhoneFormat: '+966501234567'
    },
    'PKR': {
        name: 'Pakistan',
        code: 'PK',
        phoneCode: '+92',
        defaultPhoneFormat: '+923001234567'
    }
};

export const getCountryInfoByCurrency = (currencyCode: string): CountryInfo => {
    return CURRENCY_TO_COUNTRY[currencyCode] || CURRENCY_TO_COUNTRY['USD'];
};

export const getPhoneCodeByCurrency = (currencyCode: string): string => {
    return getCountryInfoByCurrency(currencyCode).phoneCode;
};

export const getCountryNameByCurrency = (currencyCode: string): string => {
    return getCountryInfoByCurrency(currencyCode).name;
};
