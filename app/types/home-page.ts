import type { ApiResponse } from "./api-response";

export type Category = {
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  children: Category[];
};
export type Product = {
  productId: number;
  name: string;
  thumbnail: string;
  price: number;
  salePrice: number | null;
  soldQuantity: number;
  discountPercentage: number;
};

export type HomeData = {
  categories: Category[];
  bestSellingProducts: Product[];
  onSaleProducts: Product[];
  bestSellingCategories: Category[];
};

export type HomeResponse = ApiResponse<HomeData>;
