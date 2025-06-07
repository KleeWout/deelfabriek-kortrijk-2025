'use client';
import Image from 'next/image';
import { LockOpen, Info } from 'phosphor-react';

export default function OpenLockerPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-primarybackground)]">
      {/* Logo bovenaan */}
      <div className="w-full flex justify-center mt-10 mb-10">
        <Image
          src="/deelfabriek-website-labels-boven_v2.svg"
          alt="Deelfabriek Logo"
          width={260}
          height={90}
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-white rounded-3xl shadow-2xl border border-[var(--color-secondarygreen-1)] px-24 py-20 mt-2 relative">
        <LockOpen
          size={180}
          weight="bold"
          className="text-[var(--color-primarygreen-1)] mb-10 z-10"
        />
        <div className="text-5xl font-extrabold text-[var(--color-primarygreen-1)] text-center mb-4 z-10">
          Locker 02 is geopend
        </div>
        <div className="text-2xl text-[var(--color-primarytext-1)] text-center max-w-2xl mb-8 z-10">
          Neem je item uit de locker en sluit de locker goed af.
        </div>
        <div className="flex items-center gap-3 mt-4 z-10">
          <Info size={32} className="text-[var(--color-primarygreen-1)]" />
          <span className="text-lg text-[var(--color-primarytext-1)] font-medium">
            Hulp nodig? Vraag het aan een medewerker!
          </span>
        </div>
      </div>
    </div>
  );
}
