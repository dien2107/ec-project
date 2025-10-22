import instance from "./customize-axios";
import type { FilterState } from "~/features/clients/product-detail/types/review-filter-props";

export const getReviewById = async (reviewId: number) => {
  try {
    const response = await instance.get(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching review:", error);
    throw error;
  }
};

export const hideReviewById = async (reviewId: number) => {
  try {
    const response = await instance.patch(`/reviews/${reviewId}/status`);
    return response.data;
  } catch (error) {
    console.error("Error hiding review:", error);
    throw error;
  }
};

export const getReviewsByProductId = async (
  productId: number,
  filters: FilterState
) => {
  try {
    const params = { ...(filters ?? {}) };
    const response = await instance.get(`/reviews/product/${productId}`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews for product:", error);
    throw error;
  }
};
