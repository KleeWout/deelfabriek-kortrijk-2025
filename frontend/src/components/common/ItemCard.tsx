import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { getGradientClassForBackground } from "@/utils/constants";
import { ItemCardProps } from "@/models/ItemCardProps";
import { useEffect, useState } from "react";

// interface ItemCardProps {
//   id: number;
//   title: string;
//   price: number;
//   imageSrc?: string;
//   status: string;
//   index: number; //achtergrond
//   onClick?: () => void;
// }

export function ItemCard(props: ItemCardProps & { onClick?: () => void }) {
  const {
    id,
    title,
    pricePerWeek,
    imageSrc = "/assets/items/naaimachine.png",
    status = "Beschikbaar",
    index = 0,
    onClick,
    baseRoute,
    lockerId = 0,
  } = props;
  const router = useRouter();
  const pathname = usePathname();

  const [fetchedImg, setFetchedImg] = useState<string | null>(null);

  // useEffect(() => {
  //   let isMounted = true;
  //   if (imageSrc) {
  //     const url = `http://localhost:3001/photo?src=${encodeURIComponent(imageSrc)}`;
  //     fetch(url)
  //       .then((res) => res.blob())
  //       .then((blob) => {
  //         if (isMounted) setFetchedImg(URL.createObjectURL(blob));
  //       })
  //       .catch(() => {
  //         if (isMounted) setFetchedImg(null);
  //       });
  //   }
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [imageSrc]);

  // If baseRoute is not provided, determine it from the current path
  const resolvedBaseRoute =
    baseRoute ||
    (pathname.startsWith("/mobile")
      ? "/mobile/items"
      : pathname.startsWith("/tablet")
        ? "/tablet/items"
        : "/items");

  //verschillende achtergrond gradients:
  const gradientClass = getGradientClassForBackground(lockerId);

  //klik en navigeer nr detail pagina van item
  const handleItemClick = (itemId: number) => {
    router.push(`${resolvedBaseRoute}/${itemId}`);
  };

  return (
    <div
      className="flex flex-col w-full h-full rounded-xl shadow-md hover:shadow-lg border-white border-2 relative cursor-pointer"
      onClick={() => handleItemClick(id)}
    >
      <div
        className={`${gradientClass} rounded-t-xl h-[175px] md:h-[200px] flex items-center justify-center p-2`}
      >
        <Image
          src={imageSrc || "/assets/items/naaimachine.png"}
          width={120}
          height={90}
          alt={title}
          className="object-contain max-w-full max-h-full w-[120px] h-[90px] md:w-[160px] md:h-[175px]"
          priority
        />
      </div>
      <div className="bg-white p-2 flex flex-start flex-col rounded-b-xl">
        <p className="text-primarytext-1 text-base font-bold truncate">
          {title}
        </p>
        <p className="text-primarygreen-1 font-medium text-xs">
          € {pricePerWeek ? pricePerWeek.toFixed(2).replace(".", ",") : "0,00"}{" "}
          per week
        </p>
      </div>
      <div
        className={`absolute right-2 top-2 text-xs px-2 py-1 rounded-md  text-white ${status === "Beschikbaar" ? "bg-primarygreen-1" : status === "Uitgeleend" ? "bg-amber-600" : " bg-primarypink-1"}`}
      >
        {status.toUpperCase()}
      </div>
    </div>
  );
}

ItemCard.Grid = function ItemCardGrid({ items }: { items: ItemCardProps[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} {...item} />
      ))}
    </div>
  );
};
