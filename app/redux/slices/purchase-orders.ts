// ~/redux/slices/purchase-orders.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { ApiPagedResponse } from "~/types/api-response";
import type { ImportOrder } from "~/features/system/import-orders/types";

interface PurchaseOrderListState {
  data: ImportOrder[];
  isLoading: boolean;
  isError: boolean;
}

const initialState: PurchaseOrderListState = {
  data: [],
  isLoading: false,
  isError: false,
};

export const fetchPurchaseOrderListData = createAsyncThunk(
  "purchaseOrders/fetchPurchaseOrderListData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get("/purchase-orders");
      console.log(response.data.data);
      return response.data.data as ImportOrder[];
    } catch (error) {
      return rejectWithValue(error);  
    }
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
        state.data = action.payload;
      })
      .addCase(fetchPurchaseOrderListData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default purchaseOrderListSlice.reducer;
