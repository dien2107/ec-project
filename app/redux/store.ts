import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import productFormMetaReducer from "./slices/product-form-meta";
import productListDataReducer from "./slices/products";
import reviewListDataReducer from "./slices/reviews";
import statusesReducer from "./slices/statuses";
import suppliersListDataReducer from "./slices/suppliers";
import productFilterOptionsReducer from "./slices/product-filter-options";
import productVariantsReducer from "./slices/product-variants";
import sizeOptionsReducer from "./slices/sizes-options";
import purchaseOrderListDataReducer from "./slices/purchase-orders";
import addressesReducer from "./slices/addresses";
import provincesReducer from "./slices/provinces";
import orderListDataReducer from "./slices/orders";
import cartReducer from "./slices/cartSlice";
import productReturnReducer from "./slices/product-return";
import colorsReducer from "./slices/colors";
import discountReducer from "./slices/discount";
import sizeReducer from "./slices/sizes";
import CategoryReducer from "./slices/categories";
import materialReducer from "./slices/materials";
import productGroupListDataReducer from "./slices/product-groups";
import homePageReducer from "./slices/home-page";

import permissionListDataReducer from "./slices/permissions";
import roleListDataReducer from "./slices/roles";
import customerListDataReducer from "./slices/customers";
import authReducer from "./slices/auth";
import authLogoutListener from "~/middlewares/authLogoutListener";
import shipListDataReducer from "./slices/ships";
import paymentDestinationListDataReducer from "./slices/payment-destinations";

export const store = configureStore({
  reducer: {
    productReturn: productReturnReducer,
    cart: cartReducer,
    productMeta: productFormMetaReducer,
    productList: productListDataReducer,
    productFilterOptions: productFilterOptionsReducer,
    productVariantList: productVariantsReducer,
    reviewList: reviewListDataReducer,
    statuses: statusesReducer,
    sizeOptions: sizeOptionsReducer,
    SupplierList: suppliersListDataReducer,
    purchaseOrderList: purchaseOrderListDataReducer,
    addresses: addressesReducer,
    provinces: provincesReducer,
    orderList: orderListDataReducer,
    permissionList: permissionListDataReducer,
    roleList: roleListDataReducer,
    customerList: customerListDataReducer,
    auth: authReducer,
    shipList: shipListDataReducer,
    paymentDestinationList: paymentDestinationListDataReducer,
    colorList: colorsReducer,
    discountList: discountReducer,
    sizeList: sizeReducer,
    categoryList: CategoryReducer,
    materialList: materialReducer,
    productGroupList: productGroupListDataReducer,
    homePage: homePageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(authLogoutListener.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
