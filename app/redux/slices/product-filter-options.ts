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

export const fetchProductCatelogFilterOptions = createAsyncThunk(
  "productFilters/fetchProductCatelogFilterOptions",
  async ({
    categorySlug,
    search,
  }: {
    categorySlug?: string;
    search?: string;
  }) => {
    const params = {
      CategorySlug: categorySlug,
      Search: search,
    };
    const response = await instance.get<ApiResponse<ProductFilterOptions>>(
      `products/catelog/filter-options`,
      { params }
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
      .addCase(fetchProductCatelogFilterOptions.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchProductCatelogFilterOptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.productFilterOptions = action.payload;
      })
      .addCase(fetchProductCatelogFilterOptions.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default productFilterOptionsSlice.reducer;
