import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getGradientClassForBackground } from '@/utils/constants';
import { ItemCardProps } from '@/models/ItemCardProps';

// interface ItemCardProps {
//   id: number;
//   title: string;
//   price: number;
//   imageSrc?: string;
//   status: string;
//   index: number; //achtergrond
//   onClick?: () => void;
// }

export function ItemCard({
  id,
  title,
  pricePerWeek,
  imageSrc = '/assets/items/naaimachine.png',
  status = 'Beschikbaar',
  index = 0,
  onClick,
}: ItemCardProps & { onClick?: () => void }) {
  const router = useRouter();

  //verschillende achtergrond gradients:
  const gradientClass = getGradientClassForBackground(id);

  //klik en navigeer nr detail pagina van item
  const handleItemClick = (itemId: number) => {
    router.push(`/mobile/items/${itemId}`);
  };

  return (
    <div className="flex flex-col w-full max-w-[340px] max-h-[280px] min-w-[140px] rounded-xl shadow-md hover:shadow-lg border-white border-2 relative cursor-pointer" onClick={() => handleItemClick(id)}>
      <div className={`${gradientClass} rounded-t-xl h-[116px] md:h-[200px] flex items-center justify-center p-2`}>
        {" "}
        {/* <p>{imageSrc}</p> */}
        <Image src={imageSrc} width={120} height={90} alt={title} className="object-contain max-w-full max-h-full w-[120px] h-[90px] md:w-[160px] md:h-[120px]" priority />
      </div>
      <div className="bg-white p-2 flex flex-start flex-col rounded-b-xl">
        <p className="text-primarytext-1 text-base font-bold truncate">
          {title}
        </p>
        <p className="text-primarygreen-1 font-medium text-xs">
          € {pricePerWeek.toFixed(2).replace('.', ',')} per week
        </p>
      </div>
      <div
        className={`absolute right-2 top-2 text-xs px-2 py-1 rounded-md  text-white ${status === 'Beschikbaar' ? 'bg-primarygreen-1' : status === 'Uitgeleend' ? 'bg-amber-600' : ' bg-primarypink-1'}`}
      >
        {status.toUpperCase()}
      </div>
    </div>
  );
}
