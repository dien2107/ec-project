import instance from "./customize-axios";

export const createCategory = async (data: FormData) => {
  try {
    const response = await instance.post("/categories", data);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const getCategory = async (categoryId: number) => {
  try {
    const response = await instance.get(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

export const updateCategory = async (categoryId: number, data: any) => {
  try {
    const response = await instance.patch(`/categories/${categoryId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: number) => {
  try {
    const response = await instance.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const getCategoryHierarchy = async () => {
  try {
    const response = await instance.get("/categories/hierarchy");
    return response.data;
  } catch (error) {
    console.error("Error fetching category hierarchy:", error);
    throw error;
  }
};
