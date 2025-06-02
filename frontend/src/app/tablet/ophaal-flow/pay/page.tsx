'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import animationData from './Animation - 1748702795819.json';

export default function PayconiqPayPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen bg-[var(--color-primarybackground)] flex flex-col">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-12 pt-8 pb-2 border-b border-[var(--color-secondarygreen-1)] mb-2">
        <Image
          src="/deelfabriek-website-labels-boven_v2.svg"
          alt="Deelfabriek Logo"
          width={180}
          height={60}
        />
        <button
          className="px-8 py-2 border-2 border-[var(--color-secondarygreen-1)] rounded-lg text-[var(--color-primarygreen-1)] text-xl font-bold bg-white hover:bg-[var(--color-secondarygreen-1)] transition"
          onClick={() => router.back()}
        >
          Annuleren
        </button>
      </div>
      {/* Main content */}
      <div className="flex flex-1 justify-center items-center">
        <div className="w-[600px] min-h-[520px] bg-white rounded-3xl shadow-xl border border-[var(--color-secondarygreen-1)] flex flex-col">
          {/* Titel en bedrag */}
          <div
            className="flex justify-between items-center bg-[var(--color-secondarygreen-1)] rounded-t-3xl px-10 py-5"
            style={{ background: 'rgba(0, 80, 70, 0.08)' }}
          >
            <span className="text-2xl font-bold text-[var(--color-primarytext-1)]">
              Nog te betalen
            </span>
            <span className="text-3xl font-extrabold text-[var(--color-primarygreen-1)]">
              €15,00
            </span>
          </div>
          {/* Instructie en QR */}
          <div className="flex flex-col items-center justify-center flex-1 px-10 py-10 gap-8">
            <div className="flex flex-col items-center gap-3 w-full mb-2">
              <Image
                src="/payconiq.png"
                alt="Payconiq"
                width={80}
                height={30}
                className="mb-2"
              />
              <span
                className="text-xl text-[var(--color-primarytext-1)] font-medium text-center leading-snug"
                style={{ maxWidth: 420 }}
              >
                Scan de QR-code met de Payconiq by Bancontact app
                <br />
                om je betaling te voltooien
              </span>
            </div>
            {/* Dummy QR-code */}
            <div className="flex flex-col items-center w-full mt-2 gap-6">
              <div className="bg-black w-64 h-64 rounded-2xl flex items-center justify-center shadow-lg">
                <svg width="180" height="180" viewBox="0 0 120 120">
                  <rect x="0" y="0" width="120" height="120" fill="#fff" />
                  <rect x="10" y="10" width="30" height="30" fill="#000" />
                  <rect x="80" y="10" width="30" height="30" fill="#000" />
                  <rect x="10" y="80" width="30" height="30" fill="#000" />
                  <rect x="50" y="50" width="10" height="10" fill="#000" />
                  <rect x="70" y="70" width="10" height="10" fill="#000" />
                  <rect x="90" y="90" width="10" height="10" fill="#000" />
                </svg>
              </div>
              <button
                className="mt-6 px-8 py-4 bg-[var(--color-primarygreen-1)] text-white text-xl rounded-lg font-bold shadow hover:bg-[#00664f] transition disabled:opacity-60"
                onClick={() => {
                  setLoading(true);
                  setTimeout(
                    () => router.push('/tablet/ophaal-flow/pay/success'),
                    600
                  );
                }}
                disabled={loading}
              >
                Betaald
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
