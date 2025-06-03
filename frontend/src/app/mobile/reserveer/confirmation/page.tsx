"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navigation from "@/components/mobile/nav";
import itemsDetails from "@/data/itemDetails.json";
import { format, addDays } from "date-fns";
import { Note, EnvelopeSimple, Key, User, Package, CalendarCheck, CalendarX, CurrencyEur, DeviceMobile } from "phosphor-react";
import Footer from "@/components/mobile/footer";

// Move this component to use the search params
function ReservationContent() {
  const searchParams = useSearchParams();
  const id = parseInt(searchParams.get("id") || "0");
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

  // Get item details from json
  const item = itemsDetails.find((item) => item.id === id);

  useEffect(() => {
    // dummy data --> later api call
    if (item) {
      const pickupDate = new Date();
      const returnDate = addDays(pickupDate, 7); // 1 week

      setReservationDetails({
        code: "324568",
        locker: "02",
        name: "Jan Appelmans",
        item: item.title,
        pickupDate: pickupDate,
        returnDate: returnDate,
        price: item.price.toFixed(2),
      });
    } else {
      // Redirect als ID niet geldig is
      router.push("/mobile");
    }
  }, [id, item, router]);

  const formatDate = (date: Date) => {
    return format(date, "HH:mm 'op' dd/MM/yyyy");
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-primarybackground">
      <h1 className="text-3xl font-bold text-center text-primarygreen-1 mb-2">Reservering Bevestigd!</h1>
      <p className="text-center text-gray-600 mb-6 fontse">Uw locker is succesvol gereserveerd</p>

      <div className="bg-primarygreen-1 text-white p-6 rounded-lg mb-6">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-2">Ophaal code</h2>
          <div className="text-5xl font-bold tracking-[0.3em] mb-2">{reservationDetails.code}</div>
        </div>
      </div>

      <div className="flex items-center justify-center text-primarygreen-1 bg-primarygreen-2/20 p-3 rounded-lg mb-6">
        <EnvelopeSimple size={20} className="mr-2" />
        <p className="font-medium">Er is een bevestigingsmail verstuurd</p>
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
          </div>

          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 mt-0.5">
              <CalendarCheck size={20} className="text-primarygreen-1" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold">Ophalen voor:</span>
              <span>{formatDate(reservationDetails.pickupDate)}</span>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-8 flex-shrink-0 mt-0.5">
              <CalendarX size={20} className="text-primarygreen-1" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold">Terugbrengen voor:</span>
              <span>{formatDate(reservationDetails.returnDate)}</span>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-8 flex-shrink-0">
              <CurrencyEur size={20} className="text-primarygreen-1" />
            </div>
            <span className="font-bold">Betaling:</span>
            <span className="ml-2">€ {reservationDetails.price} - via Payconiq</span>
          </div>
        </div>
      </div>

      <div className="bg-primarygreen-2 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium flex items-center mb-3 gap-2">
          <Note size={20} />
          Instructies voor ophalen:
        </h2>

        <ol className="list-decimal list-inside space-y-3 pl-4">
          <li>Ga naar locker {reservationDetails.locker}</li>
          <li>Voer ophaalcode {reservationDetails.code} in</li>
          <li>Betaal ter plaatse via qr-code</li>
          <li>Locker opent automatisch</li>
        </ol>
      </div>

      <div className="flex items-center justify-center text-red-700 font-medium gap-2 p-3 bg-red-100 rounded-lg">
        <DeviceMobile size={48} />
        <p>Vergeet niet uw telefoon mee te nemen voor de betaling ter plaatse</p>
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
