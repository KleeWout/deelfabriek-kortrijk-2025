'use client';
import dynamic from 'next/dynamic';
import animationData from '../Animation - 1748702795819.json';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LottiePlayer = dynamic(() => import('react-lottie-player'), {
  ssr: false,
});

export default function PaymentSuccess() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => {
      router.push('/tablet/ophaal-flow/pay/open-locker');
    }, 5000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-primarybackground)]">
      <div className="w-full flex justify-center mt-10 mb-2">
        <Image
          src="/deelfabriek-website-labels-boven_v2.svg"
          alt="Deelfabriek Logo"
          width={180}
          height={60}
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-white rounded-3xl shadow-2xl border border-[var(--color-secondarygreen-1)] px-16 py-16 mt-4">
        <LottiePlayer
          loop={false}
          play
          animationData={animationData}
          style={{ width: 300, height: 300 }}
        />
        <div className="mt-8 text-3xl font-extrabold text-[var(--color-primarygreen-1)] text-center">
          Betaling succesvol
        </div>
        <div className="mt-4 text-lg text-[var(--color-primarytext-1)] text-center max-w-md">
          Je betaling is goed ontvangen.
          <br />
          Even geduld, je locker opent automatisch...
        </div>
      </div>
    </div>
  );
}
