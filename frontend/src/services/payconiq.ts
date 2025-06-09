interface PayconiqPaymentResponse {
  paymentId: string;
  qrCode: string;
  status: string;
}

export async function createPayconiqPayment(
  amount: number,
  description: string
) {
  const response = await fetch('/api/payconiq/create-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, description }),
  });
  if (!response.ok) throw new Error('Failed to create payment');
  return await response.json();
}

export async function checkPaymentStatus(paymentId: string): Promise<string> {
  const response = await fetch(
    `/api/payconiq/status?paymentId=${encodeURIComponent(paymentId)}`
  );
  if (!response.ok) throw new Error('Failed to check payment status');
  const data = await response.json();
  return data.status;
}
