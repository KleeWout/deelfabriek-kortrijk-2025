'use client';

import { useEffect, useState } from 'react';
import { getAllReservations } from '@/app/api/reservations';
import StatusBadge from '../components/StatusBadge';
import { Fragment } from 'react';
import { User, Package, Calendar } from 'phosphor-react';

interface Reservation {
  userName: string;
  itemTitle: string;
  reservationDate: string;
  loanStart: string | null;
  loanEnd: string | null;
  status: string;
  email?: string;
  phoneNumber?: string;
  street?: string;
  houseNumber?: string;
  bus?: string;
  postalCode?: string;
  city?: string;
  fine?: number;
  lockerNumber?: string;
  reservationId?: string;
  pickupDeadline?: string;
}

function ReservationDetailModal({
  reservation,
  onClose,
}: {
  reservation: Reservation | null;
  onClose: () => void;
}) {
  if (!reservation) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primarygreen-1">
            Reservatie details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="space-y-3 text-base text-gray-800">
          <div className="text-lg font-bold text-primarygreen-1 mt-2 mb-1 flex items-center gap-2">
            <User size={22} />
            Gebruiker
          </div>
          <div>
            <span className="font-semibold">Naam:</span> {reservation.userName}
          </div>
          <div>
            <span className="font-semibold">Email:</span>{' '}
            {reservation.email || '-'}
          </div>
          <div>
            <span className="font-semibold">Telefoon:</span>{' '}
            {reservation.phoneNumber || '-'}
          </div>
          <div>
            <span className="font-semibold">Adres:</span>{' '}
            {reservation.street || '-'} {reservation.houseNumber || ''}
            {reservation.bus ? ` bus ${reservation.bus}` : ''},{' '}
            {reservation.postalCode || ''} {reservation.city || ''}
          </div>

          <div className="text-lg font-bold text-primarygreen-1 mt-4 mb-1 flex items-center gap-2">
            <Package size={22} />
            Item
          </div>
          <div>
            <span className="font-semibold">Item:</span> {reservation.itemTitle}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Status:</span>{' '}
            <StatusBadge status={reservation.status} />
          </div>

          <div className="text-lg font-bold text-primarygreen-1 mt-4 mb-1 flex items-center gap-2">
            <Calendar size={22} />
            Reservatie
          </div>
          <div>
            <span className="font-semibold">Datum gereserveerd:</span>{' '}
            {reservation.reservationDate
              ? new Date(reservation.reservationDate).toLocaleDateString()
              : '-'}
          </div>
          <div>
            <span className="font-semibold">Uitgeleend:</span>{' '}
            {reservation.loanStart
              ? new Date(reservation.loanStart).toLocaleDateString()
              : '-'}
          </div>
          <div>
            <span className="font-semibold">Terugbrengen:</span>{' '}
            {reservation.loanEnd
              ? new Date(reservation.loanEnd).toLocaleDateString()
              : '-'}
          </div>
          {reservation.pickupDeadline && (
            <div>
              <span className="font-semibold">Ophalen vóór:</span>{' '}
              {new Date(reservation.pickupDeadline).toLocaleDateString()}
            </div>
          )}
          {reservation.lockerNumber && (
            <div>
              <span className="font-semibold">Locker:</span>{' '}
              {reservation.lockerNumber}
            </div>
          )}
          {reservation.fine !== undefined && (
            <div>
              <span className="font-semibold">Boete:</span> €{' '}
              {reservation.fine.toFixed(2)}
            </div>
          )}
          {reservation.reservationId && (
            <div>
              <span className="font-semibold">Reserveringsnummer:</span>{' '}
              {reservation.reservationId}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-8 w-full py-2 rounded-lg bg-primarygreen-1 text-white font-semibold hover:bg-green-900 transition"
        >
          Sluiten
        </button>
      </div>
    </div>
  );
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getAllReservations();
        setReservations(data);
      } catch (err) {
        setError('Kon reservaties niet laden.');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reservaties</h1>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Naam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    Laden...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    Geen reservaties gevonden.
                  </td>
                </tr>
              ) : (
                reservations.map((res, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {res.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {res.itemTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={res.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="px-4 py-2 rounded-lg bg-primarygreen-1 text-white font-semibold hover:bg-green-900 transition text-sm"
                        onClick={() => setSelectedReservation(res)}
                      >
                        Bekijk alle details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ReservationDetailModal
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
      />
    </div>
  );
}
