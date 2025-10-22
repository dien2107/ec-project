import type { Status } from "~/types/status";
import type { Material } from "./material";
import type { Category } from "./category";
import type { Color } from "./color";
import type { ProductGroup, ProductGroupDetail } from "./product-group";
import type { PrimaryImage } from "./product-image";
import type { ProductVariant } from "./product-variant";

export type Product = {
  productId: number;
  name: string;
  slug: string;
  basePrice: number;
  discountPercentage: number;
  sellingPrice: number;
  createdAt: Date;
  updatedAt: Date;
  material: Material;
  category: Category;
  color: Color;
  productGroup: ProductGroup;
  status: Status;
  primaryImage: PrimaryImage;
};

export type ProductDetail = {
  productId: number;
  name: string;
  slug: string;
  basePrice: number;
  discountPercentage: number;
  sellingPrice: number;
  rating: number;
  reviewCount: number;
  soldQuantity: number;
  createdAt: Date;
  updatedAt: Date;
  material: Material;
  category: Category;
  color: Color;
  productVariants: ProductVariant[];
  productGroup: ProductGroup;
  status: Status;
  primaryImage: PrimaryImage;
  relatedProducts: Product[];
};
