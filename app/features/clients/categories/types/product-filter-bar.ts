export type FilterOption = {
  label: string;
  options?: string[];
  type?: "default" | "price";
};

export type ColorOption = {
  colorId: number;
  name: string;
  productCount: number;
};

export type MaterialOption = {
  materialId: number;
  name: string;
  productCount: number;
};

export type ProductGroupOption = {
  productGroupId: number;
  name: string;
  productCount: number;
};

export type StockStatusOption = {
  label: string;
  inStock: boolean;
  productCount: number;
};

export type ProductFilterOptions = {
  colorOptions: ColorOption[];
  materialOptions: MaterialOption[];
  productGroupOptions: ProductGroupOption[];
  stockStatusOptions: StockStatusOption[];
};
