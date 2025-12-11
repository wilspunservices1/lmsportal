import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('=== WEBHOOK TEST ENDPOINT HIT ===');
  return NextResponse.json({ status: 'Webhook endpoint is working', timestamp: new Date().toISOString() });
}

export async function POST(req: NextRequest) {
  console.log('=== WEBHOOK TEST POST ENDPOINT HIT ===');
  const body = await req.json();
  console.log('Test webhook body:', body);
  return NextResponse.json({ status: 'Test webhook received', body });
}