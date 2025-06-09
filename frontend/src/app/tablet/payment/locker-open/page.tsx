"use client";
import Image from "next/image";
import { LockOpen, CheckCircle, House } from "phosphor-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LockerOpenPage() {
  const router = useRouter();
  // var voor state van in lcoalstorage
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Clean up payment data once we've reached the locker page
    const paymentConfirmation = localStorage.getItem("paymentDetails");

    if (paymentConfirmation) {
      try {
        // Parse the JSON data and store it in state
        const parsedData = JSON.parse(paymentConfirmation);
        setPaymentData(parsedData);
        console.log("Payment confirmation data stored in state", parsedData);
      } catch (error) {
        console.error("Error parsing payment confirmation data:", error);
      }


      //remove localStorage items after storing in state
      const t = setTimeout(() => {
        localStorage.removeItem("paymentConfirmation");
        localStorage.removeItem("paymentDetails");
        localStorage.removeItem("reservationDetails");
      }, 20000); // Clean up after 20s

      return () => clearTimeout(t);
    }
  }, []);

  const lockerNumber = paymentData?.lockerNumber || "---";
  const reservationCode = paymentData?.pickupCode || "------";

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
          <div className="text-4xl font-extrabold text-[var(--color-primarygreen-1)] text-center mb-4">Locker {lockerNumber} is geopend</div>

          {/* Subtext */}
          <div className="text-xl text-gray-700 text-center mb-12 max-w-2xl">Neem je item uit de locker en sluit deze goed af. Bewaar je reservatiecode goed, je hebt deze nodig om je item terug te brengen.</div>

          {/* Reservation Code Card */}
          <div className="w-full max-w-md bg-[#e6f0f2] border-2 border-[var(--color-primarygreen-1)] rounded-2xl p-8 mb-10">
            <div className="text-2xl font-bold text-[var(--color-primarygreen-1)] text-center mb-4">Je Reservatiecode</div>
            <div className="text-4xl font-extrabold tracking-widest text-gray-900 text-center mb-4">{reservationCode.split("").join(" ")}</div>
            <div className="text-base text-gray-700 text-center">Deze code is ook verzonden naar je e-mailadres</div>
          </div>

          {/* Display item name if available */}
          {paymentData?.item?.title && (
            <div className="text-xl text-gray-800 text-center mb-8">
              Item: <span className="font-bold">{paymentData.item.title}</span>
            </div>
          )}

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
