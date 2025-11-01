import instance from "./customize-axios";

export const createMaterial = async (data: FormData) => {
  try {
    const response = await instance.post("/materials", data);
    return response.data;
  } catch (error) {
    console.error("Error creating material:", error);
    throw error;
  }
};

export const getMaterial = async (materialId: number) => {
  try {
    const response = await instance.get(`/materials/${materialId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching material:", error);
    throw error;
  }
};

export const updateMaterial = async (materialId: number, data: any) => {
  try {
    const response = await instance.patch(`/materials/${materialId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating material:", error);
    throw error;
  }
};

export const deleteMaterial = async (materialId: number) => {
  try {
    const response = await instance.delete(`/materials/${materialId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting material:", error);
    throw error;
  }
};
