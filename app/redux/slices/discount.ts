import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { Discount } from "~/features/system/promotions/types";
import type { ApiPagedResponse } from "~/types/api-response";

// State định nghĩa dữ liệu và trạng thái tải
interface DiscountListState {
  discountList: ApiPagedResponse<Discount[]> | null;
  isLoading: boolean;
  error: string | null;
}

// Khởi tạo giá trị ban đầu
const initialState: DiscountListState = {
  discountList: null,
  isLoading: false,
  error: null,
};

// Async thunk để lấy danh sách giảm giá
export const fetchDiscountListData = createAsyncThunk(
  "discounts/fetchDiscountListData",
  async (
    params: {
      Search?: string; // 🔍. Tìm theo mã hoặc tên giảm giá
      StatusName?: string; // 🔘 Lọc trạng thái
      DiscoyntType?: string; // 🔘 Lọc loại giảm giá
      PageNumber?: number;
      PageSize?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get<ApiPagedResponse<Discount[]>>(
        "/discounts",
        { params }
      );
      // console.log("✅ Keyword:", params);
      // console.log("✅ Status:", params.StatusName);
      console.log("✅ API trả về:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải danh sách giảm giá"
      );
    }
  }
);

// Tạo slice cho Discount
const discountListDataSlice = createSlice({
  name: "discounts",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDiscountListData.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDiscountListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.discountList = action.payload;
      })
      .addCase(fetchDiscountListData.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Không thể tải dữ liệu giảm giá";
      });
  },
});

export default discountListDataSlice.reducer;
