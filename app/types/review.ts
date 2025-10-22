import type { Status } from "~/types/status";
import type { ProductVariantForReview } from "~/types/product/product-variant";

type OrderItem = {
  orderItemId: number;
  productVariant: ProductVariantForReview;
};

export type ReviewImage = {
  reviewImageId: number;
  imageUrl: string;
  altText: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Review = {
  reviewId: number;
  rating: number;
  comment: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  status: Status;
  orderItem: OrderItem;
  reviewImages: ReviewImage[];
  username: string;
};
