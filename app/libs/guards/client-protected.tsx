import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "~/redux/store";

export default function ClientProtected() {
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const userData = user?.data;
  const userRoles = userData?.roles?.map((r: any) => r.roleId) ?? [];

  // ❌ Nếu chưa đăng nhập → về login
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ❌ Nếu có roles (người thuộc hệ thống) → không cho vào client routes
  if (userRoles.length > 0) {
    return <Navigate to="/system" replace />;
  }

  // ✅ Cho phép truy cập
  return <Outlet />;
}
