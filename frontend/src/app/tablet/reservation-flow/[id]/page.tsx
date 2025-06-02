'use client';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MagnifyingGlass, User, CreditCard } from 'phosphor-react';
import Stepper from '@/components/Stepper';

type StatusType = 'Beschikbaar' | 'Uitgeleend' | 'Gereserveerd';

const product = {
  title: 'Naaimachine',
  imageSrc: '/assets/items/naaimachine.png',
  status: 'Beschikbaar' as StatusType,
  pricePerWeek: 15.0,
  tags: ['Huishoud', 'Elektrisch'],
  description:
    'Deze gebruiksvriendelijke naaimachine is ideaal voor al je naai projecten, van kleine kledingreparaties tot creatieve ontwerpen. Geschikt voor zowel beginners als ervaren gebruikers, biedt deze machine meerdere steekpatronen, instelbare steeklengte en -breedte, en een automatische draadinrijger voor extra gemak.',
  details: {
    'Hoe gebruiken?': 'Wol niet inbegrepen',
    'Wat zit er bij?': 'Wol niet inbegrepen',
    Gewicht: '3 kilogram',
    Afmeting: '180 hoogte || 180 breedte',
    'Tip!': 'Wol niet inbegrepen',
  },
  bg: 'bg-green-100',
};

const statusColors: Record<StatusType, string> = {
  Beschikbaar: 'bg-green-600',
  Uitgeleend: 'bg-red-600',
  Gereserveerd: 'bg-pink-500',
};

export default function TabletProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f6f8]">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between bg-white px-12 py-6 shadow-sm">
        {/* Logo */}
        <Image
          src="/deelfabriek-website-labels-boven_v2.svg"
          alt="Deelfabriek Logo"
          width={240}
          height={90}
        />
        {/* Stepper */}
        <div className="ml-auto">
          <Stepper activeStep={2} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-row gap-8 max-w-6xl mx-auto w-full mt-10 px-8">
        {/* Back arrow */}
        <div className="flex flex-col items-start pt-2">
          <button
            className="rounded-xl p-3 bg-white shadow-md hover:bg-gray-50 transition border border-gray-200 flex items-center gap-2 text-[var(--color-primarygreen-1)] font-semibold"
            onClick={() => router.back()}
            aria-label="Terug"
          >
            <ArrowLeft size={24} weight="regular" />
            Terug
          </button>
        </div>
        {/* Main content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            {product.title}
          </h1>
          {/* Image + status */}
          <div
            className={`relative rounded-2xl ${product.bg} flex items-center justify-center w-full h-[320px] mb-2`}
          >
            <Image
              src={product.imageSrc}
              alt={product.title}
              width={340}
              height={220}
              className="object-contain"
            />
            <div
              className={`absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-bold text-white ${statusColors[product.status]}`}
            >
              {product.status.toUpperCase()}
            </div>
          </div>
          {/* Tags */}
          <div className="flex gap-3 mb-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="bg-[var(--color-primarygreen-1)] text-white px-4 py-1 rounded-full text-sm font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
          {/* Description */}
          <div className="mt-2">
            <div className="font-bold text-lg text-gray-800 mb-1">
              Beschrijving
            </div>
            <div className="text-gray-700 text-base max-w-2xl leading-relaxed">
              {product.description}
            </div>
          </div>
        </div>
        {/* Right column */}
        <div className="w-[340px] flex flex-col gap-6 pt-2">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            €{product.pricePerWeek.toFixed(2).replace('.', ',')} per week
          </div>
          <button
            className="w-full py-3 rounded-xl bg-[var(--color-primarygreen-1)] text-white text-lg font-bold shadow hover:bg-[#00664f] transition"
            onClick={() =>
              router.push(`/tablet/reservation-flow/${id}/reserve`)
            }
          >
            Huur nu
          </button>
          <div className="flex flex-col gap-3 mt-2">
            {Object.entries(product.details).map(([label, value]) => (
              <div key={label}>
                <span className="font-semibold text-gray-800">{label}</span>
                <span className="block text-gray-600 text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
