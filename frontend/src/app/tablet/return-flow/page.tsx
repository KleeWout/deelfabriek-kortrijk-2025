'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Check, LockOpen, Warning, Star } from 'phosphor-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import StarRating from '../components/StarRating';

const reasons = [
  'Item defect',
  'Item niet zoals verwacht',
  'Item had schade',
  'Item had iets te kort',
  'Batterij leeg',
  'Niet proper',
  'Handleiding ontbrak',
  'Anders',
];

const feedbackOptions = [
  'Product was beschadigd',
  'Product werkte niet goed',
  'Product was niet schoon',
  'Product was niet compleet',
  'Andere reden',
];

export default function ReturnFlow() {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState('');
  const [warning, setWarning] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleReasonToggle = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
      setWarning('');
    } else {
      setSelectedReasons([...selectedReasons, reason]);
      setWarning('');
    }
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
    if (value >= 3) {
      setSelectedReasons([]);
    }
  };

  const handleOptionToggle = (option: string) => {
    setSelectedReasons((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const showReasons = rating > 0 && rating <= 3;
  const showOtherInput = selectedReasons.includes('Anders');
  const lockerNumber = 2;

  // Voorbeeld: deze waarden moeten uit de echte flow/data komen
  const itemName = 'Naaimachine'; // TODO: dynamisch maken
  const reservatieCode = '999999'; // TODO: dynamisch maken

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Geef eerst een beoordeling door sterren aan te klikken');
      return;
    }

    if (rating < 3 && selectedReasons.length === 0) {
      toast.error('Selecteer ten minste één reden voor je lage beoordeling');
      return;
    }

    router.push(
      `/tablet/return-flow/thank-you?feedback=true&item=${encodeURIComponent(itemName)}&code=${encodeURIComponent(reservatieCode)}`
    );
  };

  const handleSkip = () => {
    router.push(
      `/tablet/return-flow/thank-you?feedback=false&item=${encodeURIComponent(itemName)}&code=${encodeURIComponent(reservatieCode)}`
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[var(--color-primarybackground)] py-8">
      {/* Logo bovenaan */}
      <div className="w-full flex justify-center mb-8">
        <Image
          src="/deelfabriek-website-labels-boven_v2.svg"
          alt="Deelfabriek Logo"
          width={260}
          height={70}
        />
      </div>
      <div className="flex flex-1 w-full max-w-7xl mx-auto items-stretch">
        {/* Linkerzijde */}
        <div className="flex flex-col justify-center items-center basis-1/2 gap-8">
          <LockOpen
            size={180}
            color="var(--color-primarygreen-1)"
            weight="bold"
            className="mb-6"
          />
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-[var(--color-primarygreen-1)] text-center whitespace-nowrap mb-2">
              Locker {lockerNumber.toString().padStart(2, '0')} is geopend.
            </span>
            <span className="text-xl text-[var(--color-primarytext-1)] text-center">
              Plaats je item in de locker en sluit de locker.
            </span>
          </div>
        </div>
        {/* Verticale lijn */}
        <div className="w-px bg-[var(--color-secondarygreen-1)] mx-8 my-4" />
        {/* Rechterzijde */}
        <div className="flex flex-col justify-center items-center basis-1/2 gap-12">
          <div className="w-full max-w-[600px] flex flex-col items-start">
            <div className="text-4xl font-bold text-[var(--color-primarygreen-1)] mb-2">
              Laat een beoordeling achter
            </div>
            <div className="text-2xl text-[var(--color-primarytext-1)] mb-8">
              Wat was je ervaring met het item?
            </div>
            {/* Sterren */}
            <div className="flex justify-center gap-2 mb-8">
              <StarRating value={rating} onChange={setRating} />
            </div>
            {/* Redenen bij <=3 sterren */}
            {showReasons && (
              <div className="w-full mb-4 mt-8 animate-fade-in transition-opacity duration-500 opacity-100">
                <div className="flex items-center gap-2 mb-4">
                  <Warning
                    size={28}
                    color="var(--color-primarypink-1)"
                    weight="bold"
                  />
                  <span className="text-xl md:text-2xl font-bold text-[var(--color-primarygreen-1)]">
                    Conditie van het item
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mb-2">
                  {reasons.map((reason) => {
                    const active = selectedReasons.includes(reason);
                    return (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => handleReasonToggle(reason)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full border-2 text-base md:text-lg font-semibold transition-all
                          ${active ? 'bg-[var(--color-primarygreen-1)] text-white border-[var(--color-primarygreen-1)]' : 'bg-white text-[var(--color-primarygreen-1)] border-[var(--color-primarygreen-1)] hover:bg-[var(--color-primarygreen-2)]'}`}
                      >
                        {active && <Check size={20} weight="bold" />}
                        {reason}
                      </button>
                    );
                  })}
                </div>
                {warning && (
                  <div className="text-[var(--color-primarypink-1)] font-semibold mb-2 flex items-center gap-2">
                    <Warning size={20} />
                    {warning}
                  </div>
                )}
                {showOtherInput && (
                  <input
                    type="text"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    placeholder="Schrijf hier je opmerking..."
                    className="w-full mt-4 p-4 border-2 border-[var(--color-secondarygreen-1)] rounded-lg bg-white text-[var(--color-primarytext-1)] text-base md:text-lg"
                  />
                )}
              </div>
            )}
            {/* Knoppen */}
            <div className="flex gap-8 mt-10 w-full">
              <button
                className="flex-1 py-5 bg-[var(--color-primarygreen-1)] text-white text-3xl rounded-lg font-semibold shadow hover:bg-[#00664f] transition"
                disabled={rating === 0}
                onClick={handleSubmit}
              >
                Verzenden
              </button>
              <button
                className="flex-1 py-5 bg-white text-[var(--color-primarygreen-1)] border-2 border-[var(--color-primarygreen-1)] text-3xl rounded-lg font-semibold hover:bg-[var(--color-primarygreen-2)] transition"
                onClick={handleSkip}
              >
                Overslaan
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Na het sluiten van de locker */}
    </div>
  );
}
