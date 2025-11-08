import instance from "./customize-axios";

export type OrderItem = {
  productVariantId: number;
  quantity: number;
};

export type CreateOrderPayload = {
  userId: number;
  discountId: number | null;
  shipId: number | null;
  addressInfo: string;
  isFreeShip: boolean;
  shippingFee: number;
  items: OrderItem[];
};

export const createOrder = async (data: CreateOrderPayload) => {
  try {
    const response = await instance.post("/orders", data);
    return response.data;
  } catch (error) {
    console.error("Có lỗi khi tạo đơn hàng:", error);
    throw error;
  }
};

export const getOrderByUserId = async (userId: number) => {
  try {
    const response = await instance.get(`/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Có lỗi khi lấy đơn hàng:", error);
    throw error;
  }
};

export const getOrders = async (params?: Record<string, any>) => {
  try {
    const response = await instance.get(`/orders`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: number, newStatus: number) => {
  try {
    const response = await instance.put(`/orders/${orderId}`, newStatus);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};
export const approveOrder = async (orderId: number) => {
  try {
    const response = await instance.put(`/orders/approve/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error approving order:", error);
    throw error;
  }
};
export const cancelOrder = async (orderId: number) => {
  try {
    const response = await instance.put(`/orders/cancel/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};
export const completeOrder = async (orderId: number) => {
  try {
    const response = await instance.put(`/orders/complete/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error completing order:", error);
    throw error;
  }
};

export default {
  createOrder,
  getOrderByUserId,
  getOrders,
  updateOrderStatus,
};
