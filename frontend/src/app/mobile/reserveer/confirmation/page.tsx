"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navigation from "@/components/mobile/nav";
import { format, addDays } from "date-fns";
import {
  Note,
  EnvelopeSimple,
  Key,
  User,
  Package,
  CalendarCheck,
  CalendarX,
  CurrencyEur,
  DeviceMobile,
} from "phosphor-react";
import Footer from "@/components/mobile/footer";
import { clearReservationData } from "@/utils/storage";

// Move this component to use the search params
function ReservationContent() {
  const router = useRouter();
  const [reservationDetails, setReservationDetails] = useState({
    code: "",
    locker: "",
    name: "",
    item: "",
    pickupDate: new Date(),
    returnDate: new Date(),
    price: "",
  });

  // Flag to prevent flashing content before redirect
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    console.log("Confirmation page mounted, checking localStorage");
    // Get reservation data from localStorage
    const storedData = localStorage.getItem("reservationDetails");

    if (storedData) {
      try {
        const reservationResponse = JSON.parse(storedData);
        console.log("Found reservation data:", reservationResponse);

        if (!reservationResponse || !reservationResponse.pickupCode) {
          console.error("Invalid reservation data structure");
          // Delay redirect to avoid abrupt navigation

          const timer = setTimeout(() => router.push("/mobile/items"), 500);
          return () => clearTimeout(timer);
        }

        // Parse the pickup deadline date
        const pickupDeadline = new Date(reservationResponse.pickupDeadline);

        // Format the data for display
        setReservationDetails({
          code: reservationResponse.pickupCode.toString(),
          locker: reservationResponse.lockerId.toString(),
          name: reservationResponse.personName,
          item: reservationResponse.itemName,
          pickupDate: new Date(), // Today
          returnDate: pickupDeadline,
          price: reservationResponse.totalPrice.toFixed(2),
        });

        // Mark that we have valid data
        setHasData(true);

        // Clear the data from localStorage after retrieving it
        // But with a delay to ensure the component has fully mounted
        const timer = setTimeout(() => {
          clearReservationData();
          console.log("Reservation data cleared from localStorage");
        }, 2000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error parsing reservation details:", error);
        // Delay redirect to avoid abrupt navigation

        const timer = setTimeout(() => router.push("/mobile/items"), 500);
        return () => clearTimeout(timer);
      }
    } else {
      console.log("No reservation data found in localStorage");
      // Delay redirect to avoid abrupt navigation

      const timer = setTimeout(() => router.push("/mobile/items"), 500);
      return () => clearTimeout(timer);
    }
  }, [router]);

  const formatDate = (date: Date) => {
    return format(date, "HH:mm 'op' dd/MM/yyyy");
  };

  // Show loading skeleton if we don't have data yet - prevents flashing content before redirect
  if (!hasData) {
    return <ReservationSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-primarygreen-1 mb-2">
        Reservering Bevestigd!
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Uw locker is succesvol gereserveerd
      </p>
      <div className="bg-primarygreen-1 text-white p-6 rounded-lg mb-6">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-2">Ophaal code</h2>
          <div className="text-5xl font-bold tracking-[0.3em] mb-2">
            {reservationDetails.code}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center text-primarygreen-1 bg-primarygreen-2/20 p-3 rounded-lg mb-6">
        <EnvelopeSimple size={20} className="mr-2" />
        <p className="font-medium">
          Er is een bevestigingsmail verstuurd met jouw ophaalcode
        </p>
      </div>
      <div className="flex items-center justify-center text-red-800 bg-red-100 p-3 rounded-lg mb-6 border border-red-300">
        <CalendarX size={20} className="mr-2" />
        <p className="font-medium">
          Haal je item op voor de deadline, anders vervalt je reservatie!
        </p>
      </div>
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-8 flex-shrink-0">
              <Key size={20} className="text-primarygreen-1" />
            </div>
            <span className="font-bold">Locker:</span>
            <span className="ml-2">{reservationDetails.locker}</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 flex-shrink-0">
              <User size={20} className="text-primarygreen-1" />
            </div>
            <span className="font-bold">Naam:</span>
            <span className="ml-2">{reservationDetails.name}</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 flex-shrink-0">
              <Package size={20} className="text-primarygreen-1" />
            </div>
            <span className="font-bold">Item:</span>
            <span className="ml-2">{reservationDetails.item}</span>
          </div>{" "}
          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 mt-0.5">
              <CalendarCheck size={20} className="text-primarygreen-1" />
            </div>
            <div className="flex flex-col">
              <div className="flex gap-2">
                <span className="font-bold">
                  Uw reservering is geldig tot en met:
                </span>
                <span className="text-red-600 font-medium">
                  {formatDate(reservationDetails.returnDate)}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                Haal je item op voor deze deadline!
              </span>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 mt-0.5">
              <CalendarX size={20} className="text-primarygreen-1" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold">Betaal bij ophalen</span>
              <span className="text-xs text-gray-500">
                Na betaling krijg je de huurperiode te zien
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 flex-shrink-0">
              <CurrencyEur size={20} className="text-primarygreen-1" />
            </div>
            <span className="font-bold">Betaling:</span>
            <span className="ml-2">
              € {reservationDetails.price} - via Payconiq
            </span>
          </div>
        </div>
      </div>
      <div className="bg-primarygreen-2 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium flex items-center mb-3 gap-2">
          <Note size={20} />
          Instructies voor ophalen:
        </h2>

        <ol className="list-decimal list-inside space-y-3 pl-4">
          <li>Ga naar de deelkast</li>
          <li>Voer ophaalcode {reservationDetails.code} in</li>
          <li>Betaal ter plaatse via qr-code</li>
          <li>Locker opent automatisch</li>
        </ol>
      </div>
      <div className="flex items-center justify-center text-red-700 font-medium gap-2 p-3 bg-red-100 rounded-lg">
        <DeviceMobile size={48} />
        <p>
          Vergeet niet uw telefoon mee te nemen voor de betaling ter plaatse
        </p>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => router.push("/mobile")}
          className="bg-primarygreen-1 text-white py-3 px-8 rounded-lg text-lg font-medium hover:bg-green-800 transition-colors flex items-center gap-2"
        >
          Terug naar Home
        </button>
      </div>
    </div>
  );
}

// Loading fallback
function ReservationSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 bg-primarybackground">
      <div className="h-8 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
      <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded-md mb-6 animate-pulse"></div>
      <div className="bg-gray-200 rounded-lg p-6 mb-6 h-32 animate-pulse"></div>
      <div className="bg-gray-200 rounded-lg p-6 mb-6 h-64 animate-pulse"></div>
      <div className="bg-gray-200 rounded-lg p-6 mb-6 h-40 animate-pulse"></div>
    </div>
  );
}

// Remove unused isLoading state since we're using Suspense now
export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<ReservationSkeleton />}>
        <ReservationContent />
      </Suspense>
      <Footer />
    </div>
  );
}
