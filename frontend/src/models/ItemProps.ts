export default interface ItemProps {
  id: number;
  title: string;
  pricePerWeek?: number;
  imageSrc: string;
  status: string;
  description?: string;
  howToUse?: string;
  accessories?: string;
  dimensions?: string;
  weight?: number;
  tip?: string;
  whatsIncluded?: string;
  category?: string;
  lockerId?: number | null;
  availability?: {
    start: string;
    end: string;
  };
  specifications?: Record<string, string>;
}
