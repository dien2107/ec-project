import instance from "./customize-axios";

export const createColor = async (data: FormData) => {
  try {
    const response = await instance.post("/colors", data);
    return response.data;
  } catch (error) {
    console.error("Error creating color:", error);
    throw error;
  }
};

export const getColor = async (colorId: number) => {
  try {
    const response = await instance.get(`/colors/${colorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching color:", error);
    throw error;
  }
};

export const updateColor = async (colorId: number, data: any) => {
  try {
    const response = await instance.put(`/colors/${colorId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating color:", error);
    throw error;
  }
};

export const deleteColor = async (colorId: number) => {
  try {
    const response = await instance.delete(`/colors/${colorId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting color:", error);
    throw error;
  }
};

export const getAllColors = async () => {
  try {
    const response = await instance.get(`/colors`);
    return response.data;
  } catch (error) {
    console.error("Error fetching colors:", error);
    throw error;
  }
};
