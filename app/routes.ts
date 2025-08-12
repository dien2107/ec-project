import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("features/home/index.tsx"),
  route("/categories", "features/categories/index.tsx"),
] satisfies RouteConfig;
