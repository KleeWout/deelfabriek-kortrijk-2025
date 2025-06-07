import Image from "next/image";

interface FeatureCardProps {
  number: number;
  title: string;
  description: string;
  imageSrc?: string;
  className?: string;
}

export default function FeatureCard({ number, title, description, imageSrc = "/PlaceholderFoto.webp", className = "" }: FeatureCardProps) {
  return (
    <article className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="w-52 h-52 relative">
        <Image src={imageSrc} alt="Voorbeeld afbeelding" fill className="object-cover object-center rounded-xl" />
        <span className="bg-primarygreen-1 text-white w-4 h-4 flex items-center justify-center rounded-full p-3 absolute top-2 right-2">{number}</span>
      </div>
      <h2 className="font-bold">{title}</h2>
      <p className="text-center">{description}</p>
    </article>
  );
}
