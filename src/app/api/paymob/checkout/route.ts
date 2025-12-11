import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { items, userId, email, phone } = await req.json();

    console.log('Secret Key:', process.env.PAYMOB_SECRET_KEY?.substring(0, 10) + '...');
    console.log('Public Key:', process.env.PAYMOB_PUBLIC_KEY?.substring(0, 10) + '...');
    console.log('Integration ID:', process.env.PAYMOB_INTEGRATION_ID);

    const secretKey = process.env.PAYMOB_SECRET_KEY;
    const publicKey = process.env.PAYMOB_PUBLIC_KEY;

    // Create payment intention using official Paymob API (amount in cents)
    const totalAmountCents = items.reduce((sum: number, item: any) => sum + (parseFloat(item.price) * 100), 0);
    
    const intentResponse = await fetch('https://ksa.paymob.com/v1/intention', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Token ${secretKey}`
      },
      body: JSON.stringify({
        amount: totalAmountCents,
        currency: 'SAR',
        payment_methods: [parseInt(process.env.PAYMOB_INTEGRATION_ID!)],
        special_reference: `test_${Date.now()}`,
        extras: {
          three_d_secure: false,
          userId: userId
        },
        items: items.map((item: any) => ({
          name: item.name.substring(0, 50), // Max 50 chars
          amount: parseFloat(item.price) * 100, // Amount in cents
          description: `Course ID: ${item.courseId} - ${item.name}`.substring(0, 255), // Max 255 chars
          quantity: 1
        })),
        billing_data: {
          apartment: 'N/A',
          first_name: 'Customer',
          last_name: 'Name',
          street: 'N/A',
          building: 'N/A',
          phone_number: phone || '+966500000000',
          city: 'Riyadh',
          country: 'Saudi Arabia',
          email: email,
          floor: 'N/A',
          state: 'Riyadh'
        },
        notification_url: `https://1d194d01b5cf.ngrok-free.app/api/paymob/webhook`,
        redirection_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payProgress/success?payment_method=paymob`,
        expiration: 3600
      })
    });
    
    const intentData = await intentResponse.json();
    console.log('Intent Response:', intentData);
    
    if (!intentResponse.ok) {
      throw new Error(`Payment intent failed: ${intentData.detail || 'Unknown error'}`);
    }

    return NextResponse.json({
      paymentToken: intentData.client_secret,
      orderId: intentData.id,
      iframeUrl: `https://ksa.paymob.com/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${intentData.client_secret}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payProgress/success?payment_method=paymob&order_id=${intentData.id}`,
      intentData: intentData
    });

  } catch (error) {
    console.error('Paymob checkout error:', error);
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
  }
}