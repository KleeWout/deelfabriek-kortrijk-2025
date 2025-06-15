"use client";
import Image from "next/image";
import { Clock, EnvelopeSimple, Phone, MapPin } from "phosphor-react";
import { useOpeningsHours } from "@/context/OpeningHoursContext";

// Format time from "08:00:00" to "08:00"
const formatTime = (time: string | null): string =>
  time ? time.substring(0, 5) : "";

// Combine morning and afternoon hours
const getDisplayHours = (day: any): string => {
  if (!day.open) return "Gesloten";
  const ochtend =
    day.openTimeMorning && day.closeTimeMorning
      ? `${formatTime(day.openTimeMorning)}–${formatTime(day.closeTimeMorning)}`
      : "";
  const middag =
    day.openTimeAfternoon && day.closeTimeAfternoon
      ? `${formatTime(day.openTimeAfternoon)}–${formatTime(day.closeTimeAfternoon)}`
      : "";

  return [ochtend, middag].filter(Boolean).join(", ") || "Gesloten";
};

const englishToDutch: { [key: string]: string } = {
  Monday: "Maandag",
  Tuesday: "Dinsdag",
  Wednesday: "Woensdag",
  Thursday: "Donderdag",
  Friday: "Vrijdag",
  Saturday: "Zaterdag",
  Sunday: "Zondag",
};

const dayOrder = [
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
  "Zondag",
];

// Component for displaying opening hours
const OpeningHoursList = ({ loading, error, hours }: any) => {
  if (loading)
    return <p className="text-center text-sm italic text-white/70">Laden...</p>;
  if (error)
    return (
      <p className="text-center text-sm text-red-400">
        Kon openingsuren niet laden
      </p>
    );

  const mapped = hours.map((day: any) => ({
    ...day,
    idDay: englishToDutch[day.idDay] || day.idDay,
  }));

  const sorted = mapped.sort(
    (a: any, b: any) => dayOrder.indexOf(a.idDay) - dayOrder.indexOf(b.idDay)
  );

  return (
    <ul className="space-y-1 mt-2 text-sm">
      {sorted.map((day: any) => (
        <li
          key={day.idDay}
          className="flex justify-between  pb-1 last:border-none"
        >
          <span className="font-semibold text-white/90">{day.idDay}</span>
          <span className="text-white/80">{getDisplayHours(day)}</span>
        </li>
      ))}
    </ul>
  );
};

export default function Footer() {
  const { openingHours, loading, error } = useOpeningsHours();

  return (
    <footer className="w-full bg-primarygreen-1 text-white py-10 px-6 md:px-16">
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-start justify-between gap-10">
        {/* Kortrijk Logo */}
        <div className="flex-shrink-0">
          <Image
            src="/logo-stadkortrijk.png"
            alt="Kortrijk Logo"
            width={220}
            height={150}
            className="object-contain"
            priority
          />
        </div>

        {/* Deelfabriek + Address with icon */}
        <div className="flex flex-col justify-center min-w-[220px]">
          <h3 className="font-semibold text-lg mb-1">Deelfabriek</h3>
          <address className="not-italic text-sm leading-relaxed whitespace-nowrap flex items-center gap-2">
            <MapPin size={18} />
            Rijkswachtstraat 5, 8500 Kortrijk
          </address>
        </div>

        {/* Phone + Email (stacked) */}
        <div className="flex flex-col justify-center min-w-[180px] space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <Phone size={22} />
            <a href="tel:056277660" className="hover:underline">
              056 27 76 60
            </a>
          </div>
          <div className="flex items-center gap-3">
            <EnvelopeSimple size={22} />
            <a
              href="mailto:deelfabriek@kortrijk.be"
              className="hover:underline"
            >
              deelfabriek@kortrijk.be
            </a>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="flex flex-col justify-start min-w-[240px]">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={28} />
            <h4 className="text-xl font-semibold tracking-wide">
              Openingsuren Deelfabriek
            </h4>
          </div>
          <OpeningHoursList
            loading={loading}
            error={error}
            hours={openingHours}
          />
        </div>
      </div>

      <hr className="border-white/20 my-8" />
      <p className="text-center text-sm text-white/70 select-none">
        © {new Date().getFullYear()} Stad Kortrijk – Alle rechten voorbehouden
      </p>
    </footer>
  );
}
