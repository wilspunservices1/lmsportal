import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const {
      items,
      userId,
      email,
      phone,
      currency = 'SAR',
      firstName = 'Customer',
      lastName = 'User',
      address = 'Main Street',
      city = 'Riyadh',
      country = 'Saudi Arabia',
      countryCode = 'SA',
      billingAddress,
      billingCity,
      billingPhone
    } = await req.json();

    const isRenewal = items.some((item: any) => item.isRenewal);
    const secretKey = process.env.PAYMOB_SECRET_KEY;
    const publicKey = process.env.PAYMOB_PUBLIC_KEY;
    const integrationId = process.env.PAYMOB_INTEGRATION_ID;

    console.log('=== PAYMOB CHECKOUT START ===');
    console.log('Input Data:', {
      email,
      userId,
      integrationId,
      country,
      countryCode,
      billingAddress,
      billingCity,
      billingPhone,
      firstName,
      lastName
    });

    if (!secretKey || !publicKey || !integrationId) {
      throw new Error('Missing Paymob configuration. Check environment variables.');
    }

    if (!email || !email.includes('@')) {
      throw new Error('Valid email is required');
    }

    const finalPhone = billingPhone || phone || '';
    let phoneNumber = finalPhone.trim();

    if (!phoneNumber.startsWith('+')) {
      phoneNumber = '+' + phoneNumber;
    }

    if (phoneNumber === '+' || !phoneNumber) {
      phoneNumber = '+966500000000';
    }

    console.log('Phone Formatting:', {
      input: finalPhone,
      final: phoneNumber
    });

    // Validate items
    if (!items || items.length === 0) {
      throw new Error('No items in order');
    }

    console.log('Items received:', items);

    // Frontend sends prices already converted to selected currency
    // We need to convert BACK to SAR for Paymob KSA (only accepts SAR)
    const CURRENCY_TO_SAR = {
      'SAR': 1,
      'USD': 1 / 0.27,
      'AED': 1 / 0.97,
      'PKR': 1 / 74.66,
      'CAD': 1 / 0.37
    };

    const conversionRate = CURRENCY_TO_SAR[currency] || 1;

    const totalAmountCents = Math.round(
      items.reduce((sum: number, item: any) => {
        const priceInSelectedCurrency = parseFloat(item.price);
        if (isNaN(priceInSelectedCurrency) || priceInSelectedCurrency <= 0) {
          console.warn('Invalid price for item:', item);
          return sum;
        }
        const priceInSAR = priceInSelectedCurrency * conversionRate;
        return sum + (priceInSAR * 100);
      }, 0)
    );

    // Paymob minimum amount is 100 cents (1 SAR)
    const MINIMUM_AMOUNT_CENTS = 100;
    if (totalAmountCents < MINIMUM_AMOUNT_CENTS) {
      throw new Error(`Amount too low. Minimum is ${MINIMUM_AMOUNT_CENTS / 100} SAR, but got ${totalAmountCents / 100} SAR`);
    }

    console.log('Currency Conversion:', {
      userCurrency: currency,
      conversionRate,
      totalAmountCents,
      note: 'Converting to SAR for Paymob KSA'
    });

    const finalAddress = (billingAddress || address || 'Main Street').trim();
    const finalCity = (billingCity || city || 'Riyadh').trim();
    const finalCountry = country || 'Saudi Arabia';
    const finalCountryCode = countryCode || 'SA';

    console.log('Billing Data:', {
      address: finalAddress,
      city: finalCity,
      country: finalCountry,
      countryCode: finalCountryCode,
      phone: phoneNumber
    });

    const payloadBody = {
      amount: totalAmountCents,
      currency: 'SAR', // Paymob KSA only accepts SAR
      payment_methods: [parseInt(integrationId)],
      special_reference: `order_${userId}_${Date.now()}`,
      customer: {
        first_name: (firstName || 'Customer').substring(0, 50).trim(),
        last_name: (lastName || 'User').substring(0, 50).trim(),
        email: email.trim().toLowerCase(),
        phone_number: phoneNumber
      },
      extras: {
        three_d_secure: true,
        userId: userId,
        isRenewal: isRenewal.toString(),
        courseIds: items.map((item: any) => item.courseId).join(',')
      },
      items: items.map((item: any) => {
        const priceInSelectedCurrency = parseFloat(item.price);
        const priceInSAR = priceInSelectedCurrency * conversionRate;
        const priceInCents = Math.max(100, Math.round(priceInSAR * 100));
        const symbols = { SAR: 'ر.س', USD: '$', AED: 'د.إ', PKR: '₨', CAD: 'C$' };
        return {
          name: item.name.substring(0, 50),
          amount: priceInCents,
          description: `Course ID: ${item.courseId} | ${item.name} (${symbols[currency]}${priceInSelectedCurrency} ${currency})`.substring(0, 255),
          quantity: 1
        };
      }),
      billing_data: {
        apartment: '1',
        first_name: (firstName || 'Customer').substring(0, 50).trim(),
        last_name: (lastName || 'User').substring(0, 50).trim(),
        street: finalAddress.substring(0, 100),
        building: '1',
        phone_number: phoneNumber,
        city: finalCity.substring(0, 50),
        country: finalCountry,
        email: email.trim().toLowerCase(),
        floor: '1',
        state: finalCity.substring(0, 50),
        postal_code: '11564'
      },
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paymob/webhook`,
      redirection_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payProgress/success?payment_method=paymob`,
      expiration: 3600
    };

    console.log('=== SENDING TO PAYMOB ===');
    console.log('Amount (cents):', totalAmountCents);
    console.log('Full Payload:', JSON.stringify(payloadBody, null, 2));

    const intentResponse = await fetch('https://ksa.paymob.com/v1/intention', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${secretKey}`
      },
      body: JSON.stringify(payloadBody)
    });

    const intentData = await intentResponse.json();

    console.log('=== PAYMOB RESPONSE ===');
    console.log('Status Code:', intentResponse.status);
    console.log('Response Data:', JSON.stringify(intentData, null, 2));

    if (!intentResponse.ok) {
      console.error('❌ Paymob API Error - Details:', {
        status: intentResponse.status,
        error: intentData,
        message: intentData.detail || intentData.message || 'Unknown error'
      });

      return NextResponse.json({
        error: 'Payment request failed',
        details: intentData.detail || intentData.message || JSON.stringify(intentData),
        debugInfo: {
          statusCode: intentResponse.status,
          fullError: intentData
        }
      }, { status: 400 });
    }

    if (!intentData.client_secret) {
      console.error('❌ No client secret in response');
      throw new Error('No client secret returned from Paymob');
    }

    console.log('✅ Payment intent created successfully:', intentData.id);

    return NextResponse.json({
      paymentToken: intentData.client_secret,
      orderId: intentData.id,
      iframeUrl: `https://ksa.paymob.com/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${intentData.client_secret}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payProgress/success?payment_method=paymob&order_id=${intentData.id}`,
      intentData: intentData
    });

  } catch (error) {
    console.error('❌ PAYMOB CHECKOUT ERROR:', error);
    const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
    return NextResponse.json(
      {
        error: errorMessage,
        type: 'checkout_error'
      },
      { status: 500 }
    );
  }
}