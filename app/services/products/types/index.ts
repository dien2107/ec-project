export interface CreateProduct {
  name: string;
  slug: string;
  materialId: number;
  categoryId: number;
  productGroupId: number;
  discountPercentage: number;
  fileImage: File;
  altText?: string;
}

export interface UpdateProduct {
  name: string;
  slug: string;
  colorId: number;
  materialId: number;
  categoryId: number;
  discountPercentage: number;
}
