import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Order } from "~/features/system/orders/types";
import instance from "~/services/customize-axios";

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

// export interface Order {
//   orderId: number;
//   userId: number;
//   addressInfo: string;
//   totalAmount: number;
//   shippingFee: number;
//   isFreeShip: boolean;
//   createdAt: string; // ISO string
//   items: OrderItem[];
// }

// Standard API response wrapper
export interface ApiResponse<T> {
  status: number;
  isSuccess: boolean;
  message: string;
  data: T;
}

export type OrderListResponse = ApiResponse<Order[]>;

const initialState: {
  orderList: OrderListResponse | null;
  isLoading: boolean;
  isError: boolean;
} = {
  orderList: null,
  isLoading: false,
  isError: false,
};

export const fetchOrderListData = createAsyncThunk(
  "orders/fetchOrderListData",
  async () => {
    const response = await instance.get<ApiResponse<Order[]>>("/orders");
    return response.data;
  }
);

const orderListDataSlice = createSlice({
  name: "orderListData",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOrderListData.pending, state => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchOrderListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.orderList = action.payload;
      })
      .addCase(fetchOrderListData.rejected, state => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default orderListDataSlice.reducer;
