"use client";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "phosphor-react";

// Wrapper component that uses searchParams
function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const hasFeedback = searchParams.get("feedback") === "true";
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // This effect handles countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShouldRedirect(true); // Flag for redirect instead of directly navigating
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // This separate effect handles navigation based on the redirect flag
  useEffect(() => {
    if (shouldRedirect) {
      // Use a small timeout to ensure this happens after render is complete
      const redirectTimeout = setTimeout(() => {
        router.push("/tablet");
      }, 100);

      return () => clearTimeout(redirectTimeout);
    }
  }, [shouldRedirect, router]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f6f8]">
      <div className="w-full max-w-4xl mx-auto px-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-12">
            <Image src="/deelfabriek-website-labels-boven_v2.svg" alt="Deelfabriek Logo" width={320} height={120} />
          </div>

          {/* Success Icon */}
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-8">
            <CheckCircle size={64} weight="fill" className="text-[var(--color-primarygreen-1)]" />
          </div>

          {/* Message */}
          <div className="text-center max-w-2xl">
            <h1 className="text-3xl font-bold text-[var(--color-primarygreen-1)] mb-6">{hasFeedback ? "Bedankt voor je feedback!" : "Bedankt voor het uitlenen!"}</h1>
            <p className="text-xl text-gray-700 mb-8">{hasFeedback ? "We waarderen je feedback en zullen deze gebruiken om onze service te verbeteren. We hopen je snel terug te zien bij de Deelfabriek!" : "Bedankt voor het uitlenen van een product bij de Deelfabriek. We hopen je snel terug te zien!"}</p>
          </div>

          {/* Countdown */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">Je wordt over {countdown} seconden doorgestuurd naar het beginscherm...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback UI
function ThankYouPageLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f6f8]">
      <div className="w-full max-w-4xl mx-auto px-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col items-center">
          <div className="mb-12">
            <Image src="/deelfabriek-website-labels-boven_v2.svg" alt="Deelfabriek Logo" width={320} height={120} />
          </div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    </div>
  );
}

// Export the main page component with Suspense
export default function ThankYouPage() {
  return (
    <Suspense fallback={<ThankYouPageLoading />}>
      <ThankYouContent />
    </Suspense>
  );
}
