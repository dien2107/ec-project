import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { Size } from "../../types/product/size"; // Thay đổi đường dẫn nếu cần
import type { ApiPagedResponse } from "~/types/api-response";

// State định nghĩa dữ liệu và trạng thái tải
interface SizeListState {
  sizeList: ApiPagedResponse<Size[]> | null;
  isLoading: boolean;
  error: string | null;
}

// Khởi tạo giá trị ban đầu
const initialState: SizeListState = {
  sizeList: null,
  isLoading: false,
  error: null,
};

// Async thunk để lấy danh sách kích thước
export const fetchSizeListData = createAsyncThunk(
  "sizes/fetchSizeListData",
  async (
    params: {
      Search?: string; // 🔍 Tìm theo tên hoặc mã kích thước
      StatusName?: string; // 🔘 Lọc trạng thái
      PageNumber?: number;
      PageSize?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get<ApiPagedResponse<Size[]>>("/sizes", {
        params,
      });
      // console.log("✅ Keyword:", params.Search);
      // console.log("✅ Status:", params.StatusName);
      // console.log("✅ API trả về:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải danh sách kích thước"
      );
    }
  }
);

// Tạo slice cho Size
const sizeListDataSlice = createSlice({
  name: "sizes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSizeListData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSizeListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sizeList = action.payload;
      })
      .addCase(fetchSizeListData.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Không thể tải dữ liệu kích thước";
      });
  },
});

export default sizeListDataSlice.reducer;
