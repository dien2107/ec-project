import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import type { SelectedProductProps } from "~/features/clients/product-detail/types";
import type { ProductVariant } from "~/types/product/product-variant";
import {
  createOrUpdateCartItem,
  removeCartItem,
  fetchUserCart,
} from "~/services/cart"; // 🧩 các API bạn cần tạo

export interface CartItem {
  ProductVariant: ProductVariant;
  quantity: number;
  price: number;
  image: SelectedProductProps["image"];
}

type VariantId = number;

interface CartState {
  items: CartItem[];
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  loading: false,
};

const normalizeId = (id: any) => Number(id);

// 🧠 Lấy giỏ hàng từ DB
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (userId: number) => {
    const res = await fetchUserCart(userId);
    return res.items as CartItem[];
  }
);

// 🧠 Thêm hoặc cập nhật CartItem trong DB
export const syncCartItem = createAsyncThunk(
  "cart/syncItem",
  async (payload: {
    userId: number;
    variantId: number;
    quantity: number;
    price: number;
  }) => {
    const res = await createOrUpdateCartItem(payload);
    return res;
  }
);

// 🧠 Xoá CartItem khỏi DB
export const deleteCartItem = createAsyncThunk(
  "cart/deleteItem",
  async (payload: { userId: number; variantId: number }) => {
    await removeCartItem(payload);
    return payload.variantId;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // UI local update (trước khi gọi API)
    updateQuantity: (
      state,
      action: PayloadAction<{ variantId: VariantId; quantity: number }>
    ) => {
      const { variantId, quantity } = action.payload;
      const id = normalizeId(variantId);
      const existing = state.items.find(
        i => normalizeId((i.ProductVariant as any).productVariantId) === id
      );
      if (existing) {
        existing.quantity = quantity;
      }
    },
    clearCart: state => {
      state.items = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(syncCartItem.fulfilled, () => {
        toast.success("Giỏ hàng đã được cập nhật");
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        const id = normalizeId(action.payload);
        state.items = state.items.filter(
          i => normalizeId((i.ProductVariant as any).productVariantId) !== id
        );
        toast.success("Đã xoá sản phẩm khỏi giỏ hàng");
      })
      .addCase(fetchCart.rejected, state => {
        state.loading = false;
        toast.error("Không thể tải giỏ hàng");
      });
  },
});

export const { updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
