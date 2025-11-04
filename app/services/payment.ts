import instance from "./customize-axios";

export type CreatePaymentPayload = {
  orderId: number;
  amount: number;
  description: string;
};

export type PaymentResponse = {
  isSuccess: boolean;
  qrCodeUrl?: string;
  message?: string;
  transactionId: string;
  accountName: string;
  imageUrl: string;
};

export const createPayment = async (data: CreatePaymentPayload) => {
  try {
    const response = await instance.post("payments/create-payment", data);
    return response.data as PaymentResponse;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

export const getOrderStatus = async (orderId: number) => {
  try {
    const response = await instance.get(`payments/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order status:", error);
    throw error;
  }
};

export default {
  createPayment,
  getOrderStatus,
};
