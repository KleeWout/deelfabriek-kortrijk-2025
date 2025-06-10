"use client";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { MagnifyingGlass, User, CreditCard } from "phosphor-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import animationData from "@/app/tablet/ophaal-flow/pay/Animation - 1748702795819.json";
import Stepper, { TabletHeader } from "@/components/tabletHeader";
import { createPayconiqPayment, checkPaymentStatus } from "@/services/payconiq";

const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

export default function ReservationPayPage() {
  const router = useRouter();
  const { id } = useParams();
  const [reservationData, setReservationData] = useState<any>(null);
  // Use the reservation data to get the amount if available, otherwise fallback to test amount
  const [amount, setAmount] = useState(0.1); // Tijdelijk testbedrag van 10 cent
  const [paid, setPaid] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [paymentId, setPaymentId] = useState<string>("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Get reservation data from localStorage when component mounts
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("reservationDetails");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setReservationData(parsedData);
        console.log("Retrieved payment details:", parsedData);

        // Update the payment amount if available in the reservation data
        if (parsedData.totalPrice) {
          setAmount(parsedData.totalPrice);
        }
      } else {
        console.error("No payment details found in localStorage");
      }
    } catch (error) {
      console.error("Error parsing payment details:", error);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    const initializePayment = async () => {
      try {
        // Only proceed if we have reservationData
        if (!reservationData) {
          return; // Exit early if no data yet
        }

        const reservationId = reservationData?.pickupCode || "unknown";
        // const payment = await createPayconiqPayment(amount, `Deelfabriek Kortrijk - Reservatie #${reservationId}`);
        // setQrCode(payment._links.qrcode.href + "&s=XL&f=PNG");
        // setPaymentId(payment.paymentId);
      } catch (error) {
        console.error("Failed to initialize payment:", error);
      }
    };

    initializePayment();
  }, [amount, id, reservationData]); // reservationData as a dependency, runt pas als localdata is ingeladen

  useEffect(() => {
    if (paymentId) {
      let checkCount = 0;
      const maxChecks = 30; // 1 minute maximum (2 seconds * 30)

      const checkPayment = async () => {
        try {
          const status = await checkPaymentStatus(paymentId);
          if (status === "SUCCEEDED") {
            setPaid(true);
          } else if (status === "CANCELLED" || status === "EXPIRED" || status === "FAILED") {
            setIsCancelled(true);
            if (status === "EXPIRED") {
              setSessionExpired(true);
            }
          }
        } catch (error) {
          console.error("Failed to check payment status:", error);
          // If we can't check the status, assume it's cancelled
          setIsCancelled(true);
        }
      };

      const interval = setInterval(() => {
        checkCount++;
        if (checkCount >= maxChecks) {
          clearInterval(interval);
          setSessionExpired(true);
          setIsCancelled(true);
        } else {
          checkPayment();
        }
      }, 2000); // Check every 2 seconds

      return () => clearInterval(interval);
    }
  }, [paymentId]);

  useEffect(() => {
    if (paid) {
      // Store more detailed payment confirmation
      localStorage.setItem(
        "paymentConfirmation",
        JSON.stringify({
          confirmed: true,
          timestamp: new Date().toISOString(),
          pickupCode: reservationData?.pickupCode,
          amount: amount,
        })
      );

      const t = setTimeout(() => {
        // Pass the pickup code from the reservation data if available
        router.push(`/tablet/payment/locker-open`);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [paid, id, router, reservationData]);

  useEffect(() => {
    if (isCancelled) {
      const t = setTimeout(() => {
        router.back();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [isCancelled, router]);

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setIsCancelled(true);
  };

  const closeCancelConfirm = () => {
    setShowCancelConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#f3f6f8] flex flex-col">
      {/* Header with stepper */}
      <TabletHeader />

      {/* Main content */}
      <div className="flex flex-1 justify-center items-center p-4">
        <div className="w-full max-w-[640px] min-h-[640px] bg-white rounded-xl shadow-xl flex flex-col">
          {/* Card header */}
          <div className="flex justify-between items-center bg-primarygreen-1 rounded-t-xl px-8 py-4">
            <span className="text-xl font-bold text-white">Te betalen</span>
            <span className="text-xl font-bold text-white">€{amount.toFixed(2)}</span>
          </div>

          {/* Content */}
          {!paid && !isCancelled ? (
            <div className="flex flex-col items-center justify-start px-8 py-10 gap-8 flex-1 border-2 border-primarygreen-1">
              <div className="flex items-center gap-6 w-full mb-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <Image src="/payconiq.png" alt="Payconiq" width={60} height={30} className="object-contain" />
                <span className="text-lg text-gray-800 font-medium">
                  Gebruik de Payconiq by Bancontact app
                  <br />
                  om je betaling te voltooien
                </span>
              </div>

              {/* QR-code */}
              <div className="flex flex-col items-center">
                <div className="text-gray-500 text-sm mb-2">Scan deze QR-code met je app</div>
                {qrCode ? (
                  <div className="border-2 border-gray-300 w-56 h-56 rounded-xl flex items-center justify-center overflow-hidden shadow-md">
                    <Image src={qrCode} alt="Payment QR Code" width={224} height={224} className="object-contain" />
                  </div>
                ) : (
                  <div className="border-2 border-gray-300 w-56 h-56 rounded-xl flex items-center justify-center shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primarygreen-1"></div>
                  </div>
                )}
                <div className="text-sm text-gray-500 mt-3 italic">Wacht tot de betaling is voltooid</div>
              </div>

              <button className="w-full max-w-[300px] py-4 mt-4 rounded-lg border-2 border-primarygreen-1 text-primarygreen-1 text-lg font-bold bg-white hover:bg-[var(--color-primarygreen-1)] hover:text-white transition-all" onClick={handleCancel}>
                Annuleren
              </button>
              <button className="w-full max-w-[300px] py-4 mt-4 rounded-lg border-2 border-primarygreen-1 text-primarygreen-1 text-lg font-bold bg-white hover:bg-[var(--color-primarygreen-1)] hover:text-white transition-all" onClick={() => setPaid(true)}>
                Doorgaan (Testing only)
              </button>
            </div>
          ) : isCancelled ? (
            <div className="flex flex-col items-center justify-center px-12 py-16 gap-10 flex-1">
              <div className="text-3xl font-bold text-red-600 text-center">{sessionExpired ? "Sessie verlopen" : "Transactie geannuleerd"}</div>
              <div className="text-lg text-gray-700 text-center">{sessionExpired ? "De betalingssessie is verlopen. Probeer het opnieuw." : "Je wordt zo teruggestuurd..."}</div>
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

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Betaling annuleren?</h3>
            <p className="text-gray-600 mb-6">Weet je zeker dat je de betaling wilt annuleren? Je kunt later opnieuw proberen te betalen.</p>
            <div className="flex gap-4">
              <button onClick={closeCancelConfirm} className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50">
                Terug
              </button>
              <button onClick={confirmCancel} className="flex-1 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700">
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
