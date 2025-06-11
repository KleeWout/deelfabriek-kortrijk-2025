import { getIconByName } from "../../utils/iconUtils";

interface CategoryProps {
  iconName?: string;
  title: string;
  onClick: () => void;
  isSelected: boolean;
}

export function CategoryCard({ title, iconName, onClick, isSelected }: CategoryProps) {
  // Get the icon component based on the iconName
  const IconComponent = getIconByName(iconName || 'list');

  return (
    <div className={`flex px-4 py-1.5 justify-center items-center gap-2.5 place-self-stretch rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${isSelected ? "bg-primarygreen-1 text-white" : "bg-white hover:bg-gray-50"}`} onClick={onClick}>
      {iconName && <IconComponent size={20} weight="regular" color={isSelected ? "#FFFFFF" : "#202020"} />}
      <p className={`text-sm font-medium ${isSelected ? "text-white" : "text-primarytext-1"}`}>{title}</p>
    </div>
  );
}
