import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { PermissionList } from "~/features/system/decentralization";
import type { ApiResponse } from "~/types/api-response";

interface PermissionListDataState {
  permissionList: ApiResponse<PermissionList[]> | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: PermissionListDataState = {
  permissionList: null,
  isLoading: false,
  isError: false,
};

export const fetchPermissionListData = createAsyncThunk(
  "permissions/fetchPermissionListData",
  async () => {
    const response =
      await instance.get<ApiResponse<PermissionList[]>>("/permissions");
    return response.data;
  }
);

const permissionListDataSlice = createSlice({
  name: "permissionListData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissionListData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchPermissionListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.permissionList = action.payload;
      })
      .addCase(fetchPermissionListData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default permissionListDataSlice.reducer;
