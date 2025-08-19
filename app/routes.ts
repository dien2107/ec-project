import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("", "./layouts/default-layout.tsx", [
    index("features/home/index.tsx"),
    route("/categories", "features/categories/index.tsx"),
    route("/payments", "features/payment/index.tsx"),
    route("/products/:id", "features/product-detail/index.tsx"),
    route("/profile", "features/user-profile/index.tsx"),
    // route("products", "features/products/index.tsx"),
  ]),
  // Page custom riêng, không dùng default layout
  //   route("login", "features/auth/login.tsx"),
] satisfies RouteConfig;
