interface LockerProps {
  id: number;
  lockerNumber: number;
  isOpen: boolean;
  itemId: number | null;
  item: any | null;
  itemTitle: string | null;
  // Add derived fields for backwards compatibility
  status?: "Beschikbaar" | "Bezet" | "Onderhoud";
  itemName?: string;
}

export default LockerProps;
