import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { ApiResponse } from "~/types/api-response";
import type { PaymentDestination } from "~/types/payment/payment-destination";

interface PaymentDestinationsState {
  paymentDestinationList: PaymentDestination[] | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: PaymentDestinationsState = {
  paymentDestinationList: null,
  isLoading: false,
  isError: false,
};

export const fetchPaymentDestinations = createAsyncThunk(
  "paymentDestinations/fetchPaymentDestinations",
  async (params?: Record<string, any>) => {
    const response = await instance.get<ApiResponse<PaymentDestination[]>>(
      "/payment-destinations",
      { params }
    );
    return response.data;
  }
);

const paymentDestinationsSlice = createSlice({
  name: "paymentDestinations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentDestinations.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchPaymentDestinations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.paymentDestinationList = action.payload?.data ?? null;
      })
      .addCase(fetchPaymentDestinations.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default paymentDestinationsSlice.reducer;
export { paymentDestinationsSlice };
