import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { Product } from "~/features/system/products/types/product";
import type { ApiPagedResponse } from "~/types/api-response";

interface ProductListDataState {
  productList: ApiPagedResponse<Product[]> | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: ProductListDataState = {
  productList: null,
  isLoading: false,
  isError: false,
};

export const fetchProductListData = createAsyncThunk(
  "products/fetchProductListData",
  async (params: {
    StatusName?: string;
    Search?: string;
    ProductGroupId?: number;
    CategoryId?: number;
    ColorId?: number;
    MaterialId?: number;
    PageNumber?: number;
    PageSize?: number;
  }) => {
    const response = await instance.get<ApiPagedResponse<Product[]>>(
      "/products",
      { params }
    );
    return response.data;
  }
);

const productListDataSlice = createSlice({
  name: "productListData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductListData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchProductListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.productList = action.payload;
      })
      .addCase(fetchProductListData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default productListDataSlice.reducer;
