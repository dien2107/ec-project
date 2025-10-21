import instance from "./customize-axios";
import type { UpdateProductVariant } from "~/features/system/product-variants/types/update-product-variant";

export const updateProductVariant = async (
  productId: number,
  productVariantId: number,
  data: UpdateProductVariant
) => {
  try {
    const response = await instance.patch(
      `/products/${productId}/variants/${productVariantId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const addProductVariant = async (productId: number, sizeId: number) => {
  try {
    const response = await instance.post(`/products/${productId}/variants`, {
      sizeId,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const deleteProductVariant = async (
  productId: number,
  productVariantId: number
) => {
  try {
    const response = await instance.delete(
      `/products/${productId}/variants/${productVariantId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
