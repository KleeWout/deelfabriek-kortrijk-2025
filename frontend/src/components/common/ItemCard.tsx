import Image from "next/image";

interface ItemCardProps {
  title: string;
  price: number;
  imageSrc?: string;
  status: string;
  index: number; //achtergrond
}

export function ItemCard({ title, price, imageSrc = "/assets/items/naaimachine.png", status = "Beschikbaar", index=0 }: ItemCardProps) {
  //verschillende achtergrond gradients:
  const backgroundGradients = ["bg-gradient-green", "bg-gradient-purple", "bg-gradient-yellow", "bg-gradient-teal", "bg-gradient-red", "bg-gradient-salmon"];

  const gradientClass = backgroundGradients[index % 6];

  return (
    <div className="flex flex-col w-full max-w-[340px] max-h-[280px] min-w-[140px] rounded-xl shadow-md hover:shadow-lg border-white border-2 relative cursor-pointer transition-all duration-300 hover:scale-105">
      <div className={`${gradientClass} rounded-t-xl h-[116px] md:h-[200px] flex items-center justify-center p-2`}>
        {" "}
        <Image src={imageSrc} width={120} height={90} alt={title} className="object-contain max-w-full max-h-full w-[120px] h-[90px] md:w-[160px] md:h-[120px]" priority />
      </div>
      <div className="bg-white p-2 flex flex-start flex-col rounded-b-xl">
        <p className="text-primarytext-1 text-base font-bold truncate">{title}</p>
        <p className="text-primarygreen-1 font-medium text-xs">€ {price.toFixed(2).replace(".", ",")} per week</p>
      </div>
      <div className={`absolute right-2 top-2 text-xs px-2 py-1 rounded-md  text-white ${status === "Beschikbaar" ? "bg-primarygreen-1" : status === "Uitgeleend" ? "bg-amber-600" : " bg-primarypink-1"}`}>{status.toUpperCase()}</div>
    </div>
  );
}
