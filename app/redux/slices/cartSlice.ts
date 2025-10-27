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

type VariantId = ProductVariant extends { id: infer ID } ? ID : string | number;

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      if (!action.payload.ProductVariant) {
        toast.error("Vui lòng chọn size!");
        return;
      }
      const item = action.payload;
      const itemId = (item.ProductVariant as any).id as VariantId;
      const existing = state.items.find(
        i =>
          (i.ProductVariant as any).id === itemId &&
          i.ProductVariant.size.sizeId === item.ProductVariant.size.sizeId
      );
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items = [...state.items, item];
      }
    },
    removeFromCart: (state, action: PayloadAction<VariantId>) => {
      state.items = state.items.filter(
        i => (i.ProductVariant as any).id !== action.payload
      );
    },
    clearCart: state => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
