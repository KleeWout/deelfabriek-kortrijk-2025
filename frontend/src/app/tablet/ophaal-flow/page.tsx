"use client";
import Image from "next/image";
import { CaretLeft, ArchiveBox, Calendar, Info, Star, BookOpen, Users, Question, Calculator, Ruler, Scales, Bag } from "phosphor-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ReturnButton } from "@/components/common/ReturnButton";
import { getGradientClassForBackground } from "@/utils/constants";
import { access } from "fs";

export default function OphaalFlowPage() {
  const router = useRouter();
  const [reservationData, setReservationData] = useState<any>(null);
  // Get reservation data from localStorage when component mounts
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("reservationDetails");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setReservationData(parsedData);
        console.log("Retrieved reservation data:", parsedData);
      } else {
        console.error("No reservation data found in localStorage");
        router.push("/tablet/code");
      }
    } catch (error) {
      console.error("Error parsing reservation data:", error);
      router.push("/tablet/code");
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Use the locker ID as the item ID for gradient, fallback to 1 if not available
  const itemId = reservationData?.lockerId || 1;
  const gradientClass = getGradientClassForBackground(itemId);

  const accesories = Array.isArray(reservationData?.item?.accesories) ? reservationData.item.accesories.join(", ") : reservationData?.item?.accesories || "Geen accessoires";

  return (
    <div className="min-h-screen bg-[var(--color-primarybackground)] flex flex-col px-8 py-6">
      {/* Logo bovenaan */}
      <div className="w-full flex items-center mb-4">
        <Image src="/deelfabriek-website-labels-boven_v2.svg" alt="Deelfabriek Logo" width={180} height={60} className="ml-2" />
      </div>
      {/* Header */}
      <div className="flex items-center mb-6 gap-4">
        <ReturnButton href="/tablet" />
        <div className="w-full flex flex-col items-start  mx-auto max-w-full pl-2">
          <h1 className="text-4xl font-extrabold text-[var(--color-primarygreen-1)] leading-tight mb-0">Ophalen</h1>
          <div className="text-2xl font-bold text-[var(--color-primarygreen-1)] mt-0 mb-1">Gereserveerde items</div>
        </div>
      </div>
      {/* Main content */}
      <div className="flex flex-row justify-center gap-10 w-full items-start" style={{ alignItems: "flex-start" }}>
        {/* Item card */}
        <div className="relative flex-1 bg-white/90 border-2 border-[var(--color-secondarygreen-1)] rounded-2xl shadow-lg flex min-h-[280px] max-h-[440px] max-w-[1000px] p-0 overflow-hidden items-center">
          {/* Foto links */}
          <div className={`flex items-center justify-center bg-white h-full p-8 m-8 min-w-[320px] max-h-[240px] ${gradientClass} rounded-lg`}>
            <Image src="/assets/items/naaimachine.png" alt="Naaimachine" width={260} height={180} className=" object-contain" />
          </div>{" "}
          {/* Info rechts */}
          <div className="flex flex-col flex-1 gap-2 min-w-0 p-8 pr-12 justify-center h-full">
            <div className="text-3xl font-extrabold text-[var(--color-primarygreen-1)] mb-1 leading-tight">{reservationData?.item.title || "Item laden..."}</div>
            <div className="flex items-center gap-2 text-lg text-[var(--color-primarytext-1)] mb-1 whitespace-nowrap">
              Gereserveerd voor{" "}
              <span className="font-bold ml-1">
                {reservationData?.weeks} {reservationData?.weeks > 1 ? "weken" : "week"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-base text-[var(--color-primarytext-1)] mb-1">
              <Calendar size={20} className="text-[var(--color-primarygreen-1)]" />
              <span className="leading-normal pt-[1px]">
                Terugbrengen voor: <span className="font-bold">{new Date(Date.now() + reservationData?.weeks * 7 * 24 * 60 * 60 * 1000).toLocaleDateString("nl-BE")}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-base text-[var(--color-primarytext-1)] mb-1">
              <Calculator size={18} className="text-[var(--color-primarygreen-1)]" />
              <span>
                Pickup Code: <strong>{reservationData?.pickupCode || "------"}</strong>
              </span>
            </div>

            {/* Keep some static description content as fallback */}
            {accesories && (
              <div className="text-base text-[var(--color-primarytext-1)] mb-1 mt-1 flex gap-2">
                <Bag size={20} className="text-[var(--color-primarygreen-1)]" />
                <span className="font-semibold">Accessoires:</span> {accesories}
              </div>
            )}

            {reservationData?.item?.dimensions && (
              <div className="text-base text-[var(--color-primarytext-1)] mb-1 flex gap-2">
                <Ruler size={20} className="text-[var(--color-primarygreen-1)]" />
                <span className="font-semibold">Afmetingen:</span> {reservationData.item.dimensions}
              </div>
            )}

            {reservationData?.item?.weight !== null && reservationData?.item?.weight !== undefined && (
              <div className="text-base text-[var(--color-primarytext-1)] mb-1 flex gap-2">
                <Scales size={20} className="text-[var(--color-primarygreen-1)]" />
                <span>
                  <span className="font-semibold">Gewicht:</span> {reservationData.item.weight} kg
                </span>
              </div>
            )}

            {reservationData?.item?.tip && (
              <div className="text-base text-[var(--color-primarytext-1)] mb-1 mt-1">
                <span className="font-semibold">Tip:</span> {reservationData.item.tip}
              </div>
            )}
          </div>
        </div>
        {/* Overzicht */}
        <div className="w-[340px] bg-white border-2 border-[var(--color-secondarygreen-1)] rounded-2xl p-7 flex flex-col gap-5 shadow-xl min-h-[320px] justify-start">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xl font-bold text-[var(--color-primarygreen-1)]">Overzicht</div>
            <span className="px-3 py-1 rounded-full bg-[var(--color-primarypink-1)] text-white text-base font-semibold">Te betalen</span>
          </div>{" "}
          <div className="flex flex-col gap-1 text-base text-[var(--color-primarytext-1)]">
            <div className="flex justify-between">
              <span>Locker</span>
              <span className="font-bold">{reservationData?.lockerNumber || "--"}</span>
            </div>
            <div className="flex justify-between">
              <span>Reserveringsduur</span>
              <span className="font-bold">1 week</span>
            </div>
            <div className="flex justify-between">
              <span>Code</span>
              <span className="font-bold">{reservationData?.pickupCode || "------"}</span>
            </div>
            <div className="flex justify-between">
              <span>Item</span>
              <span className="font-bold">{reservationData?.item.title || "Item laden..."}</span>
            </div>
          </div>
          <div className="border-t border-[var(--color-secondarygreen-1)] my-1"></div>
          <div className="flex flex-col gap-1 text-base text-[var(--color-primarytext-1)]">
            <div className="flex justify-between font-bold text-lg">
              <span>Totaal te betalen</span>
              <span>€ {reservationData?.totalPrice?.toFixed(2) || "0.00"}</span>
            </div>
          </div>{" "}
          <button
            className="w-full py-4 mt-1 bg-[var(--color-primarygreen-1)] text-white text-xl rounded-lg font-bold shadow hover:bg-[#00664f] transition"
            onClick={() => {
              // Store the reservation data in localStorage before navigating
              if (reservationData) {
                localStorage.setItem("paymentDetails", JSON.stringify(reservationData));
              }
              router.push(`/tablet/payment`);
              // router.push(`/tablet/payment/${reservationData?.pickupCode || 0}`);
            }}
          >
            Betalen
          </button>
          <div className="flex flex-col items-center mt-1 gap-1">
            <Image src="/payconiq.png" alt="Payconiq" width={80} height={28} className="object-contain" />
            <span className="text-xs text-[var(--color-primarytext-2)]">Scan de QR-code met je Payconiq-app</span>
          </div>
        </div>
      </div>
    </div>
  );
}
