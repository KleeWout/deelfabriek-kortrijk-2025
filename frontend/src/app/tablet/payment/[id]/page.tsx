"use client";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { MagnifyingGlass, User, CreditCard } from "phosphor-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import animationData from "@/app/tablet/ophaal-flow/pay/Animation - 1748702795819.json";
import Stepper, { TabletHeader } from "@/components/tabletHeader";

const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

export default function ReservationPayPage() {
  const router = useRouter();
  const { id } = useParams();
  // For demo: static amount, but you could fetch by id
  const amount = "€5,00";
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (paid) {
      const t = setTimeout(() => {
        router.push(`/tablet/payment/${id}/locker-open`);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [paid, id, router]);

  return (
    <div className="min-h-screen bg-[#f3f6f8] flex flex-col">
      {/* Header with stepper */}
      <TabletHeader />

      {/* Main content */}
      <div className="flex flex-1 justify-center items-center p-4">
        <div className="w-full max-w-[640px] min-h-[640px] bg-white rounded-xl shadow-xl  flex flex-col">
          {/* Card header */}
          <div className="flex justify-between items-center bg-primarygreen-1 rounded-t-xl px-8 py-4">
            <span className="text-xl font-bold text-white">Te betalen</span>
            <span className="text-xl font-bold text-white">{amount}</span>
          </div>

          {/* Content */}
          {!paid ? (
            <div className="flex flex-col items-center justify-start px-8 py-10 gap-8 flex-1 border-2 border-primarygreen-1">
              <div className="flex items-center gap-6 w-full mb-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <Image src="/payconiq.png" alt="Payconiq" width={60} height={30} className="object-contain" />
                <span className="text-lg text-gray-800 font-medium">
                  Gebruik de Payconiq by Bancontact app
                  <br />
                  om je betaling te voltooien
                </span>
              </div>

              {/* QR-code with fixed styling */}
              <div className="flex flex-col justify-center items-center w-full mt-2 mb-4">
                <div className="text-gray-500 text-sm mb-2">Scan deze QR-code met je app</div>
                <div
                  className="border-2 border-gray-300 w-56 h-56 rounded-xl flex items-center justify-center cursor-pointer 
                  hover:shadow-lg transition-all hover:border-[var(--color-primarygreen-1)] shadow-md overflow-hidden"
                  onClick={() => setPaid(true)}
                  title="Klik om te betalen"
                >
                  <Image src="/qrcode.png" alt="Payment QR Code" width={200} height={200} className="object-contain" />
                </div>
                <div className="text-sm text-gray-500 mt-3 italic">Klik op de QR-code om de betaling te simuleren</div>
              </div>

              <button className="w-full max-w-[300px] py-4 mt-4 rounded-lg border-2 border-primarygreen-1 text-primarygreen-1 text-lg font-bold bg-white hover:bg-[var(--color-primarygreen-1)] hover:text-white transition-all">Annuleren</button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-12 py-16 gap-10 flex-1">
              <LottiePlayer loop={false} play animationData={animationData} style={{ width: 240, height: 240 }} />
              <div className="text-3xl font-bold text-[var(--color-primarygreen-1)] text-center">Betaling succesvol</div>
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
