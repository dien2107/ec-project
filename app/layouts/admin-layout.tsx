import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import AdminSidebar from "~/layouts/components/admin-sidebar";
import AdminBreadcrumb from "~/layouts/components/admin-breadcrumb";

import { useEffect } from "react";
import { fetchStatuses } from "~/redux/slices/statuses";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { Button } from "~/components/ui/button";

// import errorImg from "~/public/500-internal-server-error.png";

export default function Layout() {
  const dispatch = useAppDispatch();
  const { statuses, isLoading, isError } = useAppSelector(
    (state) => state.statuses
  );

  useEffect(() => {
    dispatch(fetchStatuses());
  }, [dispatch]);

  // if (isError) {
  //   return (
  //     <div className="flex flex-col items-center justify-center py-12">
  //       <img
  //         src={"/500-internal-server-error.png"}
  //         alt="Lỗi 500"
  //         className="w-60 h-60"
  //       />
  //       <h2 className="text-2xl font-bold text-red-600 mb-2">
  //         Lỗi máy chủ (500)
  //       </h2>
  //       <p className="text-gray-500 mb-4">
  //         Không thể lấy dữ liệu trạng thái từ máy chủ.
  //         <br />
  //         Vui lòng thử lại sau hoặc liên hệ quản trị viên.
  //       </p>
  //       <Button
  //         className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
  //         onClick={() => window.location.reload()}
  //       >
  //         Thử lại
  //       </Button>
  //     </div>
  //   );
  // }

  return (
    <SidebarProvider className="max-w-full overflow-hidden bg-[#F8FAFC]">
      <AdminSidebar />
      <main className="flex flex-col overflow-hidden flex-grow p-6">
        <div>
          <div className="flex items-center justify-start gap-2 mb-4">
            <SidebarTrigger />
            <AdminBreadcrumb />
          </div>
          <div className="min-h-screen">
            <div className="container mx-auto mb-6">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
