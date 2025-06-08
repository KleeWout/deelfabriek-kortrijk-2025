'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MagnifyingGlass, User, CreditCard } from 'phosphor-react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import animationData from './Animation - 1748702795819.json';
import React from 'react';
import { createPayconiqPayment, checkPaymentStatus } from '@/services/payconiq';

const LottiePlayer = dynamic(() => import('react-lottie-player'), {
  ssr: false,
});

export default function PayconiqPayPage() {
  const router = useRouter();
  const [paid, setPaid] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>('');
  const amount = 0.1; // Tijdelijk testbedrag van 10 cent

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const payment = await createPayconiqPayment(
          amount,
          'Deelfabriek Kortrijk - Item ophalen'
        );
        setQrCode(payment._links.qrcode.href);
        setPaymentId(payment.paymentId);
      } catch (error) {
        console.error('Failed to initialize payment:', error);
      }
    };

    initializePayment();
  }, [amount]);

  useEffect(() => {
    if (paymentId) {
      const checkPayment = async () => {
        try {
          const status = await checkPaymentStatus(paymentId);
          if (status === 'SUCCEEDED') {
            setPaid(true);
          }
        } catch (error) {
          console.error('Failed to check payment status:', error);
        }
      };

      const interval = setInterval(checkPayment, 2000); // Check every 2 seconds
      return () => clearInterval(interval);
    }
  }, [paymentId]);

  // Redirect na animatie
  useEffect(() => {
    if (paid) {
      const t = setTimeout(() => {
        router.push('/tablet/ophaal-flow/pay/open-locker');
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [paid, router]);

  return (
    <div className="min-h-screen bg-[#f3f6f8] flex flex-col">
      {/* Header with stepper */}
      <div className="w-full flex items-center justify-between bg-white px-12 py-6 shadow-sm">
        <Image
          src="/deelfabriek-website-labels-boven_v2.svg"
          alt="Deelfabriek Logo"
          width={240}
          height={90}
        />
        <div className="flex items-center gap-10 ml-auto">
          {/* Step 1 */}
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <MagnifyingGlass
                size={28}
                weight="regular"
                className="text-[var(--color-primarygreen-1)]"
              />
            </div>
            <div>
              <div className="font-bold text-[var(--color-primarygreen-1)] text-lg">
                Stap 1
              </div>
              <div className="text-xs text-gray-700 font-semibold">
                Zoek en selecteer
              </div>
            </div>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-2" />
          {/* Step 2 */}
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User
                size={28}
                weight="regular"
                className="text-[var(--color-primarygreen-1)]"
              />
            </div>
            <div>
              <div className="font-bold text-[var(--color-primarygreen-1)] text-lg">
                Stap 2
              </div>
              <div className="text-xs text-gray-700 font-semibold">
                Contactgegevens
              </div>
            </div>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-2" />
          {/* Step 3 - Active */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primarygreen-1)] flex items-center justify-center">
              <CreditCard size={28} weight="regular" className="text-white" />
            </div>
            <div>
              <div className="font-bold text-[var(--color-primarygreen-1)] text-lg">
                Stap 3
              </div>
              <div className="text-xs text-gray-700 font-semibold">
                Betaling
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="flex flex-1 justify-center items-center">
        <div className="w-[440px] bg-white rounded-xl shadow-xl border-2 border-[var(--color-primarygreen-1)] flex flex-col">
          {/* Card header */}
          <div className="flex justify-between items-center bg-[var(--color-primarygreen-1)] rounded-t-xl px-6 py-3">
            <span className="text-lg font-bold text-white">Te betalen</span>
            <span className="text-lg font-bold text-white">
              €{amount.toFixed(2)}
            </span>
          </div>
          {/* Instructie en QR */}
          {!paid ? (
            <div className="flex flex-col items-center justify-center px-8 py-8 gap-6">
              <div className="flex items-center gap-3 w-full mb-2">
                <Image
                  src="/payconiq.png"
                  alt="Payconiq"
                  width={40}
                  height={18}
                  className="mb-2"
                />
                <span className="text-base text-gray-800 font-medium">
                  Gebruik de Payconiq by Bancontact app
                  <br />
                  om je betaling te voltooien
                </span>
              </div>
              {/* QR-code */}
              <div className="flex justify-center items-center w-full mt-2 mb-4">
                {qrCode ? (
                  <div className="bg-white border-2 border-gray-400 w-44 h-44 rounded-lg flex items-center justify-center overflow-hidden">
                    <Image
                      src={qrCode}
                      alt="Payconiq QR Code"
                      width={176}
                      height={176}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-white border-2 border-gray-400 w-44 h-44 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primarygreen-1)]"></div>
                  </div>
                )}
              </div>
              <button
                className="w-full max-w-[220px] py-3 rounded-lg border-2 border-[var(--color-primarygreen-1)] text-[var(--color-primarygreen-1)] text-lg font-bold bg-white hover:bg-[var(--color-primarygreen-1)] hover:text-white transition"
                onClick={() => router.back()}
              >
                Annuleren
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-8 py-10 gap-8 flex-1">
              <LottiePlayer
                loop={false}
                play
                animationData={animationData}
                style={{ width: 180, height: 180 }}
              />
              <div className="text-2xl font-bold text-[var(--color-primarygreen-1)] text-center">
                Betaling succesvol
              </div>
              <div className="text-base text-gray-700 text-center">
                Je betaling is goed ontvangen.
                <br />
                De locker opent automatisch…
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
