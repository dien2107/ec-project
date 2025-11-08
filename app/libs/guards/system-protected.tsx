import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "~/redux/store";

export default function SystemProtected() {
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const userData = user?.data;
  const userRoles = userData?.roles?.map((r: any) => r.roleId) ?? [];

  // ❌ Nếu chưa đăng nhập → về trang login admin
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ❌ Nếu không có role (client user) → không cho vào system
  if (userRoles.length === 0) {
    return <Navigate to="/profile" replace />;
  }

  // ✅ Cho phép truy cập
  return <Outlet />;
}
