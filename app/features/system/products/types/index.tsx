export type Product = {
  id: string;
  name: string;
  slug: string;
  material_id: number;
  category_id: number;
  base_price: number;
  sale_price: number;
  discount_percent: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};
