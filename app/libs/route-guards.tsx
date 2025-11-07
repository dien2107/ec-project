import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "~/redux/store";

export function ProtectedRoute({ roles }: { roles?: string[] }) {
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // user.data là thông tin thật
  const userData = user?.data;
  const userRoles = userData?.roles?.map((r: any) => r.roleId) ?? [];

  console.log("ProtectedRoute - roles:", userRoles);

  // Nếu chưa đăng nhập → về login
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu có roles yêu cầu → kiểm tra quyền
  if (roles && roles.length > 0) {
    const hasRole = roles.some((r) => userRoles.includes(r));
    if (!hasRole) {
      return userRoles.length > 0
        ? <Navigate to="/system" replace />
        : <Navigate to="/profile" replace />;
    }
  }

  return <Outlet />;
}

export function RedirectIfAuthenticated() {
  const { accessToken, user } = useAppSelector((state) => state.auth);

  const userData = user?.data;
  const userRoles = userData?.roles?.map((r: any) => r.roleName) ?? [];

  if (accessToken) {
    // ✅ Nếu là user system (có role) → về system
    if (userRoles.length > 0) {
      return <Navigate to="/system" replace />;
    }

    // ✅ Nếu là user client (không có role) → về profile
    return <Navigate to="/profile" replace />;
  }

  // ✅ Nếu chưa đăng nhập → cho phép tiếp tục
  return <Outlet />;
}
