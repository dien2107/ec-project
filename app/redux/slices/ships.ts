import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { Ship } from "~/types/ship";
import type { ApiPagedResponse } from "~/types/api-response";

interface ShipListDataState {
  shipList: ApiPagedResponse<Ship[]> | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: ShipListDataState = {
  shipList: null,
  isLoading: false,
  isError: false,
};

export const fetchShipListData = createAsyncThunk(
  "ships/fetchShipListData",
  async (params: {
    statusId?: number;
    corpName?: string;
    OrderBy?: string;
    PageNumber?: number;
    PageSize?: number;
  }) => {
    const response = await instance.get<ApiPagedResponse<Ship[]>>("/ships", {
      params,
    });
    return response.data;
  }
);

const shipListDataSlice = createSlice({
  name: "shipListData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipListData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchShipListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.shipList = action.payload;
      })
      .addCase(fetchShipListData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default shipListDataSlice.reducer;
