"use client";

import React from "react";
import Navigation from "@/components/mobile/nav";
import Footer from "@/components/mobile/footer";
import Image from "next/image";
import InfoCard from "@/components/mobile/InfoCard";
import Link from "next/link";
import { Package, Question } from "phosphor-react";

export default function MobilePage() {
  return (
    <>
      <main className="py-8 px-8 flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-center text-primarygreen-1">
          Deelkast
        </h1>
        <p className="text-center">
          Slim delen begint hier. Bij de Deelkast kan je snel en makkelijk
          spullen lenen via onze kast. Meld je aan, kies een item en haal het op
          bij de locker - 100% selfservice.
        </p>
        <Link
          className="bg-primarygreen-1 text-white flex justify-center rounded-xl py-2 w-3/4 mx-auto items-center max-w-2xs gap-2"
          href={"/items"}
        >
          <Package size={32} />
          Ontdek alle items
        </Link>
        <h2 className="text-3xl flex gap-2 items-center mx-auto font-bold text-center text-primarygreen-1">
          <Question size={32} />
          Hoe het werkt
        </h2>
        {/* Square image wrapper */}
        <section className="flex gap-12 overflow-x-auto pb-4 px-4 justify-between">
          <InfoCard
            number={1}
            title="Ontdek & Reserveer"
            description="Blader door onze collectie van items die momenteel beschikbaar zitten in de locker. Van naaimachines tot tuingereedschap - vind wat je nodig hebt en reserveer."
            className="min-w-[250px] max-w-[250px]"
          />
          <InfoCard
            number={2}
            title="Betaal bij afhaling"
            description="Betaal veilig online met Payconiq. Geen gedoe met contant geld - alles gebeurt digitaal en supersnel."
            className="min-w-[250px] max-w-[250px] "
          />
          <InfoCard
            number={3}
            title="Ontvang je code"
            description="Krijg meteen een unieke toegangscode per e-mail. Deze code geeft je toegang tot jouw gereserveerde item."
            className="min-w-[250px] max-w-[250px] "
          />
          <InfoCard
            number={4}
            title="Haal op"
            description="Ga naar de kast, voer je code in op de tablet en pak je item uit het juiste vakje."
            className="min-w-[250px] max-w-[250px]"
          />
          <InfoCard
            number={5}
            title="Gebruik & breng terug"
            description="Geniet van je geleende item en breng het optijd terug. Deel je ervaring via de tablet - zo helpen we elkaar!"
            className="min-w-[250px] max-w-[250px] "
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
