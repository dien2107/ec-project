import type { Status } from "~/types/status";

import type {
  Material,
  Color,
  Category,
  ProductGroup,
} from "../../../../types/product/product";

export type ProductFormMeta = {
  materials: Material[];
  colors: Color[];
  categories: Category[];
  productGroups: ProductGroup[];
  statuses: Status[];
};
