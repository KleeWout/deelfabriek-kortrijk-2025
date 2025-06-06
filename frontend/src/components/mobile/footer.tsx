import Image from 'next/image';
import { Clock, EnvelopeSimple, House, MapPin, Phone } from 'phosphor-react';
import { useEffect, useState } from 'react';

const BACKEND_URL =
  'https://api-deelfabriek.woutjuuh02.be/dashboard/openingshours';

export default function Footer() {
  const [openingHours, setOpeningHours] = useState<any[]>([]);

  useEffect(() => {
    fetch(BACKEND_URL)
      .then(async (res) => {
        if (!res.ok) throw new Error('Fout bij ophalen openingsuren');
        const data = await res.json();
        setOpeningHours(data);
      })
      .catch(() => setOpeningHours([]));
  }, []);

  // Helper to format time (e.g. 08:00:00 -> 08:00)
  function formatTime(time: string | null) {
    if (!time) return '';
    return time.slice(0, 5);
  }

  // Helper to format a single day's opening hours
  function formatDay(h: any) {
    if (!h.open) return 'Gesloten';
    const morning =
      h.openTimeMorning && h.closeTimeMorning
        ? `${formatTime(h.openTimeMorning)}–${formatTime(h.closeTimeMorning)}`
        : '';
    const afternoon =
      h.openTimeAfternoon && h.closeTimeAfternoon
        ? `${formatTime(h.openTimeAfternoon)}–${formatTime(h.closeTimeAfternoon)}`
        : '';
    if (morning && afternoon) return `${morning}, ${afternoon}`;
    if (morning) return morning;
    if (afternoon) return afternoon;
    return 'Gesloten';
  }

  // Order for Dutch days
  const days = [
    'Maandag',
    'Dinsdag',
    'Woensdag',
    'Donderdag',
    'Vrijdag',
    'Zaterdag',
    'Zondag',
  ];

  return (
    <footer className="w-full bg-primarygreen-1 p-4 text-white flex flex-col gap-4">
      <Image
        src="/logo-stadkortrijk.png"
        alt="Kortrijk Logo"
        width={300}
        height={200}
      />
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
          <ul className="space-y-1">
            {days.map((day) => {
              const h = openingHours.find((o) => o.idDay === day);
              return (
                <li key={day}>
                  {day.slice(0, 2).toLowerCase()}: {h ? formatDay(h) : '...'}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </footer>
  );
}
