import Image from "next/image";
import { Clock, EnvelopeSimple, House, MapPin, Phone } from "phosphor-react";
import { useOpeningsHours } from "@/context/OpeningHoursContext";

// Helper function to format time
const formatTime = (time: string | null): string => {
  if (!time) return "";
  return time.substring(0, 5); // Format "08:00:00" to "08:00"
};

// Helper to get a friendly display of opening hours
const getDisplayHours = (day: any): string => {
  if (!day.open) return "Gesloten";
  
  // Morning hours
  let displayHours = "";
  if (day.openTimeMorning && day.closeTimeMorning) {
    displayHours += `${formatTime(day.openTimeMorning)}–${formatTime(day.closeTimeMorning)}`;
  }
  
  // Afternoon hours
  if (day.openTimeAfternoon && day.closeTimeAfternoon) {
    displayHours += `, ${formatTime(day.openTimeAfternoon)}–${formatTime(day.closeTimeAfternoon)}`;
  }
  
  return displayHours || "Gesloten";
};

// Map API day names to abbreviated display names
const dayNameMap: { [key: string]: string } = {
  "Maandag": "ma",
  "Dinsdag": "di",
  "Woensdag": "woe",
  "Donderdag": "do",
  "Vrijdag": "vr",
  "Zaterdag": "za", 
  "Zondag": "zo"
};

// Correct day order
const dayOrder = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];

export default function Footer() {
  const { openingHours, loading, error } = useOpeningsHours();
  
  // Sort days in correct order
  const sortedHours = openingHours 
    ? [...openingHours].sort((a, b) => 
        dayOrder.indexOf(a.idDay) - dayOrder.indexOf(b.idDay))
    : [];

  return (
    <footer className="w-full bg-primarygreen-1 p-4 text-white flex flex-col gap-4">
      <Image src="/logo-stadkortrijk.png" alt="Kortrijk Logo" width="300" height="200" />
      <div className="flex items-start gap-2 flex-col">
        <div className="flex items-center gap-2">
          <House size={24} />
          <h3 className="text-lg font-bold">Deelfabriek</h3>
        </div>
        <div className="flex items-start gap-2 mt-1">
          <MapPin size={20} />
          <p>Rijkswachtstraat 5, 8500 Kortrijk</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Phone size={20} />
          <p className="font-bold">056 27 76 60</p>
        </div>
        <div className="flex items-center gap-2">
          <EnvelopeSimple size={20} />
          <p className="font-bold">deelfabriek@kortrijk.be</p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Clock size={24} />
        <div>
          <h4 className="text-lg font-bold">Openingsuren Deelfabriek</h4>
          {loading && <p>Laden...</p>}
          {error && <p>Kon openingsuren niet laden</p>}
          {!loading && !error && (
            <ul className="space-y-1">
              {sortedHours.map(day => (
                <li key={day.idDay}>
                  {dayNameMap[day.idDay] || day.idDay}: {getDisplayHours(day)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}