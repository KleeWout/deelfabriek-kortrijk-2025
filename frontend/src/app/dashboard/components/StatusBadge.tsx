import React from "react";

type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  let bgColor = "bg-gray-100 text-gray-800";
  
  if (status.toLowerCase() === "gereserveerd") {
    bgColor = "bg-amber-100 text-amber-800";
  } else if (status.toLowerCase() === "beschikbaar") {
    bgColor = "bg-green-100 text-green-800";
  } else if (status.toLowerCase() === "uitgeleend") {
    bgColor = "bg-blue-100 text-blue-800";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
      {status}
    </span>
  );
}