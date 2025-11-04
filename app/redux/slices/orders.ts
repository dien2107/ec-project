import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Order } from "~/features/system/orders/types";
import instance from "~/services/customize-axios";
import type { ApiPagedResponse } from "~/types/api-response";

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

// Standard API response wrapper
export interface ApiResponse<T> {
  status: number;
  isSuccess: boolean;
  message: string;
  data: T;
}

// State with paged response
interface OrderListState {
  orderList: ApiPagedResponse<Order[]> | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderListState = {
  orderList: null,
  isLoading: false,
  error: null,
};

// Async thunk with pagination and filtering
export const fetchOrderListData = createAsyncThunk(
  "orders/fetchOrderListData",
  async (
    params: {
      Search?: string; // Search by order ID or customer name
      StatusName?: string; // Filter by status
      PageNumber?: number;
      PageSize?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get<ApiPagedResponse<Order[]>>(
        "/orders",
        {
          params,
        }
      );
      console.log("✅ Orders API response:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải danh sách đơn hàng"
      );
    }
  }
);

export const fetchOrderListDataByUserId = createAsyncThunk(
  "orders/fetchOrderListDataByUserId",
  async (userId: number) => {
    const response = await instance.get<ApiResponse<Order[]>>(
      `/orders/user/${userId}`
    );
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
        state.error = null;
      })
      .addCase(fetchOrderListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload;
      })
      .addCase(fetchOrderListData.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Không thể tải dữ liệu đơn hàng";
      })
      .addCase(fetchOrderListDataByUserId.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderListDataByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        // Transform ApiResponse<Order[]> to ApiPagedResponse format
        state.orderList = {
          status: action.payload.status,
          isSuccess: action.payload.isSuccess,
          message: action.payload.message,
          data: {
            items: [action.payload.data], // Wrap in array to match ApiPagedResponse structure
            totalCount: action.payload.data.length,
            totalPages: 1,
            pageNumber: 1,
            pageSize: action.payload.data.length,
          },
        };
      })
      .addCase(fetchOrderListDataByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.error.message as string) ||
          "Không thể tải dữ liệu đơn hàng theo user";
      });
  },
});

export default orderListDataSlice.reducer;
