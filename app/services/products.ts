import type { FilterState } from "~/features/clients/categories/types/product-category-slug-filter-props";
import instance from "./customize-axios";
import type { UpdateProduct } from "~/features/system/products/types/update-product";
import qs from "qs";

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

export const getProductCatelog = async (filters: FilterState) => {
  try {
    const params = {
      CategorySlug: filters.categorySlug,
      Search: filters.search,
      ColorIds: filters.colorIds,
      MaterialIds: filters.materialIds,
      ProductGroupIds: filters.productGroupIds,
      OrderBy: filters.orderBy,
      MinPrice: filters.minPrice,
      MaxPrice: filters.maxPrice,
      OutOfStock: filters.outOfStock,
      InStock: filters.inStock,
      PageNumber: filters.pageNumber,
      PageSize: filters.pageSize,
    };

    const response = await instance.get(`/products/catelog`, {
      params,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching product by category slug:", error);
    throw error;
  }
};

export const getProductDetailBySlug = async (slug: string) => {
  try {
    const response = await instance.get(`/products/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product detail by slug:", error);
    throw error;
  }
};
export const get5ProductsSuggestBySearch = async (search: string) => {
  try {
    const response = await instance.get(`/products/search`, {
      params: { search },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suggested products:", error);
    throw error;
  }
};

export const getTop10RelatedProducts = async (
  categoryId: number,
  productId: number
) => {
  try {
    const response = await instance.get(`/products/top-related`, {
      params: { categoryId, productId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
};
