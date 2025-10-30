import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { ApiResponse } from "~/types/api-response";
import type { Status } from "~/types/status";
import type { RootState } from "../store";

interface StatusesState {
  data: Record<string, Status[]>; // cache theo entity
  isLoading: boolean;
  isError: boolean;
}

const initialState: StatusesState = {
  data: {},
  isLoading: false,
  isError: false,
};

export const fetchStatuses = createAsyncThunk(
  "statuses/fetchStatuses",
  async ({ entityType }: { entityType: string }, { getState }) => {
    const state = getState() as RootState;
    if (state.statuses.data[entityType]) {
      return { entityType, statuses: state.statuses.data[entityType] };
    }

    const res = await instance.get<ApiResponse<Status[]>>("/statuses", {
      params: { entityType },
    });
    return { entityType, statuses: res.data.data };
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
        const { entityType, statuses } = action.payload;
        state.isLoading = false;
        state.data[entityType] = statuses;
      })
      .addCase(fetchStatuses.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default statusesSlice.reducer;
