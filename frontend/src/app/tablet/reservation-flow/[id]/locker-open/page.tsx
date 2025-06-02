'use client';
import Image from 'next/image';
import { LockOpen, CheckCircle } from 'phosphor-react';

export default function LockerOpenPage() {
  // Demo: static code and locker
  const reservatieCode = '662663';
  const lockerNummer = '02';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f6f8]">
      <div className="w-full max-w-4xl mx-auto px-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/deelfabriek-website-labels-boven_v2.svg"
              alt="Deelfabriek Logo"
              width={280}
              height={100}
            />
          </div>

          {/* Locker Icon */}
          <div className="mb-8">
            <LockOpen
              size={120}
              weight="regular"
              className="text-[var(--color-primarygreen-1)]"
            />
          </div>

          {/* Main Message */}
          <div className="text-4xl font-extrabold text-[var(--color-primarygreen-1)] text-center mb-4">
            Locker {lockerNummer} is geopend
          </div>

          {/* Subtext */}
          <div className="text-xl text-gray-700 text-center mb-12 max-w-2xl">
            Neem je item uit de locker en sluit deze goed af. Bewaar je
            reservatiecode goed, je hebt deze nodig om je item terug te brengen.
          </div>

          {/* Reservation Code Card */}
          <div className="w-full max-w-md bg-[#e6f0f2] border-2 border-[var(--color-primarygreen-1)] rounded-2xl p-8">
            <div className="text-2xl font-bold text-[var(--color-primarygreen-1)] text-center mb-4">
              Je Reservatiecode
            </div>
            <div className="text-4xl font-extrabold tracking-widest text-gray-900 text-center mb-4">
              {reservatieCode.split('').join(' ')}
            </div>
            <div className="text-base text-gray-700 text-center">
              Deze code is ook verzonden naar je e-mailadres
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
