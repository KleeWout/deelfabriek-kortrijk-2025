export interface ItemProps {
  id: number;
  title: string;
  price: number;
  imageSrc: string;
  status: string;
  description?: string;
  category?: string;
  availability?: {
    start: string;
    end: string;
  };
  specifications?: Record<string, string>;
}