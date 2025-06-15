"use client";
import Image from "next/image";
import { LockOpen, CheckCircle, House, CircleNotch } from "phosphor-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";

import { markReservationAsPaid, ReservationResponse } from "../../../api/reservations";

export default function LockerOpenPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<ReservationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        setIsLoading(true);

        // Get the reservation details from localStorage
        const storedReservationDetails = localStorage.getItem("reservationDetails");
        if (!storedReservationDetails) {
          setError("No reservation details found. Please try again.");
          return;
        }

        // Parse the stored payment details
        const reservationDetails = JSON.parse(storedReservationDetails);
        console.error("Retrieved reservation details from localStorage:", reservationDetails);

        // Use the pickupCode from localStorage data
        const pickupCode = reservationDetails.pickupCode;
        if (!pickupCode) {
          setError("Invalid payment details. Missing pickup code.");
          return;
        }

        // Check if we've already processed this payment by looking for a flag in sessionStorage
        const paymentProcessed = sessionStorage.getItem(`payment_processed_${pickupCode}`);
        if (paymentProcessed) {
          console.log("Payment already processed, skipping API call");
          const cachedData = JSON.parse(sessionStorage.getItem(`payment_data_${pickupCode}`) || "null");
          if (cachedData) {
            setPaymentData(cachedData);
          }
          setIsLoading(false);
          return;
        }

        // Call the API to mark the reservation as paid
        const data = await markReservationAsPaid(pickupCode);
        setPaymentData(data);
        console.log("Payment confirmation data from API:", data);

        // Store a flag in sessionStorage to prevent duplicate API calls
        sessionStorage.setItem(`payment_processed_${pickupCode}`, "true");
        sessionStorage.setItem(`payment_data_${pickupCode}`, JSON.stringify(data));

        // After successful API call, remove the items from localStorage
        localStorage.removeItem("reservationDetails");
        localStorage.removeItem("paymentConfirmation");
      } catch (error) {
        console.error("Error fetching reservation data:", error);
        setError("Failed to load locker information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservationData();
  }, []);
  const lockerNumber = paymentData?.lockerNumber || "---";
  const reservationCode = paymentData?.pickupCode || "------";

  // Format loan end date if available
  const formattedLoanEnd = paymentData?.loanEnd ? format(new Date(paymentData.loanEnd), "dd/MM/yyyy") : "---";

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f6f8]">
        <div className="flex flex-col items-center justify-center">
          <CircleNotch size={64} weight="bold" className="text-[var(--color-primarygreen-1)] animate-spin mb-4" />
          <p className="text-xl font-medium text-gray-700">Locker wordt geopend...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f6f8]">
        <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col items-center">
          <div className="mb-8 text-red-600 text-xl font-bold">{error}</div>
          <button onClick={() => router.push("/kiosk")} className="flex items-center gap-2 bg-[var(--color-primarygreen-1)] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#007260] transition-colors">
            <House size={24} weight="bold" />
            Terug naar startpagina
          </button>
        </div>
      </div>
    );
  }

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
          <div className="w-full max-w-md bg-[#e6f0f2] border-2 border-[var(--color-primarygreen-1)] rounded-2xl p-8 mb-6">
            <div className="text-2xl font-bold text-[var(--color-primarygreen-1)] text-center mb-4">Je Reservatiecode</div>
            <div className="text-4xl font-extrabold tracking-widest text-gray-900 text-center mb-4">{reservationCode.split("").join(" ")}</div>
            <div className="text-base text-gray-700 text-center">Deze code is ook verzonden naar je e-mailadres</div>
          </div>

          {/* Loan End Date */}
          <div className="text-xl text-gray-800 text-center mb-6">
            Inleveren vóór: <span className="font-bold">{formattedLoanEnd}</span>
          </div>

          {/* Display item name if available */}
          {(paymentData?.item?.title || paymentData?.itemTitle) && (
            <div className="text-xl text-gray-800 text-center mb-8">
              Item: <span className="font-bold">{paymentData.item?.title || paymentData.itemTitle}</span>
            </div>
          )}

          {/* Home Button */}
          <button onClick={() => router.push("/kiosk")} className="flex items-center gap-2 bg-[var(--color-primarygreen-1)] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#007260] transition-colors">
            <House size={24} weight="bold" />
            Terug naar startpagina
          </button>
        </div>
      </div>
    </div>
  );
}
