import type { Status } from "~/types/status";
import type { Material } from "./material";
import type { Category } from "./category";
import type { Color } from "./color";
import type { ProductGroup } from "./product-group";

export type PrimaryImage = {
  productImageId: number;
  imageUrl: string;
  altText: string;
};

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
