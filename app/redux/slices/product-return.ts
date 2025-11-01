import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type {
  ProductReturnListResponse,
  ProductReturnResponse,
} from "~/services/product-return";

interface ProductReturnListState {
  data: ProductReturnResponse[]; // Mảng dữ liệu trả hàng
  isLoading: boolean;
  isError: boolean;
}

const initialState: ProductReturnListState = {
  data: [],
  isLoading: false,
  isError: false,
};

export const fetchProductReturnList = createAsyncThunk(
  "productReturn/fetchProductReturnList",
  async () => {
    const response =
      await instance.get<ProductReturnListResponse>("/product-returns");
    return response.data.data;
  }
);

const productReturnSlice = createSlice({
  name: "productReturn",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProductReturnList.pending, state => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchProductReturnList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      })
      .addCase(fetchProductReturnList.rejected, state => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const {} = productReturnSlice.actions;
export default productReturnSlice.reducer;
