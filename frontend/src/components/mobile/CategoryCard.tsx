import * as PhosphorIcons from "@phosphor-icons/react";


interface CategoryProps {
  title: string;
  iconName: string;

  //later toevoegen om categorieën te kunnen selecteren
  onClick?: () => void;
}

 function getIconByName(iconName: string) {
 // Check if the icon exists
  if (iconName in PhosphorIcons) {
    return (PhosphorIcons as any)[iconName];
  }
  
  // Default icon
  return PhosphorIcons.WrenchIcon;
}


export function CategoryCard({ title, iconName, onClick }: CategoryProps) {
  // Get the icon component based on the iconName
  const IconComponent = getIconByName(iconName);
  
  return (
    <div 
      className="flex px-4 py-1.5 justify-center items-center gap-2.5 place-self-stretch rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      <IconComponent size={20} weight="regular" />
      <p className="text-sm font-medium">{title}</p>
    </div>
  );
}



