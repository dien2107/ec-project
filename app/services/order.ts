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

export const updateOrderById = async (orderId: number, data: any) => {
  try {
    const response = await instance.put(`/orders/${orderId}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

export default {
  createOrder,
  getOrderByUserId,
  getOrders,
  updateOrderById,
};
