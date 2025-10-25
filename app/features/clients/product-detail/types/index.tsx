import type { PrimaryImage } from "~/types/product/product-image";
import type { ProductVariant } from "~/types/product/product-variant";

export type ProductImageGalleryProps = {
  product_image_id: number;
  product_id: number;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
};

export type SelectedProductProps = {
  productVariant: ProductVariant | null;
  quantity: number;
  price: number;
  image: PrimaryImage | null;
};

export type StarRatingRowProps = {
  stars: number;
  value: number;
  count: number;
};
