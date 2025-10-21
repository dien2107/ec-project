import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { ProductVariant } from "~/types/product/product-variant";

interface ProductVariantsState {
  variantsByProductId: {
    [productId: number]: ProductVariant[] | undefined;
  };
  isLoadingByProductId: {
    [productId: number]: boolean | undefined;
  };
  isErrorByProductId: {
    [productId: number]: boolean | undefined;
  };
}

const initialState: ProductVariantsState = {
  variantsByProductId: {},
  isLoadingByProductId: {},
  isErrorByProductId: {},
};

export const fetchProductVariants = createAsyncThunk(
  "productVariants/fetchProductVariants",
  async (productId: number) => {
    const response = await instance.get<{ data: ProductVariant[] }>(
      `/products/${productId}/variants`
    );
    return { productId, variants: response.data.data };
  }
);

const productVariantsSlice = createSlice({
  name: "productVariants",
  initialState,
  reducers: {
    clearProductVariants(state, action) {
      const productId = action.payload;
      delete state.variantsByProductId[productId];
      delete state.isLoadingByProductId[productId];
      delete state.isErrorByProductId[productId];
    },

    clearAllProductVariants(state) {
      state.variantsByProductId = {};
      state.isLoadingByProductId = {};
      state.isErrorByProductId = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductVariants.pending, (state, action) => {
        const productId = action.meta.arg;
        state.isLoadingByProductId[productId] = true;
        state.isErrorByProductId[productId] = false;
      })
      .addCase(fetchProductVariants.fulfilled, (state, action) => {
        const { productId, variants } = action.payload;
        state.isLoadingByProductId[productId] = false;
        state.isErrorByProductId[productId] = false;
        state.variantsByProductId[productId] = variants;
      })
      .addCase(fetchProductVariants.rejected, (state, action) => {
        const productId = action.meta.arg;
        state.isLoadingByProductId[productId] = false;
        state.isErrorByProductId[productId] = true;
      });
  },
});

export const { clearProductVariants, clearAllProductVariants } =
  productVariantsSlice.actions;
export default productVariantsSlice.reducer;
