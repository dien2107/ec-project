import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { Review } from "~/features/system/reviews/types/review";
import type { ApiPagedResponse } from "~/types/api-response";

interface ReviewListDataState {
  reviewList: ApiPagedResponse<Review[]> | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: ReviewListDataState = {
  reviewList: null,
  isLoading: false,
  isError: false,
};

export const fetchReviewListData = createAsyncThunk(
  "reviews/fetchReviewListData",
  async (params: {
    ProductId: number;
    StatusName?: string;
    Search?: string;
    Rating?: number;
    PageNumber?: number;
    PageSize?: number;
    Username?: string;
  }) => {
    const { ProductId, ...queryParams } = params;
    const response = await instance.get<ApiPagedResponse<Review[]>>(
      `/reviews/product/${ProductId}`,
      { params: queryParams }
    );
    return response.data;
  }
);

const reviewListDataSlice = createSlice({
  name: "reviewListData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewListData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchReviewListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.reviewList = action.payload;
      })
      .addCase(fetchReviewListData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default reviewListDataSlice.reducer;
