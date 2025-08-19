import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("", "./layouts/default-layout.tsx", [
    index("features/customers/home/index.tsx"),
    route("/categories", "features/customers/categories/index.tsx"),
    route("/payments", "features/customers/payment/index.tsx"),
    route("/products/:id", "features/customers/product-detail/index.tsx"),
    route("/profile", "features/customers/user-profile/index.tsx"),
    // route("products", "features/products/index.tsx"),
  ]),
  // Page custom riêng, không dùng default layout
  route("/system", "features/system/index.tsx"),
  //   route("login", "features/auth/login.tsx"),
] satisfies RouteConfig;
