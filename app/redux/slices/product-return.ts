import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { ProductReturnResponse } from "~/services/product-return";
import type { ApiPagedResponse } from "~/types/api-response";

interface ProductReturnListState {
  productReturnList: ApiPagedResponse<ProductReturnResponse> | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductReturnListState = {
  productReturnList: null,
  isLoading: false,
  error: null,
};

export const fetchProductReturnList = createAsyncThunk(
  "productReturn/fetchProductReturnList",
  async (
    params: {
      Search?: string;
      StatusName?: string;
      ReturnType?: string;
      PageNumber?: number;
      PageSize?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get<
        ApiPagedResponse<ProductReturnResponse>
      >("/product-returns", {
        params,
      });
      console.log("✅ Product Returns API response:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải danh sách đổi trả"
      );
    }
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
        state.error = null;
      })
      .addCase(fetchProductReturnList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.productReturnList = action.payload;
      })
      .addCase(fetchProductReturnList.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Không thể tải dữ liệu đổi trả";
      });
  },
});

export const {} = productReturnSlice.actions;
export default productReturnSlice.reducer;
