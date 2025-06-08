'use client';

import React from 'react';
import Image from 'next/image';
import InfoCard from '@/components/mobile/InfoCard';
import Link from 'next/link';
import { Package, Key } from 'phosphor-react';

export default function HomeIntro() {
  return (
    <div className="w-full h-screen min-h-screen flex flex-col items-center justify-center bg-[var(--color-primarybackground)] overflow-hidden">
      <div className="flex flex-col items-center w-full max-w-5xl px-8 pt-8 gap-6">
        <Image
          src="/deelfabriek-website-labels-boven_v2.svg"
          alt="Deelfabriek Logo"
          width={360}
          height={100}
          className="mb-2"
        />
        <h1 className="text-6xl font-extrabold text-[var(--color-primarygreen-1)] text-center">
          Deelkast
        </h1>
        <p className="text-2xl text-center text-[var(--color-primarytext-1)] max-w-2xl mb-2">
          Slim delen begint hier. Bij de Deelkast kan je snel en makkelijk
          spullen lenen via onze kast. Meld je aan, kies een item en haal het op
          bij de locker - 100% selfservice.
        </p>
        <div className="flex flex-row gap-8 w-full justify-center mt-2 mb-2">
          <Link
            href="/tablet/items"
            className="flex items-center gap-3 bg-[var(--color-primarygreen-1)] text-white text-2xl font-bold rounded-xl px-8 py-4 shadow hover:bg-[#00664f] transition"
          >
            <Package size={36} />
            Items bekijken & reserveren
          </Link>
          <Link
            href="/tablet/code"
            className="flex items-center gap-3 bg-[var(--color-primarygreen-1)] text-white text-2xl font-bold rounded-xl px-8 py-4 shadow hover:bg-[#00664f] transition"
          >
            <Key size={36} />
            Ophalen of Terugbrengen
          </Link>
        </div>
        <h2 className="text-4xl flex gap-2 items-center font-bold text-center text-[var(--color-primarygreen-1)] mt-4 mb-2">
          Hoe het werkt
        </h2>
        <section className="flex flex-row gap-8 w-full justify-center items-stretch">
          <InfoCard
            number={1}
            title="Ontdek & Reserveer"
            description="Blader door onze collectie van items die momenteel beschikbaar zitten in de locker. Van naaimachines tot tuingereedschap - vind wat je nodig hebt en reserveer."
          />
          <InfoCard
            number={2}
            title="Betaal bij afhaling"
            description="Betaal veilig online met Payconiq. Geen gedoe met contant geld - alles gebeurt digitaal en supersnel."
          />
          <InfoCard
            number={3}
            title="Ontvang je code"
            description="Krijg meteen een unieke toegangscode per e-mail. Deze code geeft je toegang tot jouw gereserveerde item."
          />
          <InfoCard
            number={4}
            title="Haal op"
            description="Ga naar de kast, voer je code in op de tablet en pak je item uit het juiste vakje."
          />
          <InfoCard
            number={5}
            title="Gebruik & breng terug"
            description="Geniet van je geleende item en breng het optijd terug. Deel je ervaring via de tablet - zo helpen we elkaar!"
          />
        </section>
      </div>
    </div>
  );
}
