"use client";
import dynamic from "next/dynamic";
import animationData from "../Animation - 1748702795819.json";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Info } from "phosphor-react";

const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

export default function PaymentSuccess() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => {
      router.push("/kiosk/ophaal-flow/pay/open-locker");
    }, 5000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-primarybackground)]">
      <div className="w-full flex justify-center mt-10 mb-2">
        <Image src="/deelfabriek-website-labels-boven_v2.svg" alt="Deelfabriek Logo" width={260} height={90} />
      </div>
      <div className="flex flex-col items-center justify-center bg-white rounded-3xl shadow-2xl border border-[var(--color-secondarygreen-1)] px-20 py-20 mt-4 relative">
        <LottiePlayer loop={false} play animationData={animationData} style={{ width: 400, height: 400 }} className="z-10" />
        <div className="mt-10 text-4xl font-extrabold text-[var(--color-primarygreen-1)] text-center z-10">Betaling succesvol</div>
        <div className="mt-4 text-2xl text-[var(--color-primarytext-1)] text-center max-w-xl z-10">De locker opent automatisch...</div>
        <div className="flex items-center gap-3 mt-8 z-10">
          <Info size={28} className="text-[var(--color-primarygreen-1)]" />
          <span className="text-lg text-[var(--color-primarytext-1)] font-medium">Blijf je vastzitten op dit scherm? Vraag hulp aan een medewerker!</span>
        </div>
      </div>
    </div>
  );
}
