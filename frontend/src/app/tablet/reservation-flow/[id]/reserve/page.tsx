'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getItemById, ItemResponse } from '@/app/api/items';
import { addWeeks, format } from 'date-fns';
import {
  ArrowLeft,
  MagnifyingGlass,
  User,
  CreditCard,
  Check,
} from 'phosphor-react';
import Stepper from '@/components/Stepper';

export default function TabletReservationFormPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    houseNumber: '',
    city: '',
    postalCode: '',
    bus: '',
    duration: 1, // Default duration in weeks
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addWeeks(new Date(), 1));
  const [item, setItem] = useState<ItemResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Static data for demo
  const pricePerWeek = 5.0;
  const today = new Date(2025, 4, 20); // 20/05/2025
  const [weeks, setWeeks] = useState(1);
  const maxWeeks = 2;
  const minWeeks = 1;
  const startDateDemo = today;
  const endDateDemo = new Date(
    today.getTime() + 7 * 24 * 60 * 60 * 1000 * weeks
  );
  const totalPrice = (pricePerWeek * weeks).toFixed(2).replace('.', ',');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await getItemById(id);
        setItem(data);
      } catch (err) {
        setError('Er ging iets mis bij het ophalen van dit item.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  useEffect(() => {
    // Update end date when duration changes
    setEndDate(addWeeks(startDate, formData.duration));
  }, [formData.duration, startDate]);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleDurationChange = (change: number) => {
    // Max 2 weken, min 1 week
    const newDuration = Math.max(1, Math.min(2, formData.duration + change));
    setFormData({
      ...formData,
      duration: newDuration,
    });
  };

  const validateForm = () => {
    const newErrors = {
      firstName: formData.firstName ? '' : 'Voornaam is verplicht',
      lastName: formData.lastName ? '' : 'Achternaam is verplicht',
      email: formData.email
        ? /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
            formData.email
          )
          ? ''
          : 'Voer een geldig e-mailadres in (bijv. naam@email.com)'
        : 'E-mail is verplicht',
      phone: formData.phone
        ? /^(\+32|0)[0-9]{9}$/.test(formData.phone.replace(/\s+/g, ''))
          ? ''
          : 'Voer een geldig Belgisch telefoonnummer in (bijv. +32 123 45 67 89)'
        : 'Telefoonnummer is verplicht',
      street: formData.street ? '' : 'Straat is verplicht',
      city: formData.city ? '' : 'Stad is verplicht',
      postalCode: formData.postalCode
        ? /^[1-9][0-9]{3}$/.test(formData.postalCode)
          ? ''
          : 'Voer een geldige Belgische postcode in (4 cijfers)'
        : 'Postcode is verplicht',
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Api call voor het versturen van de reservering
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // navigeer naar de bevestigingspagina
      router.push(`/tablet/reservation-flow/${id}/pay`);
    } catch (error) {
      console.error('Error submitting reservation:', error);
      alert(
        'Er is een fout opgetreden bij het versturen van je reservering. Probeer het later opnieuw.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Stepper activeStep={3} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-row gap-12 max-w-6xl mx-auto w-full mt-10 px-8">
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
        {/* Left: Contactgegevens */}
        <div className="flex-1 flex flex-col gap-8">
          <h2 className="text-2xl font-extrabold text-[var(--color-primarygreen-1)] mb-2">
            Contactgegevens
          </h2>
          <form
            id="reservation-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-8"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label
                  className="font-semibold text-gray-800"
                  htmlFor="voornaam"
                >
                  Voornaam <span className="text-red-500">*</span>
                </label>
                <input
                  id="voornaam"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`rounded-lg border border-gray-300 px-4 py-3 text-lg bg-white ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="John"
                  required
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="font-semibold text-gray-800"
                  htmlFor="achternaam"
                >
                  Achternaam <span className="text-red-500">*</span>
                </label>
                <input
                  id="achternaam"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`rounded-lg border border-gray-300 px-4 py-3 text-lg bg-white ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Doe"
                  required
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800" htmlFor="email">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`rounded-lg border border-gray-300 px-4 py-3 text-lg bg-white ${errors.email ? 'border-red-500' : ''}`}
                placeholder="naam@email.com"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800" htmlFor="telefoon">
                Telefoon <span className="text-red-500">*</span>
              </label>
              <input
                id="telefoon"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`rounded-lg border border-gray-300 px-4 py-3 text-lg bg-white ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="+32 123 45 67 89"
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-800" htmlFor="straat">
                  Straat en nummer <span className="text-red-500">*</span>
                </label>
                <input
                  id="straat"
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className={`rounded-lg border border-gray-300 px-4 py-3 text-lg bg-white ${errors.street ? 'border-red-500' : ''}`}
                  placeholder="Rijkswachtstraat 5"
                  required
                />
                {errors.street && (
                  <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-800" htmlFor="bus">
                  Bus
                </label>
                <input
                  id="bus"
                  type="text"
                  name="bus"
                  value={formData.bus}
                  onChange={handleInputChange}
                  className="rounded-lg border border-gray-300 px-4 py-3 text-lg bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-800" htmlFor="stad">
                  Stad <span className="text-red-500">*</span>
                </label>
                <input
                  id="stad"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`rounded-lg border border-gray-300 px-4 py-3 text-lg bg-white ${errors.city ? 'border-red-500' : ''}`}
                  placeholder="Kortrijk"
                  required
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label
                  className="font-semibold text-gray-800"
                  htmlFor="postcode"
                >
                  Postcode <span className="text-red-500">*</span>
                </label>
                <input
                  id="postcode"
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className={`rounded-lg border border-gray-300 px-4 py-3 text-lg bg-white ${errors.postalCode ? 'border-red-500' : ''}`}
                  placeholder="8500"
                  required
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.postalCode}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
        {/* Right: Huur termijn */}
        <div className="w-[420px] flex flex-col gap-6">
          <h2 className="text-2xl font-extrabold text-[var(--color-primarygreen-1)] mb-2">
            Huur termijn
          </h2>
          <div className="bg-[#e6f0f2] rounded-2xl p-8 flex flex-col items-center gap-4">
            <div className="text-base text-gray-700 font-semibold mb-4">
              Max 2 weken
            </div>
            <div className="flex items-center gap-4 mb-4">
              <button
                className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-2xl font-bold text-[var(--color-primarygreen-1)] disabled:opacity-50"
                onClick={() => setWeeks((w) => Math.max(minWeeks, w - 1))}
                disabled={weeks <= minWeeks}
                type="button"
                aria-label="Minder weken"
              >
                -
              </button>
              <div className="text-2xl font-extrabold text-gray-900 min-w-[110px] text-center">
                {weeks} week{weeks > 1 ? 'en' : ''}
              </div>
              <button
                className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-2xl font-bold text-[var(--color-primarygreen-1)] disabled:opacity-50"
                onClick={() => setWeeks((w) => Math.min(maxWeeks, w + 1))}
                disabled={weeks >= maxWeeks}
                type="button"
                aria-label="Meer weken"
              >
                +
              </button>
            </div>
            <div className="flex flex-col items-center justify-center w-full gap-1 mb-2">
              <div className="flex flex-row gap-8">
                <div className="text-base font-semibold text-gray-700">
                  Startdatum:
                  <span className="font-bold ml-1">
                    {format(startDateDemo, 'dd/MM/yyyy')}
                  </span>
                </div>
                <div className="text-base font-semibold text-gray-700">
                  Einddatum:
                  <span className="font-bold ml-1">
                    {format(endDateDemo, 'dd/MM/yyyy')}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-base text-gray-700 mb-1">
              Prijs: €{pricePerWeek.toFixed(2)} per week
            </div>
            <div className="text-4xl font-extrabold text-[var(--color-primarygreen-1)] mb-2">
              €{totalPrice}
            </div>
          </div>
          <div className="bg-red-100 border border-red-400 text-red-800 rounded-xl px-6 py-4 flex items-center gap-3 text-base font-semibold">
            <span className="text-xl">
              <svg
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="inline align-middle"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                />
              </svg>
            </span>
            Let op! Haal uw items binnen de 48 uur op om annulering te voorkomen
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              form="reservation-form"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-16 py-4 rounded-xl bg-[var(--color-primarygreen-1)] text-white text-xl font-bold shadow hover:bg-[#00664f] transition min-w-[220px] justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Bezig...' : 'BETALEN'}{' '}
              <Check size={28} weight="bold" className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
