import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
})

export async function POST(req: Request) {
  try {
    const { items, userId, currency = 'usd' } = await req.json()
    
    console.log('Stripe API received:', { currency, items: items.length })

    const isRenewal = items.some((item: any) => item.isRenewal);

    // Ensure price is passed as integer in cents and courseId is included
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: currency, // Use dynamic currency
        product_data: {
          name: item.name, // Name of the product
          images: [item.image], // Image URL
        },
        unit_amount: Math.round(parseFloat(item.price) * 100), // Convert price to cents (integer)
      },
      quantity: item.quantity || 1, // Default to 1 if no quantity is provided
    }))

    // Extract courseIds and add them to the metadata as a comma-separated string
    const courseIds = items.map((item: any) => item.courseId)

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payProgress/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payProgress/cancel`,
      metadata: {
        userId, // Pass userId for order processing
        courseIds: courseIds.join(','), // Join courseIds into a comma-separated string
        isRenewal: isRenewal.toString(),
      },
    })

    return NextResponse.json({ sessionId: session.id }, { status: 200 })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session.' },
      { status: 500 }
    )
  }
}
