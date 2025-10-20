export type FilterState = {
  colorIds?: number[];
  materialIds?: number[];
  productGroupIds?: number[];
  orderBy?: string;
  minPrice?: number;
  maxPrice?: number;
  outOfStock?: boolean;
  inStock?: boolean;
  pageNumber?: number;
  pageSize?: number;
};

export type ProductCategorySlugFilterProps = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
};
