export type ProductImageGalleryProps = {
  product_image_id: number;
  product_id: number;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
};

export type SelectedProductProps = {
  sizeId: number | null;
  colorId: number | null;
  quantity: number;
};
