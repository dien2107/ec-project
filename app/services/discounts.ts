import instance from "./customize-axios";

export const createDiscount = async (data: FormData) => {
  try {
    const response = await instance.post("/discounts", data);
    return response.data;
  } catch (error) {
    console.error("Error creating discount:", error);
    throw error;
  }
};

export const getDiscount = async (discountId: number) => {
  try {
    const response = await instance.get(`/discounts/${discountId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching discount:", error);
    throw error;
  }
};

export const updateDiscount = async (discountId: number, data: any) => {
  try {
    const response = await instance.patch(`/discounts/${discountId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating discount:", error);
    throw error;
  }
};

export const deleteDiscount = async (discountId: number) => {
  try {
    const response = await instance.delete(`/discounts/${discountId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting discount:", error);
    throw error;
  }
};

export const updateInactiveDiscounts = async () => {
  try {
    const response = await instance.post("/discounts/update-inactive", {}); // gửi body rỗng
    return {
      success: true,
      updatedCount: response?.data?.data ?? 0,
    };
  } catch (error) {
    console.error("Error updating inactive discounts:", error);
    return { success: false, updatedCount: 0 };
  }
};
