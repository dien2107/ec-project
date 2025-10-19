import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { Supplier } from "~/features/system/suppliers/types";
import type { ApiPagedResponse } from "~/types/api-response";

interface SupplierListDataState {
  supplierList: ApiPagedResponse<Supplier[]> | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: SupplierListDataState = {
  supplierList: null,
  isLoading: false,
  isError: false,
};

export const fetchSupplierListData = createAsyncThunk(
  "suppliers/fetchSupplierListData",
  async (params: {
    StatusName?: string;
    Search?: string;
    SupplierGroupId?: number;
    PageNumber?: number;
    PageSize?: number;
  }) => {
    const response = await instance.get<ApiPagedResponse<Supplier[]>>(
      "/suppliers",
      { params }
    );
    return response.data;
  }
);

const supplierListDataSlice = createSlice({
  name: "supplierListData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplierListData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchSupplierListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.supplierList = action.payload;
      })
      .addCase(fetchSupplierListData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default supplierListDataSlice.reducer;
