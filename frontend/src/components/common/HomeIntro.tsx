"use client";

import React from "react";
import Image from "next/image";
import InfoCard from "@/components/mobile/InfoCard";
import Link from "next/link";
import { Package, Key } from "phosphor-react";

export default function HomeIntro() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <div className="w-full md:p-12 flex flex-col items-center gap-6">
        <Image src="/deelfabriek-website-labels-boven_v2.svg" alt="Deelfabriek Logo" width={360} height={100} className="drop-shadow-lg" />
        <h1 className="md:text-6xl font-extrabold text-[var(--color-primarygreen-1)] text-center tracking-tight">Deelkast</h1>
        <p className="text-base md: text-center text-[var(--color-primarytext-1)] max-w-2xl">Slim delen begint hier. Bij de Deelkast kan je snel en makkelijk spullen lenen via onze kast. Meld je aan, kies een item en haal het op bij de locker - 100% selfservice.</p>
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          <Link href="/kiosk/items" className="flex items-center gap-2 bg-[var(--color-primarygreen-1)] text-white text-base md: font-semibold rounded-xl px-6 md:px-10 py-3 md:py-4 shadow-lg hover:bg-[#005c45] transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-primarygreen-1)]">
            <Package size={24} />
            Items bekijken & reserveren
          </Link>
          <Link href="/kiosk/code" className="flex items-center gap-2 bg-[var(--color-primarygreen-1)] text-white text-base md: font-semibold rounded-xl px-6 md:px-10 py-3 md:py-4 shadow-lg hover:bg-[#005c45] transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-primarygreen-1)]">
            <Key size={24} />
            Ophalen of Terugbrengen
          </Link>
        </div>
        <span className="text-lg md:text-2xl font-semibold text-[var(--color-primarygreen-1)] whitespace-nowrap text-center">Hoe het werkt</span>
        <section className="flex flex-col md:flex-row w-full  gap-6 items-stretch">
          {[
            {
              number: 1,
              title: "Ontdek & Reserveer",
              description: "Blader door onze collectie van items die momenteel beschikbaar zijn in de locker. Van naaimachines tot tuingereedschap - vind wat je nodig hebt en reserveer.",
            },
            {
              number: 2,
              title: "Betaal bij afhaling",
              description: "Betaal veilig online met Payconiq. Geen gedoe met contant geld - alles gebeurt digitaal en supersnel.",
            },
            {
              number: 3,
              title: "Ontvang je code",
              description: "Krijg meteen een unieke toegangscode per e-mail. Deze code geeft je toegang tot jouw gereserveerde item.",
            },
            {
              number: 4,
              title: "Haal op",
              description: "Ga naar de kast, voer je code in op de tablet en pak je item uit het juiste vakje.",
            },
            {
              number: 5,
              title: "Gebruik & breng terug",
              description: "Geniet van je geleende item en breng het op tijd terug. Deel je ervaring via de tablet - zo helpen we elkaar!",
            },
          ].map((card) => (
            <div key={card.number} className="flex-1 md:basis-1/5 flex">
              <InfoCard number={card.number} title={card.title} description={card.description} className="w-full h-full" />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
