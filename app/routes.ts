import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("", "./layouts/customer-layout.tsx", [
    index("features/customers/home/index.tsx"),
    route("/categories", "features/customers/categories/index.tsx"),
    route("/payments", "features/customers/payment/index.tsx"),
    route("/products/:id", "features/customers/product-detail/index.tsx"),
    route("/profile", "features/customers/user-profile/index.tsx"),
    // route("products", "features/products/index.tsx"),
  ]),
  // Page custom riêng, không dùng default layout
  route("", "./layouts/admin-layout.tsx", [
    route("/system", "features/system/index.tsx"),
    route("/system/dashboard", "features/system/index.tsx"),
    route("/system/products", "features/system/products/index.tsx"),
    route("/system/orders", "features/system/orders/index.tsx"),
    route("/system/promotions", "features/system/promotions/index.tsx"),
  ]),
  //   route("login", "features/auth/login.tsx"),
] satisfies RouteConfig;
