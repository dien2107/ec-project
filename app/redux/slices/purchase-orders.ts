// ~/redux/slices/purchase-orders.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { ApiPagedResponse } from "~/types/api-response";
import type { ImportOrder } from "~/features/system/import-orders/types";

interface PurchaseOrderListState {
  purchaseOrderList: ApiPagedResponse<ImportOrder[]> | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: PurchaseOrderListState = {
  purchaseOrderList: null,
  isLoading: false,
  isError: false,
};

export const fetchPurchaseOrderListData = createAsyncThunk(
  "purchaseOrders/fetchPurchaseOrderListData",
  async (params: {
    Search?: string;
    StatusId?: number;
    PageNumber?: number;
    PageSize?: number;
    SupplierId?: number;
    startDate?: string;
    endDate?: string;
    OrderBy?: string;
  }) => {
    const response = await instance.get<ApiPagedResponse<ImportOrder[]>>(
      "/purchase-orders",
      { params }
    );
    return response.data;
  }
);
const purchaseOrderListSlice = createSlice({
  name: "purchaseOrderList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrderListData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchPurchaseOrderListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.purchaseOrderList = action.payload;
      })
      .addCase(fetchPurchaseOrderListData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.purchaseOrderList = null;
      });
  },
});

export default purchaseOrderListSlice.reducer;
