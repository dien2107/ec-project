import type { ProductFormMeta } from "./product-form-meta";

export type ProductFilterProps = {
  filters: {
    materialId: number | undefined;
    colorId: number | undefined;
    categoryId: number | undefined;
    productGroupId: number | undefined;
    statusName: string | undefined;
    search: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      materialId: number | undefined;
      colorId: number | undefined;
      categoryId: number | undefined;
      productGroupId: number | undefined;
      statusName: string | undefined;
      search: string;
    }>
  >;
  meta: ProductFormMeta;
};
