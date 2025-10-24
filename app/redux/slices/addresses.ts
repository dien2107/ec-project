import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { Address } from "~/types/address/address";
import type { ApiResponse } from "~/types/api-response";

interface AddressesState {
  addresses: Address[] | [];
  isLoading: boolean;
  isError: boolean;
}

const initialState: AddressesState = {
  addresses: [],
  isLoading: false,
  isError: false,
};

/**
 * Fetch addresses for a given userId
 * GET /api/v1/addresses/{userId}
 */
export const fetchAddressesByUserId = createAsyncThunk(
  "addresses/fetchAddressesByUserId",
  async (userId: number) => {
    const response = await instance.get<ApiResponse<Address[]>>(
      `/addresses/${userId}`
    );
    return response.data;
  }
);

const addressesSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressesByUserId.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchAddressesByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.addresses = action.payload.data;
      })
      .addCase(fetchAddressesByUserId.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default addressesSlice.reducer;
