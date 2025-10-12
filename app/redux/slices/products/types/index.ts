export interface Category {
  categoryId: number;
  name: string;
}

export interface Color {
  colorId: number;
  name: string;
}

export interface Material {
  materialId: number;
  name: string;
}

export interface ProductGroup {
  productGroupId: number;
  name: string;
}

export interface ProductFormMeta {
  categories: Category[];
  materials: Material[];
  colors: Color[];
  productGroups: ProductGroup[];
}

export interface ApiResponse<T> {
  status: number;
  isSuccess: boolean;
  message: string;
  data: T;
}
