import instance from "../customize-axios";
// import type {} from "./types";

export const uploadSingleProductImage = async (
  productId: number,
  formData: FormData
) => {
  try {
    const response = await instance.post(
      `/products/${productId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getAllImagesByProductId = async (productId: number) => {
  try {
    const response = await instance.get(`/products/${productId}/images`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product images:", error);
    throw error;
  }
};
