import React from 'react';

type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Map English status to Dutch and set color
  let bgColor = 'bg-gray-100 text-gray-800';
  let label = status;
  switch (status.toLowerCase()) {
    case 'active':
      bgColor = 'bg-green-100 text-green-800';
      label = 'Actief';
      break;
    case 'completed':
      bgColor = 'bg-blue-100 text-blue-800';
      label = 'Voltooid';
      break;
    case 'expired':
      bgColor = 'bg-red-100 text-red-800';
      label = 'Verlopen';
      break;
    case 'reserved':
      bgColor = 'bg-amber-100 text-amber-800';
      label = 'Gereserveerd';
      break;
    case 'cancelled':
      bgColor = 'bg-gray-300 text-gray-700';
      label = 'Geannuleerd';
      break;
    case 'not_active':
    case 'not active':
      bgColor = 'bg-gray-200 text-gray-700';
      label = 'Niet actief';
      break;
    case '':
      bgColor = 'bg-gray-300 text-gray-700';
      label = 'Geannuleerd';
      break;
    default:
      label = status;
      break;
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
    >
      {label}
    </span>
  );
}
