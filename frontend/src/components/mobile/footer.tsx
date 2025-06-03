import Image from "next/image";
import { Clock, EnvelopeSimple, House, MapPin, Phone } from "phosphor-react";

export default function Footer() {
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
          <ul className="space-y-1">
            <li>ma: 13:00–16:00</li>
            <li>di: Gesloten</li>
            <li>woe: 9:30–16:30</li>
            <li>do: 9:00–12:00</li>
            <li>vr: 13:30–18:00</li>
            <li>za: Gesloten</li>
            <li>zo: Gesloten</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
