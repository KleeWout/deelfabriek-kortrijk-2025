"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navigation from "@/components/mobile/nav";
import itemsDetails from "@/data/itemDetails.json";
import { format, addDays } from "date-fns";
import { Note } from "phosphor-react";
import Footer from "@/components/mobile/footer";

//static data, later via API call
const mockReservationData = {
  code: "324568",
  locker: "02",
  name: "Jan Appelmans",
  pickupDate: new Date(), // Will be formatted in the component
  returnDate: addDays(new Date(), 7),
  price: "15.00",
};

export default function ConfirmationPage() {
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

  const [isLoading, setIsLoading] = useState(true);

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
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 bg-primarybackground">
        <h1 className="text-3xl font-bold text-center text-primarygreen-1 mb-2">Reservering Bevestigd!</h1>
        <p className="text-center text-gray-600 mb-6 fontse">Uw locker is succesvol gereserveerd</p>

        <div className="bg-primarygreen-1 text-white p-6 rounded-lg mb-6">
          <div className="text-center">
            <h2 className="text-lg font-medium mb-2">Ophaal code</h2>
            <div className="text-5xl font-bold tracking-[0.3em] mb-2">{reservationDetails.code}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <span className="font-bold">Locker:</span>
              <span className="ml-2">{reservationDetails.locker}</span>
            </div>

            <div>
              <span className="font-bold">Naam:</span>
              <span className="ml-2">{reservationDetails.name}</span>
            </div>

            <div>
              <span className="font-bold">Item:</span>
              <span className="ml-2">{reservationDetails.item}</span>
            </div>

            <div className="flex flex-col">
              <span className="font-bold">Ophalen voor:</span>
              <span>{formatDate(reservationDetails.pickupDate)}</span>
            </div>

            <div className="flex flex-col">
              <span className="font-bold">Terugbrengen voor:</span>
              <span>{formatDate(reservationDetails.returnDate)}</span>
            </div>

            <div >
              <span className="font-bold">Betaling:</span>
              <span className="ml-2">€ {reservationDetails.price} - via Payconiq</span>
            </div>
          </div>
        </div>

        <div className="bg-primarygreen-2 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium flex items-center mb-3">
            <Note size={20} />
            Instructies voor ophalen:
          </h2>

          <ol className="list-decimal list-inside space-y-3 pl-4">
            <li>Ga naar locker {reservationDetails.locker}</li>
            <li>Voer ophaalcode AB12CD in</li>
            <li>Betaal ter plaatse via qr-code</li>
            <li>Locker opent automatisch</li>
          </ol>
        </div>

        <div className="text-center text-red-700 font-medium">Vergeet niet uw telefoon mee te nemen voor de betaling ter plaatse</div>
      </div>
      <Footer />
    </div>
  );
}
