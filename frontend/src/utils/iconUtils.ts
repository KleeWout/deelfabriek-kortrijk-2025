import * as PhosphorIcons from "@phosphor-icons/react";

export function getIconByName(iconName: string) {
  // Check if the icon exists in PhosphorIcons
  if (iconName in PhosphorIcons) {
    return (PhosphorIcons as any)[iconName];
  }

  // Return default icon if not found
  return PhosphorIcons.WrenchIcon;
}
