import type { FilterState } from "~/features/clients/categories/types/product-category-slug-filter-props";
import instance from "./customize-axios";
import type { UpdateProduct } from "~/features/system/products/types/update-product";

export const createProduct = async (formData: FormData) => {
  try {
    const response = await instance.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const updateProduct = async (productId: number, data: UpdateProduct) => {
  try {
    const response = await instance.patch(`/products/${productId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId: number) => {
  try {
    const response = await instance.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const getProductFormMeta = async () => {
  try {
    const response = await instance.get("/products/form-meta");
    return response.data;
  } catch (error) {
    console.error("Error fetching product form meta:", error);
    throw error;
  }
};

export const getProductByCategorySlug = async (
  categorySlug: string,
  filters: FilterState
) => {
  try {
    const response = await instance.get(`/products/category/${categorySlug}`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product by category slug:", error);
    throw error;
  }
};
