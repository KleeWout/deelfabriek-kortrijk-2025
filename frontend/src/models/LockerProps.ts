interface LockerProps {
  id: number;
  lockerNumber: number;
  status: "Beschikbaar" | "Bezet" | "Onderhoud";
  itemId: number | null;
  itemName?: string;
}

export default LockerProps;
