import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import type { SelectedProductProps } from "~/features/clients/product-detail/types";
import type { ProductVariant } from "~/types/product/product-variant";

export interface CartItem {
  ProductVariant: ProductVariant;
  quantity: number;
  price: number;
  image: SelectedProductProps["image"];
}

type VariantId = number;

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const normalizeId = (id: any) => Number(id);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const variantId = normalizeId(
        (item.ProductVariant as any).productVariantId
      );

      if (!variantId) {
        toast.error("Vui lòng chọn size!");
        return;
      }

      const existing = state.items.find(
        i =>
          normalizeId((i.ProductVariant as any).productVariantId) === variantId
      );

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },

    removeFromCart: (state, action: PayloadAction<VariantId>) => {
      const id = normalizeId(action.payload);
      state.items = state.items.filter(
        i => normalizeId((i.ProductVariant as any).productVariantId) !== id
      );
    },

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
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
