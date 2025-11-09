import instance from "./customize-axios";

export const createPurchaseOrder = async (data: any) => {
  try {
    const response = await instance.post("/purchase-orders", data);
    return response.data;
  } catch (error) {
    console.error("Error creating purchase order:", error);
    throw error;
  }
};

export const getPurchaseOrderById = async (id: string) => {
  try {
    const response = await instance.get(`/purchase-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching purchase order:", error);
    throw error;
  }
};

export const getPurchaseOrderDetail = async (id: number | string) => {
  try {
    const response = await instance.get(`/purchase-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching purchase order detail:", error);
    throw error;
  }
};

export const updatePurchaseOrder = async (id: string, data: any) => {
  try {
    const response = await instance.put(`/purchase-orders/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating purchase order:", error);
    throw error;
  }
};

export const deletePurchaseOrder = async (id: string) => {
  try {
    const response = await instance.delete(`/purchase-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting purchase order:", error);
    throw error;
  }
};
export const updateStatusPurchaseOrder = async (
  id: string,
  statusId: number
) => {
  try {
    const response = await instance.put(
      `/purchase-orders/${id}/status/${statusId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating purchase order status:", error);
    throw error;
  }
};
export const cancelPurchaseOrder = async (id: string) => {
  try {
    const response = await instance.put(`/purchase-orders/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling purchase order:", error);
    throw error;
  }
};
export const getPurchaseOrderStats = async () => {
  const response = await instance.get("/purchase-orders/statistics");
  return response.data;
};
