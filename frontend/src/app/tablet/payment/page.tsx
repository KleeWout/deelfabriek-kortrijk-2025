"use client";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import animationData from "@/app/tablet/ophaal-flow/pay/Animation - 1748702795819.json";
import { TabletHeader } from "@/components/tabletHeader";
import { createPayconiqPayment, checkPaymentStatus } from "@/services/payconiq";
import { cancelReservation } from "@/app/api/reservations";

const LottiePlayer = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

export default function ReservationPayPage() {
  const router = useRouter();
  const { id } = useParams();
  const [reservationData, setReservationData] = useState<any>(null);
  const [amount, setAmount] = useState(0.1);
  const [paid, setPaid] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [paymentId, setPaymentId] = useState<string>("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [navigatingToConfirmation, setNavigatingToConfirmation] = useState(false);
  const [excistingReservation, setExcistingReservation] = useState(false);
  // Get reservation data from localStorage when component mounts
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("reservationDetails");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.existingReservation === "true") {
          setExcistingReservation(true);
        }

        setReservationData(parsedData);

        // payconiq amount
        if (parsedData.totalPrice) {
          setAmount(parsedData.totalPrice);
        }
      } else {
        console.error("No payment details found in localStorage");
      }
    } catch (error) {
      console.error("Error parsing payment details:", error);
    }
  }, []); // only run once when component mounts

  useEffect(() => {
    const initializePayment = async () => {
      try {
        if (!reservationData) {
          return; // Exit early if no data yet
        }
        const reservationId = reservationData?.pickupCode || "unknown";
        const payment = await createPayconiqPayment(amount, `Deelfabriek Kortrijk - Reservatie #${reservationId}`);
        setQrCode(payment._links.qrcode.href + "&s=XL&f=PNG");
        setPaymentId(payment.paymentId);
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
            console.log(`Payment status changed to: ${status}`);

            // COMMENTED OUT - Reservation cancellation logic for expired/failed payments
            /*
            if (reservationData?.pickupCode) {
              // Remove data from localStorage
              localStorage.removeItem("paymentConfirmation");
              localStorage.removeItem("reservationDetails");
              // Prevent duplicate cancellations
              localStorage.setItem(`cancelled_${reservationData.pickupCode}`, "in_progress");

              cancelReservation(reservationData.pickupCode).then((result) => {
                console.log("Reservation cancelled due to expired payment session:", result);
              });
            }
            */
            console.log("Payment failed/expired/cancelled, but reservation cancellation is temporarily disabled");

            if (status === "EXPIRED") {
              setSessionExpired(true);
            } else if (status === "FAILED" || status === "CANCELLED") {
              // Set a payment failed state
              console.log(`Payment ${status.toLowerCase()} with status:`, status);
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

      // Store a flag in localStorage to indicate payment success
      // This will be checked in cleanup functions to prevent cancellation
      if (reservationData?.pickupCode) {
        localStorage.setItem(`payment_success_${reservationData.pickupCode}`, "true");
        console.log("Payment success flag set in localStorage");
      }

      // Set navigating state immediately before timeout
      setNavigatingToConfirmation(true);
      console.log("Set navigatingToConfirmation to true");

      const t = setTimeout(() => {
        console.log("Navigation timeout triggered, pushing to locker-open");
        // Pass the pickup code from the reservation data if available
        router.push(`/tablet/payment/locker-open`);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [paid, id, router, reservationData, amount]);
  useEffect(() => {
    if (isCancelled) {
      // Cancel the reservation when payment is cancelled or failed
      if (!excistingReservation) {
        if (reservationData?.pickupCode) {
          // Clean up localStorage
          localStorage.removeItem("paymentConfirmation");
          localStorage.removeItem("reservationDetails");

          // Check if already cancelled or in process of cancellation
          const key = `cancelled_${reservationData.pickupCode}`;
          const alreadyCancelled = localStorage.getItem(key);

          if (alreadyCancelled !== "completed" && alreadyCancelled !== "in_progress") {
            localStorage.setItem(key, "in_progress");
            cancelReservation(reservationData.pickupCode).then((result) => {
              if (result.success) {
                console.log("Reservation cancelled successfully");
              } else {
                console.error("Failed to cancel reservation:", result?.error);
              }
            });
          } else {
            console.log(`isCancelled effect: skipping cancelReservation - status is ${alreadyCancelled}`);
          }
        }
      }

      console.log("Payment cancelled, but reservation cancellation is temporarily disabled");

      // Still navigate back when cancelled
      const t = setTimeout(() => {
        router.back();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [isCancelled, router, reservationData]);
  useEffect(() => {
    // Early return if we don't have reservation data yet
    if (!reservationData?.pickupCode) return;

    const isConfirmationPage = (path: string) => typeof path === "string" && path.includes("/tablet/payment/locker-open"); // Define the cancelation function that will be called for any navigation event
    const handleNavigation = (url?: string) => {
      // Skip cancellation if already paid or navigating to confirmation page
      if (paid || navigatingToConfirmation || !reservationData?.pickupCode) {
        return;
      }

      // Check if destination is the confirmation page
      if (url && isConfirmationPage(url)) {
        console.log("Navigating to confirmation page, skipping cancellation");
        setNavigatingToConfirmation(true);
        return;
      }

      console.log("Navigation detected - cancellation temporarily disabled");

      /* COMMENTED OUT - Cancel reservation logic
      console.log("Navigation detected, cancelling reservation");

      // Remove local storage items to clean up
      localStorage.removeItem("paymentConfirmation");
      localStorage.removeItem("reservationDetails");
      // Set the localStorage state to prevent duplicate cancellations
      const key = `cancelled_${reservationData.pickupCode}`;
      const alreadyCancelled = localStorage.getItem(key);

      if (alreadyCancelled !== "completed" && alreadyCancelled !== "in_progress") {
        localStorage.setItem(key, "in_progress");
        // Call the API to cancel the reservation
        cancelReservation(reservationData.pickupCode).then((result) => {
          if (result.success) {
            console.log("Reservation cancelled due to navigation");
          } else {
            console.error("Cancellation result:", result);
          }
        });
      } else {
        console.log(`Skipping cancelReservation - status is ${alreadyCancelled}`);
      }
      */
    };

    // Override history methods to catch programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (data: any, unused: string, url?: string | URL) {
      // Pass the URL to check if it's the confirmation page
      const urlString = url?.toString();
      handleNavigation(urlString);
      return originalPushState.apply(this, [data, unused, url]);
    };

    history.replaceState = function (data: any, unused: string, url?: string | URL) {
      // Pass the URL to check if it's the confirmation page
      const urlString = url?.toString();
      handleNavigation(urlString);
      return originalReplaceState.apply(this, [data, unused, url]);
    };

    // Also handle browser refresh/close with beforeunload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show the confirm dialog, but don't trigger cancellation here
      // The actual cancellation will happen when the page unloads
      if (!paid && !navigatingToConfirmation && reservationData?.pickupCode) {
        e.preventDefault();
        e.returnValue = "Je bent een betaling aan het maken. Weet je zeker dat je wilt annuleren?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Handle browser back button
    const handlePopState = () => {
      if (!navigatingToConfirmation && !paid) {
        handleNavigation();
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      // Clean up by restoring original methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      console.log("Component unmounting, cleanup function running");

      // Check various flags to determine if we should cancel
      const currentUrl = window.location.href;
      const isConfirmationUrl = currentUrl.includes("/tablet/payment/locker-open");
      const isNavigatingToConfirmation = navigatingToConfirmation;
      const isPaidState = paid;

      // Also check the localStorage flag we set earlier
      const paymentSuccessFlag = reservationData?.pickupCode ? localStorage.getItem(`payment_success_${reservationData.pickupCode}`) : null;

      console.log("Status check:", {
        currentUrl,
        isConfirmationUrl,
        isNavigatingToConfirmation,
        isPaidState,
        paymentSuccessFlag,
      });

      // CANCELLATION LOGIC COMMENTED OUT
      /* 
      // Skip cancellation if ANY of these conditions are true
      const shouldSkipCancellation = 
        isConfirmationUrl || 
        isNavigatingToConfirmation || 
        isPaidState || 
        paymentSuccessFlag === "true";
      
      if (shouldSkipCancellation) {
        console.log("Skipping cancellation due to successful payment or navigation to confirmation");
        return; // Exit early without cancelling
      }
      
      // Only proceed with cancellation if we have a pickup code
      if (!reservationData?.pickupCode) {
        console.log("No pickup code available, skipping cancellation");
        return;
      }
      
      // Check if already cancelled or in process of cancellation
      const key = `cancelled_${reservationData.pickupCode}`;
      const alreadyCancelled = localStorage.getItem(key);

      if (alreadyCancelled !== "completed" && alreadyCancelled !== "in_progress") {
        console.log("Component unmounting, cancelling reservation");
        localStorage.setItem(key, "in_progress");
        cancelReservation(reservationData.pickupCode)
          .then(result => {
            console.log("Cancellation result:", result);
            if (result.success) {
              localStorage.setItem(key, "completed");
            }
          })
          .catch(err => console.error("Error cancelling reservation:", err));
      } else {
        console.log(`Component unmounting: skipping cancelReservation - status is ${alreadyCancelled}`);
      }
      */
      console.log("Cancellation on unmount temporarily disabled");
    };
  }, [paid, reservationData, navigatingToConfirmation]);

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };
  const confirmCancel = () => {
    // COMMENTED OUT - Explicit cancellation cleanup logic
    /*
    // When user explicitly cancels, make sure we clean up localStorage immediately
    if (reservationData?.pickupCode) {
      localStorage.removeItem("paymentConfirmation");
      localStorage.removeItem("reservationDetails");

      // Mark as canceled in localStorage to prevent duplicate cancellations
      localStorage.setItem(`cancelled_${reservationData.pickupCode}`, "in_progress");
    }
    */
    console.log("User explicitly cancelled, but reservation cancellation is temporarily disabled");
    setIsCancelled(true);
  };

  const closeCancelConfirm = () => {
    setShowCancelConfirm(false);
  };
  // This effect has been removed since its functionality is already handled in the main navigation effect

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
