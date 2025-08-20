import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { Link, useLocation } from "react-router"
 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

const items = [
  {
    title: "Home",
    url: "/system",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "/system/inbox",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "/system/calendar",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "/system/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/system/settings",
    icon: Settings,
  },
]


export function AdminSidebar() {
  const location = useLocation()
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={isActive ? "bg-blue-50 text-blue-600" : ""}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}