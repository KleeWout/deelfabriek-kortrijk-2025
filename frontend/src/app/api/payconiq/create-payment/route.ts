import { NextRequest, NextResponse } from 'next/server';

const payconiqApiKey = process.env.PAYCONIQ_API_KEY;
const MERCHANT_ID = '62823079e6c35c3c4ba944e6';

export async function POST(req: NextRequest) {
  const { amount, description } = await req.json();

  try {
    const payconiqRes = await fetch('https://api.payconiq.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${payconiqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100,
        currency: 'EUR',
        description,
        merchantId: MERCHANT_ID,
      }),
    });

    const data = await payconiqRes.json();
    return NextResponse.json(data, { status: payconiqRes.status });
  } catch (err) {
    return NextResponse.json(
      { error: 'Payconiq error', details: String(err) },
      { status: 500 }
    );
  }
}
