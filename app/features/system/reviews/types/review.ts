export type ReviewStatus = {
  statusId: number;
  name: string;
  displayName: string;
  entityType: string;
};

export type ReviewSize = {
  sizeId: number;
  name: string;
};

export type ReviewColor = {
  colorId: number;
  name: string;
};

export type ReviewProductVariant = {
  productVariantId: number;
  productId: number;
  sku: string;
  size: ReviewSize;
  color: ReviewColor;
};

export type ReviewOrderItem = {
  orderItemId: number;
  productVariant: ReviewProductVariant;
};

export type ReviewImage = {
  reviewImageId: number;
  imageUrl: string;
  altText: string;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  reviewId: number;
  rating: number;
  comment: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  status: ReviewStatus;
  orderItem: ReviewOrderItem;
  reviewImages: ReviewImage[];
  username: string;
};
