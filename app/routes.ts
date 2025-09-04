import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("", "./layouts/customer-layout.tsx", [
    index("features/clients/home/index.tsx"),
    route("/categories", "features/clients/categories/index.tsx"),
    route("/payments", "features/clients/payment/index.tsx"),
    route("/products/:id", "features/clients/product-detail/index.tsx"),
    route("/profile", "features/clients/user-profile/index.tsx"),
    route("/cart", "features/clients/cart/index.tsx"),
    route("/address", "features/clients/address/index.tsx"),
    // route("products", "features/products/index.tsx"),
  ]),
  // Page custom riêng, không dùng default layout
  route("", "./layouts/admin-layout.tsx", [
    route("/system", "features/system/index.tsx"),
    // route("/system/dashboard", "features/system/index.tsx"),
    route("/system/products", "features/system/products/index.tsx"),
    route("/system/returns", "features/system/order-return/index.tsx"),
    route("/system/orders", "features/system/orders/index.tsx"),
    route("/system/promotions", "features/system/promotions/index.tsx"),
    route("/system/customers", "features/system/customers/index.tsx"),
    route("/system/suppliers", "features/system/suppliers/index.tsx"),
    route("/system/imports", "features/system/import-orders/index.tsx"),
    route(
      "/system/decentralization",
      "features/system/decentralization/index.tsx"
    ),
    route("/system/set-roles", "features/system/set-roles/index.tsx"),
    route("/system/categories", "features/system/categories/index.tsx"),
    route("/system/imports/history", "features/system/import-record/index.tsx"),
    route("/system/inventory", "features/system/inventory/index.tsx"),
    route("/system/payment", "features/system/payment/index.tsx"),
    route("/system/material", "features/system/material/index.tsx"),
  ]),
  route("login", "features/clients/auth/index.tsx"),
] satisfies RouteConfig;
