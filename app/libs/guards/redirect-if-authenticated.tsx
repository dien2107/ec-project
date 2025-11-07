import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "~/redux/store";

export default function RedirectIfAuthenticated() {
  const { accessToken, user } = useAppSelector((state) => state.auth);

  const userData = user?.data;
  const userRoles = userData?.roles?.map((r: any) => r.roleName) ?? [];

  if (accessToken) {
    // Nếu là người hệ thống → sang /system
    if (userRoles.length > 0) {
      return <Navigate to="/system" replace />;
    }
    // Nếu là khách → sang /profile
    return <Navigate to="/profile" replace />;
  }

  // Nếu chưa đăng nhập → cho phép vào trang login/register
  return <Outlet />;
}
