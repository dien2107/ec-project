import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import type { ProductGroup } from "../../types/product/product-group"; // Adjust the path as needed
import type { ApiPagedResponse } from "~/types/api-response";

// State definition for product groups
interface ProductGroupListState {
  productGroupList: ApiPagedResponse<ProductGroup[]> | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: ProductGroupListState = {
  productGroupList: null,
  isLoading: false,
  error: null,
};

// Async thunk to fetch product group data
export const fetchProductGroupListData = createAsyncThunk(
  "productGroups/fetchProductGroupListData",
  async (
    params: {
      Search?: string; // 🔍 Search by name or code
      StatusName?: string; // 🔘 Filter by status
      PageNumber?: number;
      PageSize?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.get<ApiPagedResponse<ProductGroup[]>>(
        "/productgroup",
        {
          params,
        }
      );
      console.log("✅ Keyword:", params.Search);
      console.log("✅ Status:", params.StatusName);
      console.log("✅ API response:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Error fetching product group list"
      );
    }
  }
);

// Create slice for ProductGroup
const productGroupListDataSlice = createSlice({
  name: "productGroups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductGroupListData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductGroupListData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productGroupList = action.payload;
      })
      .addCase(fetchProductGroupListData.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Unable to load product group data";
      });
  },
});

export default productGroupListDataSlice.reducer;
