'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getItemById, ItemResponse } from '@/app/api/items';
import { format, addDays } from 'date-fns';
import { Note } from 'phosphor-react';

export default function ConfirmationPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const router = useRouter();
  const [reservationDetails, setReservationDetails] = useState({
    code: '',
    locker: '',
    name: '',
    item: '',
    pickupDate: new Date(),
    returnDate: new Date(),
    price: '',
  });
  const [item, setItem] = useState<ItemResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await getItemById(id);
        setItem(data);

        // Dummy data --> later api call
        const pickupDate = new Date();
        const returnDate = addDays(pickupDate, 7); // 1 week

        setReservationDetails({
          code: '324568',
          locker: '02',
          name: 'Jan Appelmans',
          item: data.title,
          pickupDate: pickupDate,
          returnDate: returnDate,
          price: data.pricePerWeek.toFixed(2),
        });
      } catch (err) {
        setError('Er ging iets mis bij het ophalen van dit item.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-primarybackground)]">
        <div className="w-full flex justify-center mt-10 mb-2">
          <Image
            src="/deelfabriek-website-labels-boven_v2.svg"
            alt="Deelfabriek Logo"
            width={260}
            height={90}
          />
        </div>
        <div className="text-2xl font-bold text-[var(--color-primarytext-1)]">
          Laden...
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-primarybackground)]">
        <div className="w-full flex justify-center mt-10 mb-2">
          <Image
            src="/deelfabriek-website-labels-boven_v2.svg"
            alt="Deelfabriek Logo"
            width={260}
            height={90}
          />
        </div>
        <div className="text-2xl font-bold text-red-500">
          Item niet gevonden
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return format(date, "HH:mm 'op' dd/MM/yyyy");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-primarybackground)]">
      <div className="w-full flex justify-center mt-10 mb-2">
        <Image
          src="/deelfabriek-website-labels-boven_v2.svg"
          alt="Deelfabriek Logo"
          width={260}
          height={90}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-[var(--color-primarygreen-1)] mb-2">
          Reservering Bevestigd!
        </h1>
        <p className="text-center text-[var(--color-primarytext-1)] text-xl mb-8">
          Uw locker is succesvol gereserveerd
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--color-primarygreen-1)] text-white p-8 rounded-3xl mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-medium mb-4">Ophaal code</h2>
              <div className="text-6xl font-bold tracking-[0.3em] mb-4">
                {reservationDetails.code}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 mb-8 shadow-2xl">
            <div className="space-y-6 text-lg">
              <div>
                <span className="font-bold text-[var(--color-primarytext-1)]">
                  Locker:
                </span>
                <span className="ml-2 text-[var(--color-primarytext-1)]">
                  {reservationDetails.locker}
                </span>
              </div>

              <div>
                <span className="font-bold text-[var(--color-primarytext-1)]">
                  Naam:
                </span>
                <span className="ml-2 text-[var(--color-primarytext-1)]">
                  {reservationDetails.name}
                </span>
              </div>

              <div>
                <span className="font-bold text-[var(--color-primarytext-1)]">
                  Item:
                </span>
                <span className="ml-2 text-[var(--color-primarytext-1)]">
                  {reservationDetails.item}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-bold text-[var(--color-primarytext-1)]">
                  Ophalen voor:
                </span>
                <span className="text-[var(--color-primarytext-1)]">
                  {formatDate(reservationDetails.pickupDate)}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-bold text-[var(--color-primarytext-1)]">
                  Terugbrengen voor:
                </span>
                <span className="text-[var(--color-primarytext-1)]">
                  {formatDate(reservationDetails.returnDate)}
                </span>
              </div>

              <div>
                <span className="font-bold text-[var(--color-primarytext-1)]">
                  Betaling:
                </span>
                <span className="ml-2 text-[var(--color-primarytext-1)]">
                  € {reservationDetails.price} - via Payconiq
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-primarygreen-2)] rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-medium flex items-center mb-4 text-[var(--color-primarytext-1)]">
              <Note size={24} className="mr-2" />
              Instructies voor ophalen:
            </h2>

            <ol className="list-decimal list-inside space-y-4 pl-4 text-lg text-[var(--color-primarytext-1)]">
              <li>Ga naar locker {reservationDetails.locker}</li>
              <li>Voer ophaalcode {reservationDetails.code} in</li>
              <li>Betaal ter plaatse via qr-code</li>
              <li>Locker opent automatisch</li>
            </ol>
          </div>

          <div className="text-center text-red-700 text-lg font-medium">
            Vergeet niet uw telefoon mee te nemen voor de betaling ter plaatse
          </div>
        </div>
      </div>
    </div>
  );
}
