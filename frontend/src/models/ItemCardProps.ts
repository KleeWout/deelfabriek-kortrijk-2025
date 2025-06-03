import ItemProps from "./ItemProps";

export interface ItemCardProps extends ItemProps {
  index: number;
  baseRoute?: string; // Optional prop to specify the base route
}