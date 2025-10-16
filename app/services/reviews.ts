import instance from "./customize-axios";

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
