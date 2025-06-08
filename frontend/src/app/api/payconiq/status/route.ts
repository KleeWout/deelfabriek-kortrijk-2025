import { NextRequest, NextResponse } from 'next/server';

const PAYCONIQ_API_KEY = 'f0dca81c-f417-48de-bfb7-12ea87b212d4';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get('paymentId');
  if (!paymentId) {
    return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 });
  }

  try {
    const payconiqRes = await fetch(
      `https://api.payconiq.com/v3/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${PAYCONIQ_API_KEY}`,
        },
      }
    );
    const data = await payconiqRes.json();
    return NextResponse.json(data, { status: payconiqRes.status });
  } catch (err) {
    return NextResponse.json(
      { error: 'Payconiq error', details: String(err) },
      { status: 500 }
    );
  }
}
