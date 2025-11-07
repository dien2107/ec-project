import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // 🌐 CLIENT LAYOUT (CUSTOMER)
  route("", "./layouts/customer-layout.tsx", [
    index("features/clients/home/index.tsx"),
    route("/categories/:slug", "features/clients/categories/index.tsx"),
    route("/search", "features/clients/search/search-wrapper.tsx"),
    route("/products/:slug", "features/clients/product-detail/index.tsx"),
    route("/about", "features/clients/more/about.tsx"),
    route("brand-story", "features/clients/more/brand-story.tsx"),
    route("/team", "features/clients/more/team.tsx"),
    route("contact", "features/clients/more/contact.tsx"),

    // 🔒 Routes chỉ dành cho KHÁCH (không có roles)
    route("", "./libs/guards/client-protected.tsx", { id: "ClientProtected" }, [
      route("/profile", "features/clients/user-profile/index.tsx"),
      route("/cart", "features/clients/cart/index.tsx"),
      route("/address", "features/clients/address/index.tsx"),
      route("/payments", "features/clients/payment/index.tsx"),
      route(
        "/payment/online",
        "features/clients/payment/components/payment-handle.tsx"
      ),
    ]),
  ]),

  // ⚙️ ADMIN LAYOUT (SYSTEM)
  route("", "./layouts/admin-layout.tsx", [
    route("", "./libs/guards/system-protected.tsx", { id: "AdminProtected" }, [
      route("/system", "features/system/index.tsx"),
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
      route(
        "/system/imports/history",
        "features/system/import-record/index.tsx"
      ),
      route("/system/inventory", "features/system/inventory/index.tsx"),
      route("/system/shipping", "features/system/shipping/index.tsx"),
      route("/system/payment", "features/system/payment/index.tsx"),
      route("/system/material", "features/system/material/index.tsx"),
      route("/system/colors", "features/system/colors/index.tsx"),
      route("/system/sizes", "features/system/sizes/index.tsx"),
      route("/system/product-group", "features/system/product-group/index.tsx"),
      route(
        "/system/user",
        "features/system/user-information-detail/index.tsx"
      ),
    ]),
  ]),

  // 🔑 AUTH ROUTES
  route("", "./libs/guards/redirect-if-authenticated.tsx", [
    route("login", "features/clients/auth/login.tsx"),
    route("register", "features/clients/auth/register.tsx"),
    route("forgot-password", "features/clients/auth/forgot.tsx"),
    route("reset-password", "features/clients/auth/reset.tsx"),
    route("verify-successful", "features/clients/auth/verifySuccessful.tsx"),
  ]),

  // 💳 PAYMENT SUCCESS PAGE (public)
  route(
    "/payment/success",
    "features/clients/payment/components/payment-success.tsx"
  ),

  // 🔐 ADMIN LOGIN
  // route("/system/login", "features/system/login/index.tsx"),
] satisfies RouteConfig;
