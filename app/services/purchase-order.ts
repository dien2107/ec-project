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
export const updateStatusPurchaseOrder = async (id: string, statusId: number) => {
    try {
        const response = await instance.patch(`/purchase-orders/${id}/status/${statusId}`);
        return response.data;
    } catch (error) {
        console.error("Error updating purchase order status:", error);
        throw error;
    }
};