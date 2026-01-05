import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { items, userId, email, phone, currency = 'SAR' } = await req.json();
    
    const isRenewal = items.some((item: any) => item.isRenewal);
    const secretKey = process.env.PAYMOB_SECRET_KEY;
    const publicKey = process.env.PAYMOB_PUBLIC_KEY;

    // Prices come already converted from frontend, just convert to cents
    const totalAmountCents = Math.max(10, Math.round(items.reduce((sum: number, item: any) => sum + (parseFloat(item.price) * 100), 0)));
    
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
          userId: userId,
          isRenewal: isRenewal.toString(),
          courseIds: items.map((item: any) => item.courseId).join(',')
        },
        items: items.map((item: any) => ({
          name: item.name.substring(0, 50),
          amount: Math.max(10, Math.round(parseFloat(item.price) * 100)),
          description: `Course ID: ${item.courseId} - ${item.name}`.substring(0, 255),
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
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paymob/webhook`,
        redirection_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payProgress/success?payment_method=paymob`,
        expiration: 3600
      })
    });
    
    const intentData = await intentResponse.json();
    
    if (!intentResponse.ok) {
      console.error('Paymob API Error:', intentData);
      const errorMessage = intentData.detail || intentData.message || JSON.stringify(intentData) || 'Unknown error';
      throw new Error(`Payment intent failed: ${errorMessage}`);
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
