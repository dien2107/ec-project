import { SidebarMenuButton, useSidebar } from "~/components/ui/sidebar";
import { useEffect, useState } from "react";

export default function AdminCompany() {
  const [mounted, setMounted] = useState(false);
  const { state } = useSidebar();

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = {
    name: "Công ty INKVERSE",
    logo: "./public/logo/square.png",
    plan: "Enterprise",
  };

  if (!mounted) {
    return (
      <div className="w-full">
        <img
          src="https://res.yame.vn/Content/images/yame-f-logo-white.png"
          alt="Logo"
          className="object-fit"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <img
        src="https://res.yame.vn/Content/images/yame-f-logo-white.png"
        alt="Logo"
        className="object-fit"
      />
    </div>
  );
}
