import instance from "./customize-axios";

export const createSize = async (data: FormData) => {
  try {
    const response = await instance.post("/sizes", data);
    return response.data;
  } catch (error) {
    console.error("Error creating size:", error);
    throw error;
  }
};

export const getSize = async (sizeId: number) => {
  try {
    const response = await instance.get(`/sizes/${sizeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching size:", error);
    throw error;
  }
};

export const updateSize = async (sizeId: number, data: any) => {
  try {
    const response = await instance.patch(`/sizes/${sizeId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating size:", error);
    throw error;
  }
};

export const deleteSize = async (sizeId: number) => {
  try {
    const response = await instance.delete(`/sizes/${sizeId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting size:", error);
    throw error;
  }
};
