import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { Customer } from "~/features/system/customers/types";
import type { ApiPagedResponse } from "~/types/api-response";
import type { Supplier } from "~/features/system/import-orders/types";
import { fetchSupplierListData } from "./suppliers";

interface CustomerListDataState {
  customerList: ApiPagedResponse<Customer[]> | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: CustomerListDataState = {
  customerList: null,
  isLoading: false,
  isError: false,
};

export const fetchCustomerListData = createAsyncThunk(
  "customers/fetchCustomerListData",
  async (params: {
    StatusName?: string;
    Search?: string;
    Phone?: string;
    HasRole?: boolean;
    PageNumber?: number;
    PageSize?: number;
  }) => {
    const response = await instance.get<ApiPagedResponse<Customer[]>>(
      "/users",
      { params }
    );
    return response.data;
  }
);

const customerListDataSlice = createSlice({
  name: "customerListData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerListData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.customerList = null;
      })
      .addCase(fetchCustomerListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.customerList = action.payload;
      })
      .addCase(fetchCustomerListData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.customerList = null; 
      });
  },
});

export default customerListDataSlice.reducer;
