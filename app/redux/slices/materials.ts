import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { Material } from "~/features/system/material/types"; // Thay đổi đường dẫn nếu cần
import type { ApiPagedResponse } from "~/types/api-response";

// State định nghĩa dữ liệu và trạng thái tải
interface MaterialListState {
  materialList: ApiPagedResponse<Material[]> | null;
  isLoading: boolean;
  error: string | null;
}

// Khởi tạo giá trị ban đầu
const initialState: MaterialListState = {
  materialList: null,
  isLoading: false,
  error: null,
};

// Async thunk để lấy danh sách nguyên liệu
export const fetchMaterialListData = createAsyncThunk(
  "materials/fetchMaterialListData",
  async (
    params: {
      Search?: string; // 🔍 Tìm theo tên hoặc mã nguyên liệu
      StatusName?: string; // 🔘 Lọc trạng thái
      PageNumber?: number;
      PageSize?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get<ApiPagedResponse<Material[]>>(
        "/materials",
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
        error.response?.data || "Lỗi khi tải danh sách nguyên liệu"
      );
    }
  }
);

// Tạo slice cho Materials
const materialListDataSlice = createSlice({
  name: "materials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterialListData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMaterialListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.materialList = action.payload;
      })
      .addCase(fetchMaterialListData.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Không thể tải dữ liệu nguyên liệu";
      });
  },
});

export default materialListDataSlice.reducer;
