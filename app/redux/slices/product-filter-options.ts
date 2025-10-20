import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { ApiResponse } from "~/types/api-response";
import type { ProductFilterOptions } from "~/features/clients/categories/types/product-filter-bar";

interface ProductFilterOptionsState {
  productFilterOptions: ApiResponse<ProductFilterOptions> | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: ProductFilterOptionsState = {
  productFilterOptions: null,
  isLoading: false,
  isError: false,
};

export const fetchProductFilterOptionsByCategorySlug = createAsyncThunk(
  "productFilters/fetchProductFilterOptionsByCategorySlug",
  async (categorySlug: string) => {
    const response = await instance.get<ApiResponse<ProductFilterOptions>>(
      `products/category/${categorySlug}/filter-options`
    );

    return response.data;
  }
);

const productFilterOptionsSlice = createSlice({
  name: "productFilterOptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductFilterOptionsByCategorySlug.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(
        fetchProductFilterOptionsByCategorySlug.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.productFilterOptions = action.payload;
        }
      )
      .addCase(fetchProductFilterOptionsByCategorySlug.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default productFilterOptionsSlice.reducer;
