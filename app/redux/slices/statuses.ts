import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { ApiResponse } from "~/types/api-response";
import type { Status } from "~/types/status";

interface StatusesState {
  statuses: Status[];
  isLoading: boolean;
  isError: boolean;
}

const initialState: StatusesState = {
  statuses: [],
  isLoading: false,
  isError: false,
};

export const fetchStatuses = createAsyncThunk(
  "statuses/fetchStatuses",
  async (params?: { entityType?: string }) => {
    if (!params) {
      console.warn("[fetchStatuses] Called without params — skipped request");
      return [];
    }

    console.log("Fetching statuses with params:", params);
    const response = await instance.get<ApiResponse<Status[]>>("/statuses", { params });
    return response.data.data;
  }
);


const statusesSlice = createSlice({
  name: "statuses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatuses.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.statuses = action.payload;
      })
      .addCase(fetchStatuses.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default statusesSlice.reducer;
