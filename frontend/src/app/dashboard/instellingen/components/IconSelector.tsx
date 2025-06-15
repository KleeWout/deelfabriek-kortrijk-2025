"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { X, MagnifyingGlass, Info, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { getIconByName } from "@/utils/iconUtils";
import * as PhosphorIcons from "@phosphor-icons/react";

// Create a proper type for the icon translations
type IconName = "Folder" | "Package" | "Lego" | "ShoppingBag" | "Wrench" | "Tools" | "Hammer" | "Drill" | "Saw" | "Screwdriver" | "Toolbox" | "HardHat" | "Ladder" | "Pen" | "Pencil" | "Palette" | "Brush" | "FileText" | "FilePlus" | "Printer" | "Computer" | "Laptop" | "Keyboard" | "Mouse" | "Monitor" | "Car" | "Bicycle" | "Truck" | "Van" | "Boat" | "Camera" | "Video" | "DeviceMobile" | "DeviceTablet" | "Television" | "Speaker" | "Headphones" | "Microphone" | "GameController" | "Tent" | "Backpack" | "Compass" | "Bed" | "Couch" | "Table" | "Chair" | "Lamp" | "Music" | "MusicNotes" | "Coffee" | "Calendar" | "Sun" | "Umbrella" | "Leaf" | "Plant" | "Tree" | "Heart" | "Star" | "Map" | "MagnifyingGlass";

// Icon mapping with Dutch translations and keywords
const iconTranslations: Record<IconName, string[]> = {
  // General Categories
  Folder: ["map", "folder", "bestand", "opslag"],
  Package: ["pakket", "doos", "verzending", "levering"],
  ShoppingBag: ["winkeltas", "tas", "boodschappen", "winkelen"],

  // Tools & Equipment
  Wrench: ["sleutel", "moersleutel", "gereedschap", "reparatie"],
  Tools: ["gereedschap", "werktuigen", "tools"],
  Hammer: ["hamer", "klop", "timmer", "bouw"],
  Drill: ["boor", "boormachine", "gat", "boren"],
  Saw: ["zaag", "zagen", "hout", "snijden"],
  Screwdriver: ["schroevendraaier", "schroef", "draaien"],
  Toolbox: ["gereedschapskist", "gereedschap", "kist", "opberg"],
  HardHat: ["helm", "bouwhelm", "veiligheid", "bescherming"],
  Ladder: ["ladder", "trap", "klimmen", "hoogte"],

  // Creative & Arts
  Pen: ["pen", "schrijven", "tekenen", "balpen"],
  Pencil: ["potlood", "schrijven", "tekenen", "schetsen"],
  Palette: ["palet", "verf", "schilderen", "kleuren"],
  Brush: ["kwast", "penseel", "schilderen", "verf"],

  // Office & Documents
  FileText: ["bestand", "document", "tekst", "papier"],
  FilePlus: ["nieuw bestand", "toevoegen", "document", "maken"],
  Printer: ["printer", "afdrukken", "printen", "papier"],
  Computer: ["computer", "pc", "bureau", "werken"],
  Laptop: ["laptop", "notebook", "draagbaar", "computer"],
  Keyboard: ["toetsenbord", "typen", "invoer", "letters"],
  Mouse: ["muis", "klikken", "computer", "cursor"],
  Monitor: ["monitor", "scherm", "beeldscherm", "display"],

  // Transportation
  Car: ["auto", "wagen", "voertuig", "rijden"],
  Bicycle: ["fiets", "rijwiel", "fietsen", "pedaal"],
  Truck: ["vrachtwagen", "truck", "lading", "transport"],
  Van: ["bestelwagen", "busje", "transport", "verhuizen"],
  Boat: ["boot", "schip", "water", "varen"],

  // Photography & Video
  Camera: ["camera", "fototoestel", "foto", "maken"],
  Video: ["video", "film", "opnemen", "bewegend"],

  // Electronics & Devices
  DeviceMobile: ["telefoon", "mobiel", "smartphone", "bellen"],
  DeviceTablet: ["tablet", "ipad", "scherm", "aanraken"],
  Television: ["televisie", "tv", "scherm", "kijken"],
  Speaker: ["luidspreker", "geluid", "muziek", "audio"],
  Headphones: ["koptelefoon", "hoofdtelefoon", "luisteren", "audio"],
  Microphone: ["microfoon", "opnemen", "geluid", "stem"],
  GameController: ["gamecontroller", "spel", "gamen", "joystick"],

  // Outdoor & Sports
  Tent: ["tent", "kamperen", "slapen", "outdoor"],
  Backpack: ["rugzak", "tas", "wandelen", "reizen"],
  Compass: ["kompas", "richting", "navigatie", "noorden"],

  // Home & Furniture
  Bed: ["bed", "slapen", "matras", "rust"],
  Couch: ["bank", "zetel", "sofa", "zitten"],
  Table: ["tafel", "eten", "werken", "blad"],
  Chair: ["stoel", "zitten", "rug", "poot"],
  Lamp: ["lamp", "licht", "verlichting", "schijn"],

  // Party & Events
  Music: ["muziek", "geluid", "liedje", "noot"],
  MusicNotes: ["muzieknoten", "noten", "melodie", "liedje"],

  // Kitchen & Appliances
  Coffee: ["koffie", "drinken", "warm", "bonen"],

  // Utility & Time
  Calendar: ["kalender", "datum", "dag", "maand"],

  // Seasonal & Weather
  Sun: ["zon", "warm", "licht", "dag"],
  Umbrella: ["paraplu", "regen", "bescherming", "nat"],

  // Garden & Lawn
  Leaf: ["blad", "boom", "groen", "natuur"],
  Plant: ["plant", "groen", "groeien", "water"],
  Tree: ["boom", "hout", "groen", "tak"],

  // Miscellaneous
  Heart: ["hart", "liefde", "rood", "leven"],
  Star: ["ster", "punt", "hemel", "nacht"],
  Map: ["kaart", "navigatie", "richting", "weg"],
  MagnifyingGlass: ["vergrootglas", "zoeken", "kijken", "groot"],
  Lego: ["lego", "bouwstenen", "speelgoed", "constructie"],
};

const commonIcons = Object.keys(iconTranslations) as IconName[];

interface IconSelectorProps {
  onSelect: (iconName: string) => void;
  onClose: () => void;
}

export function IconSelector({ onSelect, onClose }: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIconIndex, setSelectedIconIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [customIcon, setCustomIcon] = useState("");
  const [customIconError, setCustomIconError] = useState<string | null>(null);
  const [customIconValid, setCustomIconValid] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const iconsContainerRef = useRef<HTMLDivElement>(null);

  // Memoize filtered icons to improve performance
  const filteredIcons = searchTerm
    ? commonIcons.filter((iconName) => {
        const translations = iconTranslations[iconName];
        const searchLower = searchTerm.toLowerCase();

        return iconName.toLowerCase().includes(searchLower) || translations.some((translation) => translation.toLowerCase().includes(searchLower));
      })
    : commonIcons;

  // Focus search input on component mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Update selected icon index when filtered icons change
  useEffect(() => {
    setSelectedIconIndex(filteredIcons.length > 0 ? 0 : -1);
  }, [filteredIcons]);

  // Show loading state when filtering large sets
  useEffect(() => {
    if (searchTerm) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [searchTerm]);

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (filteredIcons.length === 0) return;

    switch (e.key) {
      case "ArrowRight":
        setSelectedIconIndex((prev) => (prev < filteredIcons.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowLeft":
        setSelectedIconIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "ArrowUp": {
        const cols = window.innerWidth < 640 ? 4 : window.innerWidth < 768 ? 6 : 8;
        setSelectedIconIndex((prev) => {
          const newIndex = prev - cols;
          return newIndex >= 0 ? newIndex : prev;
        });
        break;
      }
      case "ArrowDown": {
        const cols = window.innerWidth < 640 ? 4 : window.innerWidth < 768 ? 6 : 8;
        setSelectedIconIndex((prev) => {
          const newIndex = prev + cols;
          return newIndex < filteredIcons.length ? newIndex : prev;
        });
        break;
      }
      case "Enter":
        if (selectedIconIndex >= 0) {
          onSelect(filteredIcons[selectedIconIndex]);
        }
        break;
      case "Escape":
        onClose();
        break;
      default:
        break;
    }
  };

  // Scroll selected icon into view
  useEffect(() => {
    if (selectedIconIndex >= 0 && iconsContainerRef.current) {
      const selectedElement = iconsContainerRef.current.children[selectedIconIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIconIndex]);

  // Clear search term
  const handleClearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  // Validate custom icon as user types
  useEffect(() => {
    if (!customIcon) {
      setCustomIconError(null);
      setCustomIconValid(false);
      return;
    }

    const iconExists = customIcon in PhosphorIcons;
    if (iconExists) {
      setCustomIconValid(true);
      setCustomIconError(null);
    } else {
      setCustomIconValid(false);
      if (customIcon.length > 2) {
        setCustomIconError("Dit icoon bestaat niet in Phosphor Icons");
      } else {
        setCustomIconError(null);
      }
    }
  }, [customIcon]);

  // Handle custom icon submission
  const handleCustomIconSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Make sure the icon name has 'Icon' suffix if needed
    let finalIconName = customIcon.trim();

    // Check if the icon exists in PhosphorIcons
    if (finalIconName in PhosphorIcons) {
      onSelect(finalIconName);
    } else {
      // Try with 'Icon' suffix
      const nameWithIconSuffix = `${finalIconName}Icon`;
      if (nameWithIconSuffix in PhosphorIcons) {
        onSelect(nameWithIconSuffix);
      } else {
        setCustomIconError("Dit icoon bestaat niet in Phosphor Icons. Controleer de naam op phosphoricons.com");
      }
    }
  };

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Kies een icoon</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Sluiten">
          <X size={20} weight="bold" />
        </button>
      </div>

      {/* Search box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlass size={18} className="text-gray-400" />
        </div>
        <input ref={searchInputRef} type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primarygreen-1 focus:border-primarygreen-1" placeholder="Zoek iconen... (bijv. auto, gereedschap, camera)" aria-label="Zoek iconen" />
        {searchTerm && (
          <button onClick={handleClearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600" aria-label="Zoekopdracht wissen">
            <X size={16} />
          </button>
        )}
      </div>
      {/* Custom icon input */}
      <div className="border-t border-gray-200 pt-3 mt-2">
        <div className="flex items-center mb-1">
          <h4 className="text-sm font-medium text-gray-700">Aangepast icoon</h4>
          <a href="https://phosphoricons.com/" target="_blank" rel="noopener noreferrer" className="ml-1 text-primarygreen-1 hover:text-primarygreen-2 inline-flex items-center" title="Bekijk alle beschikbare PhosphorIcons">
            <Info size={14} />
          </a>
        </div>
        <form onSubmit={handleCustomIconSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <input type="text" value={customIcon} onChange={(e) => setCustomIcon(e.target.value)} className={`w-full px-3 py-2 border ${customIconError ? "border-red-300 focus:ring-red-300 focus:border-red-300" : customIconValid && customIcon ? "border-green-300 focus:ring-green-300 focus:border-green-300" : "border-gray-300 focus:ring-primarygreen-1 focus:border-primarygreen-1"} rounded-md shadow-sm focus:outline-none`} placeholder="Voer icoon naam in (bijv. CaretRight)" />
            {customIcon && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">{customIconValid ? <CheckCircle size={16} className="text-green-500" /> : customIconError ? <WarningCircle size={16} className="text-red-500" /> : null}</div>}
          </div>
          <button type="submit" disabled={!customIconValid || !customIcon.trim()} className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primarygreen-1 hover:bg-primarygreen-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primarygreen-1 disabled:opacity-50">
            Toepassen
          </button>
        </form>
        {customIconError && <p className="text-xs text-red-500 mt-1">{customIconError}</p>}
        <div className="flex flex-col mt-1">
          <p className="text-xs text-gray-500">
            Bekijk alle iconen op{" "}
            <a href="https://phosphoricons.com/" target="_blank" rel="noopener noreferrer" className="text-primarygreen-1 hover:underline">
              phosphoricons.com
            </a>{" "}
            en voer de exacte naam in (zonder "Icon" achtervoegsel).
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Voorbeeld: voor <code className="bg-gray-100 px-1 py-0.5 rounded">CaretRight</code> op de website, gebruik <code className="bg-gray-100 px-1 py-0.5 rounded">CaretRight</code> als naam.
          </p>
        </div>
      </div>

      {/* Icon grid */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primarygreen-1"></div>
        </div>
      ) : (
        <div ref={iconsContainerRef} className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 max-h-72 overflow-y-auto p-2 border rounded" role="listbox" aria-label="Beschikbare iconen">
          {filteredIcons.map((iconName, index) => {
            const IconComponent = getIconByName(iconName);
            const translations = iconTranslations[iconName];
            const isSelected = index === selectedIconIndex;

            return (
              <div key={iconName} className={`flex flex-col items-center p-2 border rounded cursor-pointer transition-all ${isSelected ? "border-primarygreen-1 bg-primarygreen-1/10 ring-2 ring-primarygreen-1/50" : "border-gray-200 hover:bg-gray-50 hover:border-primarygreen-1"}`} onClick={() => onSelect(iconName)} onMouseEnter={() => setSelectedIconIndex(index)} title={`${iconName} (${translations[0]})`} role="option" aria-selected={isSelected} tabIndex={0}>
                <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-md">{IconComponent ? <IconComponent size={24} /> : null}</div>
                <span className="text-xs text-gray-600 truncate w-full text-center mt-1">{translations[0]}</span>
              </div>
            );
          })}

          {filteredIcons.length === 0 && <div className="col-span-full py-8 text-center text-gray-500">Geen iconen gevonden voor "{searchTerm}"</div>}
        </div>
      )}
    </div>
  );
}
