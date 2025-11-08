import instance from "./customize-axios";
// types/product-return.ts
export type OrderDto = {
  orderId: number;
  addressInfo: string;
  userId: number;
  totalAmount: number;
  isFreeShip: boolean;
  shippingFee: number;
  createdAt: string;
};

export type UserOrderDto = {
  userId: number;
  fullName: string;
};

export type ProductReturnResponse = {
  returnId: number;
  orderItemId: number;
  returnType: 1 | 2;
  returnReason: string;
  returnAmount: number | null;
  returnProductVariantId: number | null;
  statusId: number;
  statusName: string;
  productName: string;
  returnProductName: string | null;
  productImageUrl: string;
  orderDto: OrderDto;
  userOrderDto: UserOrderDto;
  createdAt: string;
};

export type ProductReturnListResponse = {
  status: number;
  isSuccess: boolean;
  message: string;
  data: ProductReturnResponse[];
};

export type ProductReturnRequest = {
  orderId: number;
  returnType: 1 | 2;
  productVariantId: number;
  quantity: number;
  reason?: string;
};
// services/product-return.ts

export const createProductReturn = async (
  data: ProductReturnRequest
): Promise<ProductReturnResponse> => {
  try {
    const response = await instance.post<ProductReturnResponse>(
      "/product-returns",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Có lỗi khi tạo phiếu trả hàng:", error);
    throw error;
  }
};

// New minimal payload type requested by UI: only these fields are required
export type MinimalProductReturnRequest = {
  orderItemId: number;
  returnType: number; // 1 = trả hàng, 2 = đổi hàng
  returnReason: string;
};

export const createProductReturnV2 = async (
  data: MinimalProductReturnRequest
): Promise<ProductReturnResponse> => {
  try {
    const response = await instance.post<ProductReturnResponse>(
      "/product-returns",
      data
    );
    console.log(`Trong Service: ${JSON.stringify(data)}`);
    return response.data;
  } catch (error) {
    console.error("Có lỗi khi tạo phiếu trả hàng (v2):", error);
    throw error;
  }
};

export const getAllProductReturns =
  async (): Promise<ProductReturnListResponse> => {
    try {
      const response =
        await instance.get<ProductReturnListResponse>("/product-returns");
      return response.data;
    } catch (error) {
      console.error("Có lỗi khi lấy danh sách phiếu trả hàng:", error);
      throw error;
    }
  };

export const approveProductReturn = async (returnId: number) => {
  try {
    const response = await instance.put(`/returns/approve/${returnId}`);
    return response.data;
  } catch (error) {
    console.error("Error approving order:", error);
    throw error;
  }
};
export const rejectProductReturn = async (returnId: number) => {
  try {
    const response = await instance.put(`/returns/reject/${returnId}`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting order:", error);
    throw error;
  }
};
export const completedProductReturnforRefund = async (returnId: number) => {
  try {
    const response = await instance.put(`/returns/complete-refund/${returnId}`);
    return response.data;
  } catch (error) {
    console.error("Error completing order:", error);
    throw error;
  }
};
export const completedProductReturnforExchange = async (returnId: number) => {
  try {
    const response = await instance.put(
      `/returns/complete-exchange/${returnId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error completing order:", error);
    throw error;
  }
};

// alias for callers expecting `rejectProductReturn`
export const rejectProductReturnAlias = rejectProductReturn;
