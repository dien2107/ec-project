import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { AdminSidebar } from "~/features/system/components/admin-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}