'use client';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { MagnifyingGlass, User, CreditCard } from 'phosphor-react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import animationData from '@/app/tablet/ophaal-flow/pay/Animation - 1748702795819.json';
import Stepper from '@/components/Stepper';

const LottiePlayer = dynamic(() => import('react-lottie-player'), {
  ssr: false,
});

export default function ReservationPayPage() {
  const router = useRouter();
  const { id } = useParams();
  // For demo: static amount, but you could fetch by id
  const amount = '€5,00';
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (paid) {
      const t = setTimeout(() => {
        router.push(`/tablet/reservation-flow/${id}/locker-open`);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [paid, id, router]);

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
        <div className="ml-auto">
          <Stepper activeStep={4} />
        </div>
      </div>
      {/* Main content */}
      <div className="flex flex-1 justify-center items-center">
        <div className="w-[640px] min-h-[640px] bg-white rounded-xl shadow-xl border-2 border-[var(--color-primarygreen-1)] flex flex-col">
          {/* Card header */}
          <div className="flex justify-between items-center bg-[var(--color-primarygreen-1)] rounded-t-xl px-8 py-4">
            <span className="text-xl font-bold text-white">Te betalen</span>
            <span className="text-xl font-bold text-white">{amount}</span>
          </div>
          {/* Content */}
          {!paid ? (
            <div className="flex flex-col items-center justify-center px-12 py-16 gap-10 flex-1">
              <div className="flex items-center gap-4 w-full mb-4">
                <Image
                  src="/payconiq.png"
                  alt="Payconiq"
                  width={48}
                  height={24}
                  className="mb-2"
                />
                <span className="text-lg text-gray-800 font-medium">
                  Gebruik de Payconiq by Bancontact app
                  <br />
                  om je betaling te voltooien
                </span>
              </div>
              {/* Dummy QR-code */}
              <div className="flex justify-center items-center w-full mt-4 mb-6">
                <div
                  className="bg-white border-2 border-gray-400 w-72 h-72 rounded-lg flex items-center justify-center cursor-pointer hover:shadow-lg transition"
                  onClick={() => setPaid(true)}
                  title="Klik om te betalen"
                >
                  <svg width="240" height="240" viewBox="0 0 120 120">
                    <rect x="0" y="0" width="120" height="120" fill="#fff" />
                    <rect x="10" y="10" width="30" height="30" fill="#000" />
                    <rect x="80" y="10" width="30" height="30" fill="#000" />
                    <rect x="10" y="80" width="30" height="30" fill="#000" />
                    <rect x="50" y="50" width="10" height="10" fill="#000" />
                    <rect x="70" y="70" width="10" height="10" fill="#000" />
                    <rect x="90" y="90" width="10" height="10" fill="#000" />
                  </svg>
                </div>
              </div>
              <button
                className="w-full max-w-[280px] py-4 rounded-lg border-2 border-[var(--color-primarygreen-1)] text-[var(--color-primarygreen-1)] text-lg font-bold bg-white hover:bg-[var(--color-primarygreen-1)] hover:text-white transition"
                onClick={() => router.back()}
              >
                Annuleren
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-12 py-16 gap-10 flex-1">
              <LottiePlayer
                loop={false}
                play
                animationData={animationData}
                style={{ width: 240, height: 240 }}
              />
              <div className="text-3xl font-bold text-[var(--color-primarygreen-1)] text-center">
                Betaling succesvol
              </div>
              <div className="text-lg text-gray-700 text-center">
                Je betaling is goed ontvangen.
                <br />
                Je wordt zo doorgestuurd…
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
