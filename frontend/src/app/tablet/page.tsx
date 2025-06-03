"use client";
import Image from "next/image";
import { useState } from "react";
import { Question, Backspace, Package } from "phosphor-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MAX_CODE_LENGTH = 6;

export default function TabletPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const handleKeypadClick = (val: string) => {
    if (code.length < MAX_CODE_LENGTH) {
      setCode(code + val);
      setError("");
    }
  };

  const handleDelete = () => {
    setCode(code.slice(0, -1));
    setError("");
  };

  const handleEnter = () => {
    if (code === "999999") {
      router.push("/tablet/return-flow");
      return;
    }
    if (code.length !== MAX_CODE_LENGTH) {
      setError("De code moet 6 cijfers zijn.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }
    if (code === "999998") {
      router.push("/tablet/ophaal-flow");
      return;
    }
    // TODO: Navigatie naar andere pagina
  };

  const handleHelp = () => {
    setError("Vraag hulp aan een medewerker.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-primarybackground)]">
      {/* Linkerzijde */}
      <div className="flex flex-col justify-center items-center basis-1/2 gap-10">
        <div className="flex flex-col items-center gap-6 w-full max-w-[480px]">
          <Image src="/deelfabriek-website-labels-boven_v2.svg" alt="Deelfabriek Logo" width={360} height={100} className="mb-2" />

          <h1 className="text-7xl font-semibold text-[var(--color-primarygreen-1)] mb-8">Deelkast</h1>

          <Link href={"/tablet/reservation-flow"} />
          <Link className="w-full flex justify-center items-center gap-4 max-w-[480px] h-16 bg-[var(--color-primarygreen-1)] text-white text-2xl rounded-lg font-semibold shadow hover:bg-[#00664f] transition" href={"/tablet/items"}>
            <Package size={32} />
            Items bekijken
          </Link>
        </div>
      </div>
      {/* Verticale lijn */}
      <div className="w-px bg-[var(--color-secondarygreen-1)] mx-0 my-16" />
      {/* Rechterzijde */}
      <div className="flex flex-col justify-center items-center basis-1/2 gap-8">
        <div className="flex flex-col w-full max-w-[340px] items-center">
          <div className="text-2xl font-semibold text-[var(--color-primarygreen-1)] mb-1 w-full text-left whitespace-nowrap leading-tight">Ophalen of Terugbrengen</div>
          <div className="text-xl text-[var(--color-primarytext-1)] mb-4 w-full text-left">Geef uw code in</div>
          <div className="mb-8 w-full">
            <input type="text" value={code} readOnly className="text-center text-5xl font-semibold text-[var(--color-primarygreen-1)] border-2 border-[var(--color-primarygreen-1)] rounded-lg w-full h-24 py-4 bg-white mb-2 tracking-widest outline-none" maxLength={MAX_CODE_LENGTH} />
          </div>
          {/* Keypad */}
          <div className="grid grid-cols-3 gap-4 w-full mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button key={n} className="aspect-square w-full text-5xl font-semibold text-[var(--color-primarygreen-1)] border-2 border-[var(--color-primarygreen-1)] rounded-lg bg-white hover:bg-[var(--color-primarygreen-2)] transition flex items-center justify-center" onClick={() => handleKeypadClick(n.toString())} disabled={code.length >= MAX_CODE_LENGTH}>
                {n}
              </button>
            ))}
            {/* Vraagteken knop */}
            <button className="aspect-square w-full flex items-center justify-center border-2 border-[var(--color-primarygreen-1)] rounded-lg bg-[var(--color-primarygreen-1)] hover:bg-[#00664f] transition" onClick={handleHelp}>
              <Question size={40} color="#fff" weight="bold" />
            </button>
            {/* 0 knop */}
            <button className="aspect-square w-full text-5xl font-semibold text-[var(--color-primarygreen-1)] border-2 border-[var(--color-primarygreen-1)] rounded-lg bg-white hover:bg-[var(--color-primarygreen-2)] transition flex items-center justify-center" onClick={() => handleKeypadClick("0")} disabled={code.length >= MAX_CODE_LENGTH}>
              0
            </button>
            {/* Backspace knop */}
            <button className="aspect-square w-full flex items-center justify-center border-2 border-[var(--color-primarygreen-1)] rounded-lg bg-[var(--color-primarygreen-1)] hover:bg-[#00664f] transition" onClick={handleDelete}>
              <Backspace size={40} color="#fff" weight="bold" />
            </button>
          </div>
          <button className="w-full h-16 bg-[var(--color-primarygreen-1)] text-white text-2xl rounded-lg font-semibold shadow hover:bg-[#00664f] transition" onClick={handleEnter}>
            Enter
          </button>
        </div>
        {/* Toast notification */}
        {showToast && <div className="fixed bottom-8 right-8 bg-[var(--color-primarypink-1)] text-white px-6 py-3 rounded-lg shadow-lg text-lg animate-fade-in">{error}</div>}
      </div>
    </div>
  );
}
