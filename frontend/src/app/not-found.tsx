'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from '@phosphor-icons/react';
import dynamic from 'next/dynamic';
import Footer from '@/components/mobile/footer';

const LottiePlayer = dynamic(() => import('react-lottie-player'), {
  ssr: false,
});

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#004431] text-white">
      <div className="flex flex-1 flex-col md:flex-row items-center justify-center w-full max-w-screen-xl mx-auto px-4 md:px-8 py-8 md:py-0 gap-0 md:gap-0">
        {/* Left: Logo, text, button */}
        <div className="flex flex-col items-center md:items-start justify-center w-full md:w-1/2 h-full">
          <Image
            src="/deelfabriek-website-labels-boven_v2.svg"
            alt="Deelfabriek Logo"
            width={240}
            height={80}
            className="mb-10 object-contain"
            priority
          />
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-6 text-center md:text-left"
            style={{ fontFamily: 'var(--font-exo2), sans-serif' }}
          >
            Oeps! Pagina niet gevonden
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 max-w-lg text-center md:text-left"
            style={{ fontFamily: 'var(--font-open-sans), sans-serif' }}
          >
            Deze pagina bestaat niet (meer).
            <br />
            Klik op de knop om terug te gaan.
          </p>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-4 border-2 border-white rounded-lg font-semibold text-lg md:text-xl transition-all duration-200 hover:bg-white hover:text-[#004431] focus:outline-none focus:ring-2 focus:ring-white w-auto max-w-xs mx-auto md:mx-0"
            aria-label="Ga terug naar de vorige pagina"
          >
            <ArrowLeft size={24} weight="bold" />
            Ga terug
          </button>
        </div>
        {/* Right: Lottie animation */}
        <div className="flex w-full md:w-1/2 items-center justify-center mt-10 md:mt-0">
          <LottiePlayer
            loop
            play
            animationData={require('../../public/404-animation.json')}
            style={{ width: 300, height: 300 }}
            className="drop-shadow-2xl"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
