'use client';
import Image from 'next/image';
import {
  CaretLeft,
  ArchiveBox,
  Calendar,
  Info,
  Star,
  BookOpen,
  Users,
  Question,
} from 'phosphor-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OphaalFlowPage() {
  const [showInfo, setShowInfo] = useState(false);
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[var(--color-primarybackground)] flex flex-col px-8 py-6">
      {/* Logo bovenaan */}
      <div className="w-full flex items-center mb-4">
        <Image
          src="/deelfabriek-website-labels-boven_v2.svg"
          alt="Deelfabriek Logo"
          width={180}
          height={60}
          className="ml-2"
        />
      </div>
      {/* Header */}
      <div
        className="w-full flex flex-col items-start mb-6"
        style={{
          maxWidth: '1000px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '0.5rem',
        }}
      >
        <h1 className="text-4xl font-extrabold text-[var(--color-primarygreen-1)] leading-tight mb-0">
          Ophalen
        </h1>
        <div className="text-2xl font-bold text-[var(--color-primarygreen-1)] mt-0 mb-1">
          Gereserveerde items
        </div>
      </div>
      {/* Main content */}
      <div
        className="flex flex-row justify-center gap-10 w-full max-w-7xl mx-auto items-start"
        style={{ alignItems: 'flex-start' }}
      >
        {/* Item card */}
        <div className="relative flex-1 bg-white/90 border-2 border-[var(--color-secondarygreen-1)] rounded-2xl shadow-lg flex min-h-[280px] max-h-[440px] max-w-[1000px] p-0 overflow-hidden items-center">
          {/* Foto links */}
          <div className="flex items-center justify-center bg-white h-full p-8 min-w-[320px] max-h-[240px]">
            <Image
              src="/assets/items/naaimachine.png"
              alt="Naaimachine"
              width={260}
              height={180}
              className="rounded-2xl object-contain shadow-lg border border-[var(--color-secondarygreen-1)] bg-white"
            />
          </div>
          {/* Info rechts */}
          <div className="flex flex-col flex-1 gap-2 min-w-0 p-8 pr-12 justify-center h-full">
            <div className="text-3xl font-extrabold text-[var(--color-primarygreen-1)] mb-1 leading-tight">
              Naaimachine
            </div>
            <div className="flex items-center gap-2 text-lg text-[var(--color-primarytext-1)] mb-1 whitespace-nowrap">
              Gereserveerd voor <span className="font-bold ml-1">1 week</span>
              <button
                className="ml-2 text-[var(--color-primarygreen-1)] hover:text-[var(--color-primarypink-1)] focus:outline-none"
                onClick={() => setShowInfo((v) => !v)}
                aria-label="Meer info"
              >
                <Info size={22} weight="bold" />
              </button>
            </div>
            {/* Info-balk met fade-in */}
            <div
              className={`transition-all duration-300 ${showInfo ? 'opacity-100 max-h-20 mb-2' : 'opacity-0 max-h-0 mb-0'} overflow-hidden`}
            >
              <div className="flex items-center gap-2 bg-[var(--color-secondarygreen-1)] text-[var(--color-primarygreen-1)] rounded-lg px-4 py-2 text-base font-semibold w-full min-h-[40px]">
                Je kunt later verlengen op de website
              </div>
            </div>
            <div className="flex items-center gap-2 text-base text-[var(--color-primarytext-1)] mb-1">
              <Calendar
                size={20}
                className="text-[var(--color-primarygreen-1)]"
              />
              <span style={{ lineHeight: '1.5', paddingTop: '1px' }}>
                Terugbrengen voor: <span className="font-bold">12/06/2025</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-base text-[var(--color-primarytext-1)] mb-1">
              <Users size={18} className="text-[var(--color-primarygreen-1)]" />
              <span>Geschikt voor beginners</span>
            </div>
            <div className="text-base text-[var(--color-primarytext-1)] mb-1 mt-1">
              <span className="font-semibold">Accessoires:</span> 5 spoeltjes,
              Naaldenset, Beschermhoes
            </div>
            <div className="text-base text-[var(--color-primarytext-1)] mb-1">
              <span className="font-semibold">Afmetingen:</span> 45 x 21 x 30 cm
              &nbsp; <span className="font-semibold">Gewicht:</span> 7,5 kg
            </div>
            <div className="text-base text-[var(--color-primarytext-1)] mb-1">
              <span className="font-semibold">Tip:</span> Gebruik altijd de
              juiste naald voor het type stof dat je naait om beschadiging te
              voorkomen.
            </div>
          </div>
          {/* Terug button linksonder */}
          <div className="absolute left-8 bottom-8">
            <button className="flex items-center gap-2 px-5 py-2 border-2 border-[var(--color-primarygreen-1)] rounded-lg text-[var(--color-primarygreen-1)] font-semibold hover:bg-[var(--color-primarygreen-2)] transition shadow text-lg">
              <CaretLeft size={24} weight="bold" />
              <span className="font-bold">Terug</span>
            </button>
          </div>
        </div>
        {/* Overzicht */}
        <div className="w-[340px] bg-white border-2 border-[var(--color-secondarygreen-1)] rounded-2xl p-7 flex flex-col gap-5 shadow-xl min-h-[320px] justify-start">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xl font-bold text-[var(--color-primarygreen-1)]">
              Overzicht
            </div>
            <span className="px-3 py-1 rounded-full bg-[var(--color-primarypink-1)] text-white text-base font-semibold">
              Te betalen
            </span>
          </div>
          <div className="flex flex-col gap-1 text-base text-[var(--color-primarytext-1)]">
            <div className="flex justify-between">
              <span>Locker</span>
              <span className="font-bold">02</span>
            </div>
            <div className="flex justify-between">
              <span>Reserveringsduur</span>
              <span className="font-bold">1 week</span>
            </div>
            <div className="flex justify-between">
              <span>Terugbrengen voor</span>
              <span className="font-bold">12/06/2025</span>
            </div>
            <div className="flex justify-between">
              <span>Item</span>
              <span className="font-bold">Naaimachine</span>
            </div>
          </div>
          <div className="border-t border-[var(--color-secondarygreen-1)] my-1"></div>
          <div className="flex flex-col gap-1 text-base text-[var(--color-primarytext-1)]">
            <div className="flex justify-between font-bold text-lg">
              <span>Totaal te betalen</span>
              <span>€15.00</span>
            </div>
          </div>
          <button
            className="w-full py-4 mt-1 bg-[var(--color-primarygreen-1)] text-white text-xl rounded-lg font-bold shadow hover:bg-[#00664f] transition"
            onClick={() => router.push('/tablet/payment/4')}
          >
            Betalen
          </button>
          <div className="flex flex-col items-center mt-1 gap-1">
            <Image
              src="/payconiq.png"
              alt="Payconiq"
              width={80}
              height={28}
              className="object-contain"
            />
            <span className="text-xs text-[var(--color-primarytext-2)]">
              Scan de QR-code met je Payconiq-app
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
