import type {
  Material,
  Color,
  Category,
  ProductGroup,
  Status,
} from "./product";

export type ProductFormMeta = {
  materials: Material[];
  colors: Color[];
  categories: Category[];
  productGroups: ProductGroup[];
  statuses: Status[];
};
