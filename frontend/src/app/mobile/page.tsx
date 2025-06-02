import Navigation from "@/components/mobile/nav";
import Footer from "@/components/mobile/footer";
import Image from "next/image";
import InfoCard from "@/components/mobile/InfoCard";
import Link from "next/link";

export default function MobilePage() {
  return (
    <>
      <Navigation />
      <main className="py-8 px-8 flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-center text-primarygreen-1">
          Deelkast
        </h1>
        <p className="text-center">
          Slim delen begint hier. Bij de Deelkast kan je snel en makkelijk
          spullen lenen via onze kast. Meld je aan, kies een item en haal het op
          bij de locker - 100% selfservice.
        </p>
        {/* Square image wrapper */}
        <section className="flex gap-8 overflow-x-auto pb-4">
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
        <Link
          className="bg-primarygreen-1 text-white flex justify-center rounded-xl py-2 w-3/4 mx-auto"
          href={"/mobile/items"}
        >
          Ondek alle items
        </Link>
      </main>
      <Footer />
    </>
  );
}
