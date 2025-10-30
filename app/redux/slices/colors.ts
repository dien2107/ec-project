import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { Color } from "~/features/system/colors/types";
import type { ApiPagedResponse } from "~/types/api-response";

// State định nghĩa dữ liệu và trạng thái tải
interface ColorListState {
  colorList: ApiPagedResponse<Color[]> | null;
  isLoading: boolean;
  error: string | null;
}

// Khởi tạo giá trị ban đầu
const initialState: ColorListState = {
  colorList: null,
  isLoading: false,
  error: null,
};

// Async thunk để lấy danh sách color
export const fetchColorListData = createAsyncThunk(
  "colors/fetchColorListData",
  async (
    params: {
      Search?: string; // 🔍 tìm theo mã hoặc tên
      StatusName?: string; // 🔘 lọc trạng thái
      PageNumber?: number;
      PageSize?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get<ApiPagedResponse<Color[]>>(
        "/colors",
        { params }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải danh sách màu"
      );
    }
  }
);

// Tạo slice cho Color
const colorListDataSlice = createSlice({
  name: "colors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchColorListData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchColorListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.colorList = action.payload;
      })
      .addCase(fetchColorListData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Không thể tải dữ liệu màu";
      });
  },
});

export default colorListDataSlice.reducer;
