import React from "react";
import * as PhosphorIcons from "@phosphor-icons/react";

type StatisticsCardProps = {
  label: string;
  value: string | number;
  iconName: string;
};

function getIconByName(iconName: string) {
  // Check if the icon exists
  if (iconName in PhosphorIcons) {
    return (PhosphorIcons as any)[iconName];
  }

  // Default icon
  return PhosphorIcons.WrenchIcon;
}

export default function StatisticsCard({ label, value, iconName }: StatisticsCardProps) {
  const IconComponent = getIconByName(iconName);

  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center justify-baseline gap-4">
      <div><IconComponent size={32} weight="regular" color="#202020" /></div>
      <div className="flex flex-col justify-start">
          <div className="text-2xl font-bold mb-1">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  );
}


