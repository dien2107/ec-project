import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";

const Navbar = ({ className = "" }: { className?: string }) => {
  return (
    <NavigationMenu className={`hidden lg:flex ${className}`}>
      <NavigationMenuList className="flex items-center space-x-6">
        {[
          { label: "Áo", href: "/ao" },
          { label: "Quần", href: "/quan" },
          { label: "Phụ kiện", href: "/phu-kien" },
          { label: "Khuyến mãi - Giảm giá", href: "/khuyen-mai-giam-gia" },
          { label: "Đồ thể thao", href: "/do-the-thao" },
        ].map(({ label, href }) => (
          <NavigationMenuItem key={href}>
            <NavigationMenuLink
              className="text-base text-white transition-colors"
              href={href}
            >
              {label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
