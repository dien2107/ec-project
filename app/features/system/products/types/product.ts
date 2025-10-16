import type { Status } from "~/types/status";

export type Material = {
  materialId: number;
  name: string;
};

export type Category = {
  categoryId: number;
  name: string;
};

export type Color = {
  colorId: number;
  name: string;
};

export type ProductGroup = {
  productGroupId: number;
  name: string;
};

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
