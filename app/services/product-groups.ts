import instance from "./customize-axios";

// Create a new product group
export const createProductGroup = async (data: FormData) => {
  try {
    const response = await instance.post("/productgroup", data);
    return response.data;
  } catch (error) {
    console.error("Error creating product group:", error);
    throw error;
  }
};

// Get a product group by ID
export const getProductGroup = async (productGroupId: number) => {
  try {
    const response = await instance.get(`/productgroup/${productGroupId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product group:", error);
    throw error;
  }
};

// Update an existing product group
export const updateProductGroup = async (productGroupId: number, data: any) => {
  try {
    const response = await instance.patch(
      `/productgroup/${productGroupId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product group:", error);
    throw error;
  }
};

// Delete a product group by ID
export const deleteProductGroup = async (productGroupId: number) => {
  try {
    const response = await instance.delete(`/productgroup/${productGroupId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product group:", error);
    throw error;
  }
};
