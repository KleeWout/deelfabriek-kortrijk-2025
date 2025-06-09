export interface ReservationData {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    street: string;
    bus?: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  };
  itemId: number;
  weeks: number;
}