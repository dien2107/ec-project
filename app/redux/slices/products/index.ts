import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { ProductFormMeta, ApiResponse } from "./types";

interface ProductFormMetaState {
  meta: ApiResponse<ProductFormMeta> | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: ProductFormMetaState = {
  meta: null,
  isLoading: false,
  isError: false,
};

export const fetchProductFormMeta = createAsyncThunk(
  "products/fetchProductFormMeta",
  async () => {
    const response = await instance.get<ApiResponse<ProductFormMeta>>(
      "/products/form-meta"
    );
    return response.data;
  }
);

const productMetaSlice = createSlice({
  name: "productMeta",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductFormMeta.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchProductFormMeta.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.meta = action.payload;
      })
      .addCase(fetchProductFormMeta.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default productMetaSlice.reducer;
