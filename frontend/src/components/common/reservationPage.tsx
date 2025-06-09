"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { ReturnButton } from "@/components/common/ReturnButton";
import Navigation from "@/components/mobile/nav";
import itemsDetails from "@/data/itemDetails.json";
import { addWeeks, format } from "date-fns";
import { Fragment } from "react";
import { createReservation } from "@/app/api/reservations";

export default function ReservationPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on the tablet route
  const isTabletRoute = pathname.includes("/tablet/");

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    houseNumber: "",
    city: "",
    postalCode: "",
    bus: "",
    duration: 1, // Default duration in weeks
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addWeeks(new Date(), 1));

  const [showConfirm, setShowConfirm] = useState(false);

  // Get item details
  const item = itemsDetails.find((item) => item.id === id);

  useEffect(() => {
    // Update end date when duration changes
    setEndDate(addWeeks(startDate, formData.duration));
  }, [formData.duration, startDate]);

  if (!item) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <ReturnButton href="/mobile/items" />
          <h1 className="text-2xl font-bold text-red-500">Item niet gevonden</h1>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: formData.firstName ? "" : "Voornaam is verplicht",
      lastName: formData.lastName ? "" : "Achternaam is verplicht",
      email: formData.email ? (/\S+@\S+\.\S+/.test(formData.email) ? "" : "Ongeldig e-mailadres") : "E-mail is verplicht",
      phone: formData.phone ? (/^[0-9+\s()-]{10,15}$/.test(formData.phone) ? "" : "Ongeldig telefoonnummer") : "Telefoonnummer is verplicht",
      street: formData.street ? "" : "Straat is verplicht",
      city: formData.city ? "" : "Stad is verplicht",
      postalCode: formData.postalCode ? (/^\d{4}$/.test(formData.postalCode) ? "" : "Ongeldige postcode") : "Postcode is verplicht",
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTermsError("");
    if (!acceptedTerms) {
      setTermsError("Je moet de gebruikersvoorwaarden accepteren.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setShowConfirm(true);
  };
  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    try {
      // Create reservation data payload
      const reservationData = {
        user: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phone,
          street: formData.street,
          bus: formData.bus || undefined, // Only include if not empty
          houseNumber: formData.houseNumber || "", // Convert empty to empty string
          postalCode: formData.postalCode,
          city: formData.city,
        },
        itemId: id,
        weeks: formData.duration,
      };

      // Call the API and get the response
      const response = await createReservation(reservationData);

      // Store the response in localStorage
      localStorage.setItem("reservationDetails", JSON.stringify(response));

      // Navigate to the appropriate confirmation page based on route type
      if (isTabletRoute) {
        router.push(`/tablet/payment/${id}`);
      } else {
        router.push("/mobile/reserveer/confirmation");
      }
    } catch (error) {
      console.error("Error submitting reservation:", error);
      alert("Er is een fout opgetreden bij het versturen van je reservering. Probeer het later opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const totalPrice = (item.price * formData.duration).toFixed(2).replace(".", ",");

  return (
    <div className="min-h-screen  pb-16  ">
      <div className="container mx-auto p-8 mt-4 flex flex-col lg:flex-row-reverse items-center gap-12 justify-center">
        <div>
          <h1 className="text-2xl font-bold  text-primarygreen-1 mb-8">Reserveren</h1>

          <div className="bg-primarygreen-2 border border-primarygreen-1 rounded-lg p-6 mb-6">
            <div className="flex justify-center items-center gap-4 mb-4">
              <button onClick={() => setFormData({ ...formData, duration: 1 })} className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${formData.duration === 1 ? "bg-primarygreen-1 text-white" : "bg-white border border-primarygreen-1 text-primarygreen-1"}`}>
                1 week
              </button>
              <button onClick={() => setFormData({ ...formData, duration: 2 })} className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${formData.duration === 2 ? "bg-primarygreen-1 text-white" : "bg-white border border-primarygreen-1 text-primarygreen-1"}`}>
                2 weken
              </button>
            </div>
            <div className="flex justify-between m-2 p-2 text-base text-primarytext-1">
              <div className="flex flex-col">
                Startdatum: <p className="font-bold">{format(startDate, "dd/MM/yyyy")}</p>
              </div>
              <div className="flex flex-col">
                Einddatum: <p className="font-bold">{format(endDate, "dd/MM/yyyy")}</p>
              </div>
            </div>
            <div className="text-center text-sm text-primarytext-1 m-4">Prijs: €{item.price.toFixed(2).replace(".", ",")} per week</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primarygreen-1 mb-4">€{totalPrice}</div>
              {!isTabletRoute && (
                <div className="bg-gray-50 rounded-lg  text-center px-3 py-2">
                  <p className="text-gray-600 text-sm font-semibold">Betaling gebeurd via Payconiq bij ophalen</p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-red-100 rounded-lg p-4 mb-6 text-center text-red-900 border border-red-800 text-sm font-semibold">48 uur om uw item op te halen anders wordt de reservatie geannuleerd!</div>
        </div>

        <form id="reservationForm" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold  text-primarygreen-1 mb-8">Contactgegevens</h2>

            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Voornaam <span className="text-red-500">*</span>
                </label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full p-3 border rounded-lg ${errors.firstName ? "border-red-500" : "border-gray-300"}`} placeholder="John" />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div className="flex-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Achternaam <span className="text-red-500">*</span>
                </label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full p-3 border rounded-lg ${errors.lastName ? "border-red-500" : "border-gray-300"}`} placeholder="Doe" />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full p-3 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`} placeholder="john@email.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefoon <span className="text-red-500">*</span>
              </label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full p-3 border rounded-lg ${errors.phone ? "border-red-500" : "border-gray-300"}`} placeholder="+32 123 45 67 89" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                  Straat en nummer <span className="text-red-500">*</span>
                </label>
                <input type="text" id="street" name="street" value={formData.street} onChange={handleInputChange} className={`w-full p-3 border rounded-lg ${errors.street ? "border-red-500" : "border-gray-300"}`} placeholder="Rijkswachtstraat 5" />
                {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
              </div>

              <div className="w-1/3">
                <label htmlFor="bus" className="block text-sm font-medium text-gray-700 mb-1">
                  Bus
                </label>
                <input type="text" id="bus" name="bus" value={formData.bus} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg" placeholder="A" />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Stad <span className="text-red-500">*</span>
                </label>
                <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} className={`w-full p-3 border rounded-lg ${errors.city ? "border-red-500" : "border-gray-300"}`} placeholder="Kortrijk" />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div className="w-1/3">
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Postcode <span className="text-red-500">*</span>
                </label>
                <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className={`w-full p-3 border rounded-lg ${errors.postalCode ? "border-red-500" : "border-gray-300"}`} placeholder="8500" />
                {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <input type="checkbox" id="terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mr-2 w-5 h-5 accent-primarygreen-1" required />
            <label htmlFor="terms" className="text-sm select-none">
              Ik heb de{" "}
              <a href="/gebruiksvoorwaarden.pdf" target="_blank" rel="noopener noreferrer" className="underline text-primarygreen-1 hover:text-primarygreen-2 font-semibold">
                gebruikersvoorwaarden
              </a>{" "}
              gelezen en goedgekeurd
              <span className="text-red-500"> *</span>
            </label>
          </div>
          {termsError && <p className="text-red-500 text-xs mt-1">{termsError}</p>}
        </form>
      </div>
      <div className="flex justify-center items-center w-full">
        <button form="reservationForm" type="submit" disabled={isSubmitting} className="w-64 bg-primarygreen-1 text-white py-3 px-4 rounded-lg hover:bg-green-900 transition-colors disabled:bg-gray-400">
          {isSubmitting ? "Bezig met reserveren..." : isTabletRoute ? "Huur nu" : "Reserveren"}
        </button>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center border border-primarygreen-1">
            <h2 className="text-2xl font-bold text-primarygreen-1 mb-4 text-center">Bevestig je reservatie</h2>
            <p className="text-lg text-center mb-6">
              Is alle info juist en ben je zeker dat je een <span className="font-bold">{item.title}</span> wil reserveren?
            </p>
            <div className="flex gap-6 w-full justify-center">
              <button onClick={handleConfirm} className="bg-primarygreen-1 text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-green-900 transition-colors">
                Ja, reserveren
              </button>
              <button onClick={handleCancel} className="bg-gray-200 text-primarygreen-1 font-bold px-6 py-3 rounded-lg shadow hover:bg-gray-300 transition-colors">
                Nee, terug
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
