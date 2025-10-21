import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { Size } from "~/types/product/size";
import type { ApiResponse } from "~/types/api-response";

interface SizeListState {
  sizeOptions: Size[] | [];
  isLoading: boolean;
  isError: boolean;
}

const initialState: SizeListState = {
  sizeOptions: [],
  isLoading: false,
  isError: false,
};

export const fetchSizeOptions = createAsyncThunk(
  "sizeOptions/fetchSizeOptions",
  async () => {
    const response = await instance.get<ApiResponse<Size[]>>("/sizes/options");
    return response.data;
  }
);

const sizeOptionsSlice = createSlice({
  name: "sizeOptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSizeOptions.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchSizeOptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.sizeOptions = action.payload.data;
      })
      .addCase(fetchSizeOptions.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default sizeOptionsSlice.reducer;
