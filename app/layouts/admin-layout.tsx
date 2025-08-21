import { Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import AdminSidebar from "~/layouts/components/admin-sidebar";
import AdminBreadcrumb from "~/layouts/components/admin-breadcrumb";

export default function Layout() {
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
