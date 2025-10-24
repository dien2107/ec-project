import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { ApiResponse } from "~/types/api-response";
import type { Province } from "~/types/address/province";

interface ProvincesState {
  provinces: Province[] | [];
  isLoading: boolean;
  isError: boolean;
}

const initialState: ProvincesState = {
  provinces: [],
  isLoading: false,
  isError: false,
};

/**
 * Fetch all provinces
 * GET /api/v1/provinces
 */
export const fetchProvinces = createAsyncThunk(
  "provinces/fetchProvinces",
  async () => {
    const response = await instance.get<ApiResponse<Province[]>>(`/provinces`);
    return response.data;
  }
);

const provincesSlice = createSlice({
  name: "provinces",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProvinces.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.provinces = action.payload.data;
      })
      .addCase(fetchProvinces.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default provincesSlice.reducer;
