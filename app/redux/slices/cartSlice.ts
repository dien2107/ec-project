import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "~/services/customize-axios";
import toast from "react-hot-toast";
import type { ApiResponse } from "~/types/api-response";

// --------------------
// 🧾 Types
// --------------------
export interface CartItem {
  size: string;
  color: string;
  cartItemId: number;
  productVariantId: number;
  productName: string;
  productImageUrl: string;
  quantity: number;
  price: number;
  slug?: string;
  productId?: number;
}

export interface CartDetail {
  cartId: number;
  userId: number;
  cartItems: CartItem[];
}

interface CartState {
  cart: CartDetail | null;
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

// --------------------
// ⚙️ Initial State
// --------------------
const initialState: CartState = {
  cart: null,
  items: [],
  isLoading: false,
  error: null,
};

// --------------------
// 🧠 Async Thunks
// --------------------

// 🛒 Lấy giỏ hàng theo userId
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await instance.get<ApiResponse<CartDetail>>(
        `/carts/${userId}`
      );
      if (response.data?.data) {
        return response.data.data;
      }
      throw new Error("Dữ liệu giỏ hàng không hợp lệ");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể tải giỏ hàng"
      );
    }
  }
);

// 🧩 Cập nhật hoặc thêm sản phẩm vào giỏ
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    payload: {
      userId: number;
      variantId: number;
      quantity: number;
      price: number;
      slug?: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await instance.post<ApiResponse<boolean>>(
        "/carts/update",
        payload
      );
      if (response.data?.isSuccess) {
        toast.success("Cập nhật giỏ hàng thành công");

        // ✅ Sau khi update thành công, fetch lại giỏ hàng từ server
        dispatch(fetchCart(payload.userId));

        return payload;
      }
      throw new Error("Cập nhật giỏ hàng thất bại");
    } catch (error: any) {
      toast.error("Cập nhật giỏ hàng thất bại");
      return rejectWithValue(
        error.response?.data?.message || "Không thể cập nhật giỏ hàng"
      );
    }
  }
);

// 🗑️ Xoá sản phẩm khỏi giỏ
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (
    payload: { userId: number; variantId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.delete<ApiResponse<boolean>>(
        `/carts/${payload.userId}/${payload.variantId}`
      );
      if (response.data?.isSuccess) {
        toast.success("Đã xoá sản phẩm khỏi giỏ hàng");
        return payload.variantId;
      }
      throw new Error("Không thể xoá sản phẩm");
    } catch (error: any) {
      toast.error("Xoá sản phẩm thất bại");
      return rejectWithValue(
        error.response?.data?.message || "Không thể xoá sản phẩm"
      );
    }
  }
);

// --------------------
// 🧩 Slice
// --------------------
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: state => {
      state.cart = null;
      state.items = [];
    },
  },
  extraReducers: builder => {
    builder
      // 🧭 Lấy giỏ hàng
      .addCase(fetchCart.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        state.items = action.payload.cartItems || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Không thể tải dữ liệu giỏ hàng";
      })

      // 🛠️ Cập nhật item (sau khi BE xử lý xong)
      .addCase(updateCartItem.fulfilled, state => {
        // không cần thay đổi trực tiếp FE ở đây vì ta đã gọi fetchCart
      })

      // 🗑️ Xoá item
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        const variantId = action.payload;
        state.items = state.items.filter(i => i.productVariantId !== variantId);
        if (state.cart) {
          state.cart.cartItems = state.items;
        }
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
