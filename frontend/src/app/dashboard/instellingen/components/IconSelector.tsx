"use client";

import { useState } from "react";
import { X } from "@phosphor-icons/react";
import { getIconByName } from "@/utils/iconUtils";

// Common Phosphor icon names that might be useful for categories
const commonIcons = ["Folder", "Package", "ShoppingBag", "ShoppingCart", "Wrench", "Tools", "Hammer", "PaintBrush", "PaintBucket", "Scissors", "Pen", "Pencil", "Book", "Books", "Bookmarks", "FileText", "FilePlus", "FileX", "Backpack", "Suitcase", "Car", "Bicycle", "Camera", "CameraPlus", "Devices", "DeviceMobile", "DeviceTablet", "Computer", "Laptop", "Desktop", "Keyboard", "Mouse", "Monitor", "Printer", "Television", "Clock", "ClockClockwise", "Calendar", "CalendarPlus", "GlobeSimple", "Map", "MagnifyingGlass", "MusicNotes", "PlayCircle", "Headphones", "Microphone", "Heart", "Star", "Lightning", "Sun", "Moon", "Cloud", "CloudRain", "Leaf", "Plant", "Tree", "FlowerLotus", "Cake", "Coffee", "Cookie", "Pizza", "ForkKnife", "Baby", "Bathtub", "FirstAid", "Bandaids", "Stethoscope", "Bed", "Couch", "Armchair", "Table", "Chair", "Lamp"];

interface IconSelectorProps {
  onSelect: (iconName: string) => void;
  onClose: () => void;
}

export function IconSelector({ onSelect, onClose }: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIcons = searchTerm ? commonIcons.filter((icon) => icon.toLowerCase().includes(searchTerm.toLowerCase())) : commonIcons;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Kies een icoon</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} weight="bold" />
        </button>
      </div>

      <div>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primarygreen-1 focus:border-primarygreen-1" placeholder="Zoek iconen..." />
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 max-h-96 overflow-y-auto p-2">
        {filteredIcons.map((iconName) => {
          const IconComponent = getIconByName(iconName);
          return (
            <div key={iconName} className="flex flex-col items-center p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 hover:border-primarygreen-1 transition-all" onClick={() => onSelect(iconName)} title={iconName}>
              <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-md">
                <IconComponent size={24} />
              </div>
              <span className="text-xs text-gray-600 truncate w-full text-center mt-1">{iconName}</span>
            </div>
          );
        })}

        {filteredIcons.length === 0 && <div className="col-span-full py-8 text-center text-gray-500">Geen iconen gevonden voor "{searchTerm}"</div>}
      </div>
    </div>
  );
}
