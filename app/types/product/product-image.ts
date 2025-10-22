export type PrimaryImage = {
  productImageId: number;
  imageUrl: string;
  altText: string;
};

export type ProductImage = {
  productImageId: number;
  isPrimary: boolean;
  displayOrder: number;
  imageUrl: string;
  altText: string;
  createdAt: Date;
  updatedAt: Date;
};
