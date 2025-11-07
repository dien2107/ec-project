import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { RoleList } from "~/features/system/decentralization";
import type { ApiResponse } from "~/types/api-response";

interface RoleListDataState {
  roleList: ApiResponse<RoleList[]> | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: RoleListDataState = {
  roleList: null,
  isLoading: false,
  isError: false,
};

export const fetchRoleListData = createAsyncThunk(
  "roles/fetchRoleListData",
  async (params: { StatusName?: string }) => {
    const response = await instance.get<ApiResponse<RoleList[]>>("/roles", {
      params,
    });
    return response.data;
  }
);

const roleListDataSlice = createSlice({
  name: "roleListData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoleListData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchRoleListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.roleList = action.payload;
      })
      .addCase(fetchRoleListData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default roleListDataSlice.reducer;
