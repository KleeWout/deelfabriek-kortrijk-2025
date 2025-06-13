"use client";
import { useState } from "react";
import { Question, Backspace } from "phosphor-react";
import { useRouter } from "next/navigation";
import { getReservationByCode } from "@/app/api/reservations";
import { el } from "date-fns/locale";

const MAX_CODE_LENGTH = 6;

export default function TabletCodePage() {
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
  const handleEnter = async () => {
    // Validation
    if (code.length !== MAX_CODE_LENGTH) {
      setError("De code moet 6 cijfers zijn.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }
    try {
      // Use the API function from our centralized API folder
      const reservationData = await getReservationByCode(code);
      console.log("Reservation data:", reservationData);

      // Add your custom property here
      const enhancedReservationData = {
        ...reservationData,
        existingReservation: "true",
      };

      console.log("Enhanced reservation data:", enhancedReservationData);

      // Store enhanced data in localStorage for the next page
      await localStorage.setItem(
        "reservationDetails",
        JSON.stringify(enhancedReservationData)
      );
      if (enhancedReservationData.status === "Not_Active") {
        router.push("/tablet/ophaal-flow");
        console.log(localStorage.getItem("reservationDetails"));
      } else if (enhancedReservationData.status === "Active") {
        console.log(localStorage.getItem("reservationDetails"));
        router.push(`/tablet/return-flow`);
      } else {
        setError("Ongeldige code");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        return;
      }
    } catch (error) {
      console.error("Error fetching reservation data:", error);

      // Handle specific error for invalid codes
      if (error instanceof Error && error.message === "Reservation not found") {
        setError("Ongeldige code. Probeer opnieuw.");
      } else {
        setError("Er is een fout opgetreden. Probeer opnieuw.");
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const handleHelp = () => {
    setError("Vraag hulp aan een medewerker.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-primarybackground)]">
      <div className="flex flex-col w-full max-w-[380px] items-center">
        <div className="text-3xl font-bold text-[var(--color-primarygreen-1)] mb-1 w-full text-center whitespace-nowrap leading-tight">
          Ophalen of Terugbrengen
        </div>
        <div className="text-xl text-[var(--color-primarytext-1)] mb-4 w-full text-center">
          Geef uw code in
        </div>
        <div className="mb-8 w-full">
          <input
            type="text"
            value={code}
            readOnly
            className="text-center text-5xl font-semibold text-[var(--color-primarygreen-1)] border-2 border-[var(--color-primarygreen-1)] rounded-lg w-full h-24 py-4 bg-white mb-2 tracking-widest outline-none"
            maxLength={MAX_CODE_LENGTH}
          />
        </div>
        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 w-full mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              className="aspect-square w-full text-5xl font-semibold text-[var(--color-primarygreen-1)] border-2 border-[var(--color-primarygreen-1)] rounded-lg bg-white hover:bg-[var(--color-primarygreen-2)] transition flex items-center justify-center"
              onClick={() => handleKeypadClick(n.toString())}
              disabled={code.length >= MAX_CODE_LENGTH}
            >
              {n}
            </button>
          ))}
          {/* Vraagteken knop (nu niet-primary) */}
          <button
            className="aspect-square w-full flex items-center justify-center border-2 border-[var(--color-primarygreen-1)] rounded-lg bg-white hover:bg-[var(--color-primarygreen-2)] transition"
            onClick={handleHelp}
          >
            <Question
              size={40}
              className="text-[var(--color-primarygreen-1)]"
              weight="bold"
            />
          </button>
          {/* 0 knop */}
          <button
            className="aspect-square w-full text-5xl font-semibold text-[var(--color-primarygreen-1)] border-2 border-[var(--color-primarygreen-1)] rounded-lg bg-white hover:bg-[var(--color-primarygreen-2)] transition flex items-center justify-center"
            onClick={() => handleKeypadClick("0")}
            disabled={code.length >= MAX_CODE_LENGTH}
          >
            0
          </button>
          {/* Backspace knop (nu niet-primary) */}
          <button
            className="aspect-square w-full flex items-center justify-center border-2 border-[var(--color-primarygreen-1)] rounded-lg bg-white hover:bg-[var(--color-primarygreen-2)] transition"
            onClick={handleDelete}
          >
            <Backspace
              size={40}
              className="text-[var(--color-primarygreen-1)]"
              weight="bold"
            />
          </button>
        </div>
        <button
          className="w-full h-16 bg-[var(--color-primarygreen-1)] text-white text-2xl rounded-lg font-bold shadow hover:bg-[#00664f] transition"
          onClick={handleEnter}
        >
          Enter
        </button>
      </div>
      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-[var(--color-primarypink-1)] text-white px-6 py-3 rounded-lg shadow-lg text-lg animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
}
