export type PriceRange = {
  label: String;
  min: Number;
  max: Number;
};

export type CategoryFilters = {
  price: PriceRange | null;
  size: String | null;
  color: String | null;
};

export type ProductCard = {
  id: number;
  title: string;
  image: string;
  price: number;
  oldPrice: number;
  discount: number;
};
