export default interface CreateItemProps {
  id?: number; // Optional ID for existing items
  file?: File; // Optional file for image upload
  title: string;
  pricePerWeek?: number;
  howToUse?: string;
  accessories?: string;
  weight?: number;
  dimensions?: string;
  tip?: string;
  status: string;
  description?: string;
}
