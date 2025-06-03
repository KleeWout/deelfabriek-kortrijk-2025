"use client";
import Image from "next/image";
import { LockOpen, CheckCircle, House } from "phosphor-react";
import { useParams, useRouter } from "next/navigation";

export default function LockerOpenPage() {
  // Get locker number from URL parameter (id)
  const { id } = useParams();
  const router = useRouter();

  // Demo: static reservation code, but dynamic locker number from URL
  const reservatieCode = "662663";
  const lockerNummer = id?.toString().padStart(2, "0") || "00";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f6f8]">
      <div className="w-full max-w-4xl mx-auto px-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-8">
            <Image src="/deelfabriek-website-labels-boven_v2.svg" alt="Deelfabriek Logo" width={280} height={100} />
          </div>

          {/* Locker Icon */}
          <div className="mb-8">
            <LockOpen size={120} weight="regular" className="text-[var(--color-primarygreen-1)]" />
          </div>

          {/* Main Message */}
          <div className="text-4xl font-extrabold text-[var(--color-primarygreen-1)] text-center mb-4">Locker {lockerNummer} is geopend</div>

          {/* Subtext */}
          <div className="text-xl text-gray-700 text-center mb-12 max-w-2xl">Neem je item uit de locker en sluit deze goed af. Bewaar je reservatiecode goed, je hebt deze nodig om je item terug te brengen.</div>

          {/* Reservation Code Card */}
          <div className="w-full max-w-md bg-[#e6f0f2] border-2 border-[var(--color-primarygreen-1)] rounded-2xl p-8 mb-10">
            <div className="text-2xl font-bold text-[var(--color-primarygreen-1)] text-center mb-4">Je Reservatiecode</div>
            <div className="text-4xl font-extrabold tracking-widest text-gray-900 text-center mb-4">{reservatieCode.split("").join(" ")}</div>
            <div className="text-base text-gray-700 text-center">Deze code is ook verzonden naar je e-mailadres</div>
          </div>

          {/* Home Button */}
          <button onClick={() => router.push("/tablet")} className="flex items-center gap-2 bg-[var(--color-primarygreen-1)] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#007260] transition-colors">
            <House size={24} weight="bold" />
            Terug naar startpagina
          </button>
        </div>
      </div>
    </div>
  );
}
