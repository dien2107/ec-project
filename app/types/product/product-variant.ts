import type { Status } from "~/types/status";
import type { Color } from "./color";
import type { Size } from "./size";

export type ProductVariant = {
  productVariantId: number;
  productId: number;
  sku: string;
  size: Size;
  color: Color;
  status: Status;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductVariantForReview = Omit<
  ProductVariant,
  "stockQuantity" | "createdAt" | "updatedAt" | "status"
>;
