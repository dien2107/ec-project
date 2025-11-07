import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { HomeData, HomeResponse } from "~/types/home-page";

interface HomePageState {
  homeData: HomeData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: HomePageState = {
  homeData: null,
  isLoading: false,
  error: null,
};

export const fetchHomePageData = createAsyncThunk(
  "homePage/fetchHomePageData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get<HomeResponse>("/homepage");
      return response.data.data; 
    } catch (error: any) {
      console.error("Lỗi khi tải dữ liệu trang chủ:", error);
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải dữ liệu trang chủ"
      );
    }
  }
);
const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    clearHomeData: (state) => {
      state.homeData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomePageData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomePageData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.homeData = action.payload;
        state.error = null;
      })
      .addCase(fetchHomePageData.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Không thể tải dữ liệu trang chủ";
      });
  },
});

export const { clearHomeData } = homePageSlice.actions;
export default homePageSlice.reducer;
