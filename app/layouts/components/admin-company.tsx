import { SidebarMenuButton, useSidebar } from "~/components/ui/sidebar";

export default function AdminCompany() {
  const { state } = useSidebar();

  const data = {
    name: "Công ty INKVERSE",
    logo: "./public/logo/square.png",
    plan: "Enterprise",
  };

  return (
    <div className="w-full ">
      <img
        src="https://res.yame.vn/Content/images/yame-f-logo-white.png"
        alt="Logo"
        className="object-fit"
      />
    </div>
  );
}
