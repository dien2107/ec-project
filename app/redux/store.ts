import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import productFormMetaReducer from "./slices/product-form-meta";
import productListDataReducer from "./slices/products";
import reviewListDataReducer from "./slices/reviews";
import statusesReducer from "./slices/statuses";
import productFilterOptionsReducer from "./slices/product-filter-options";

export const store = configureStore({
  reducer: {
    productMeta: productFormMetaReducer,
    productList: productListDataReducer,
    productFilterOptions: productFilterOptionsReducer,
    reviewList: reviewListDataReducer,
    statuses: statusesReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware()
  //     .prepend(authStorageListener.middleware)
  //     .prepend(authLogoutListener.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
