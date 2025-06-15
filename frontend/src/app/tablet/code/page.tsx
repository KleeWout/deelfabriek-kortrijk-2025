"use client";
import { useState } from "react";
import { Question, Backspace } from "phosphor-react";
import { useRouter } from "next/navigation";
import { getReservationByCode } from "@/app/api/reservations";

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
    if (code.length !== MAX_CODE_LENGTH) {
      setError("De code moet 6 cijfers zijn.");
      showTemporaryToast();
      return;
    }

    try {
      const reservationData = await getReservationByCode(code);
      console.log("Fetched reservation data:", reservationData);
      const enhancedReservationData = {
        ...reservationData,
        existingReservation: "true",
      };

      localStorage.setItem(
        "reservationDetails",
        JSON.stringify(enhancedReservationData)
      );

      if (enhancedReservationData.status === "Not_Active") {
        router.push("/tablet/ophaal-flow");
      } else if (enhancedReservationData.status === "Active") {
        router.push("/tablet/return-flow");
      } else {
        setError("Ongeldige code");
        showTemporaryToast();
      }
    } catch (error) {
      console.error("Error fetching reservation data:", error);
      if (error instanceof Error && error.message === "Reservation not found") {
        setError("Ongeldige code. Probeer opnieuw.");
      } else {
        setError("Er is een fout opgetreden. Probeer opnieuw.");
      }
      showTemporaryToast();
    }
  };

  const handleHelp = () => {
    setError("Vraag hulp aan een medewerker.");
    showTemporaryToast();
  };

  const showTemporaryToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="min-h-screen w-screen bg-[var(--color-primarybackground)] px-4 sm:px-6 overflow-auto">
      <div className="flex min-h-screen w-full justify-center">
        <div className="flex flex-col w-full max-w-[420px] py-8 gap-6">
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* --- Titel --- */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-primarygreen-1)]">
                Ophalen of Terugbrengen
              </h1>
              <p className="text-lg sm:text-xl text-[var(--color-primarytext-1)]">
                Geef uw code in
              </p>
            </div>

            {/* --- Code Input --- */}
            <input
              type="text"
              value={code}
              readOnly
              maxLength={MAX_CODE_LENGTH}
              className="text-center text-4xl sm:text-5xl font-semibold text-[var(--color-primarygreen-1)] border-2 border-[var(--color-primarygreen-1)] rounded-lg w-full h-20 sm:h-24 py-3 bg-white tracking-widest outline-none mt-6"
            />

            {/* --- Keypad --- */}
            <div className="grid grid-cols-3 gap-4 w-full mt-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  className="aspect-square w-full text-4xl sm:text-5xl font-semibold text-[var(--color-primarygreen-1)] border-2 border-[var(--color-primarygreen-1)] rounded-lg bg-white hover:bg-[var(--color-primarygreen-2)] transition active:scale-95 flex items-center justify-center"
                  onClick={() => handleKeypadClick(n.toString())}
                  disabled={code.length >= MAX_CODE_LENGTH}
                >
                  {n}
                </button>
              ))}
              <button
                className="aspect-square w-full flex items-center justify-center border-2 border-[var(--color-primarygreen-1)] rounded-lg bg-white hover:bg-[var(--color-primarygreen-2)] transition active:scale-95"
                onClick={handleHelp}
              >
                <Question
                  size={32}
                  className="sm:size-10 text-[var(--color-primarygreen-1)]"
                  weight="bold"
                />
              </button>
              <button
                className="aspect-square w-full text-4xl sm:text-5xl font-semibold text-[var(--color-primarygreen-1)] border-2 border-[var(--color-primarygreen-1)] rounded-lg bg-white hover:bg-[var(--color-primarygreen-2)] transition flex items-center justify-center active:scale-95"
                onClick={() => handleKeypadClick("0")}
                disabled={code.length >= MAX_CODE_LENGTH}
              >
                0
              </button>
              <button
                className="aspect-square w-full flex items-center justify-center border-2 border-[var(--color-primarygreen-1)] rounded-lg bg-white hover:bg-[var(--color-primarygreen-2)] transition active:scale-95"
                onClick={handleDelete}
              >
                <Backspace
                  size={32}
                  className="sm:size-10 text-[var(--color-primarygreen-1)]"
                  weight="bold"
                />
              </button>
            </div>

            {/* --- Enter knop --- */}
            <button
              className="w-full h-14 sm:h-16 bg-[var(--color-primarygreen-1)] text-white text-xl sm:text-2xl rounded-lg font-bold shadow hover:bg-[#00664f] transition active:scale-95 mt-6"
              onClick={handleEnter}
            >
              Enter
            </button>
          </div>

          {/* --- Toast --- */}
          {showToast && (
            <div className="fixed bottom-6 sm:bottom-8 right-4 sm:right-8 bg-[var(--color-primarypink-1)] text-white px-5 py-3 rounded-lg shadow-lg text-base sm:text-lg animate-fade-in">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
