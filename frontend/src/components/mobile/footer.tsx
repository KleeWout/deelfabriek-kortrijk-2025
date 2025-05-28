import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-primarygreen-1 p-4 text-white flex flex-col gap-4">
      <Image
        src="/logo-stadkortrijk.png"
        alt="Kortrijk Logo"
        width="300"
        height="200"
      />
      <div>
        <h3 className="text-lg font-bold">Deelfabriek</h3>
        <p>Rijkswachtstraat 5, 8500 Kortrijk</p>
      </div>
      <div>
        <p className="font-bold">056 27 76 60</p>
        <p className="font-bold">deelfabriek@kortrijk.be</p>
      </div>
      <div>
        <h4 className="text-lg font-bold">Openingsuren Deelfabriek</h4>
        <ul>
          <li className="grid grid-cols-2 gap-2">
            <span>ma:</span>
            <span>13:00–16:00</span>
          </li>
          <li className="grid grid-cols-2 gap-2">
            <span>di:</span>
            <span>Gesloten</span>
          </li>
          <li className="grid grid-cols-2 gap-2">
            <span>woe:</span>
            <span>9:30–16:30</span>
          </li>
          <li className="grid grid-cols-2 gap-2">
            <span>do:</span>
            <span>9:00–12:00</span>
          </li>
          <li className="grid grid-cols-2 gap-2">
            <span>vr:</span>
            <span>13:30–18:00</span>
          </li>
          <li className="grid grid-cols-2 gap-2">
            <span>za:</span>
            <span>Gesloten</span>
          </li>
          <li className="grid grid-cols-2 gap-2">
            <span>zo:</span>
            <span>Gesloten</span>
          </li>
        </ul>
      </div>
    </footer>
  );
}
