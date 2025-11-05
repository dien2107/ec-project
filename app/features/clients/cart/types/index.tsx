export interface AvailableVariant {
  productVariantId: number;
  sizeId: number;
  sizeName: string;
  stockQuantity: number;
}

export interface CartItemData {
  id: string;
  variantId: number;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  selected: boolean;
  slug?: string;
  productId?: number;
  availableVariants?: AvailableVariant[];
  basePrice?: number;
  discountPercentage?: number;
  sellingPrice?: number;
}
