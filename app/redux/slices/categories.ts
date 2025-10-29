import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { Category } from "~/features/system/categories/types"; // Thay đổi đường dẫn nếu cần
import type { ApiPagedResponse } from "~/types/api-response";

// State định nghĩa dữ liệu và trạng thái tải
interface CategoryListState {
  categoryList: ApiPagedResponse<Category[]> | null;
  isLoading: boolean;
  error: string | null;
}

// Khởi tạo giá trị ban đầu
const initialState: CategoryListState = {
  categoryList: null,
  isLoading: false,
  error: null,
};

// Async thunk để lấy danh sách danh mục
export const fetchCategoryListData = createAsyncThunk(
  "categories/fetchCategoryListData",
  async (
    params: {
      Search?: string; // 🔍 Tìm theo tên hoặc mã danh mục
      StatusName?: string; // 🔘 Lọc trạng thái
      PageNumber?: number;
      PageSize?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get<ApiPagedResponse<Category[]>>(
        "/categories/all",
        {
          params,
        }
      );
      console.log("✅ Keyword:", params.Search);
      console.log("✅ Status:", params.StatusName);
      console.log("✅ API trả về:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải danh sách danh mục"
      );
    }
  }
);

// Tạo slice cho Categories
const categoryListDataSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryListData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryList = action.payload;
      })
      .addCase(fetchCategoryListData.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Không thể tải dữ liệu danh mục";
      });
  },
});

export default categoryListDataSlice.reducer;
