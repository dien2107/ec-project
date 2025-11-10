import {
  Home,
  ShoppingBag,
  ClipboardList,
  Users,
  Tags,
  Truck,
  ShieldCheck,
  Key,
  PackagePlus,
  Tag,
  RefreshCcw,
  CreditCard,
  Shirt,
  Palette,
  FolderOpen,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "~/components/ui/sidebar";

import AdminSidebarUser from "./admin-sidebar-user";
import AdminSidebarMenuGroup from "./admin-sidebar-menu-group";
import AdminCompany from "./admin-company";
import { useAppSelector } from "~/redux/store";

export default function AdminSidebar() {
  const { user } = useAppSelector((state) => state.auth);
  const userData = user?.data;
  const userRoles = userData?.roles?.map((r: any) => r.name) ?? [];

  // ==============================================
  // 🔹 Nhóm menu chia theo vai trò thực tế
  // ==============================================
  const menuGroups = [
    // CEO & tất cả đều thấy "Tổng quan"
    {
      group_label: "Tổng quan",
      roles: ["CEO", "Admin", "ProductManager", "InventoryManager", "SalesManager"],
      items: [{ title: "Tổng quan", url: "/system", icon: Home }],
    },

    // Quản lý sản phẩm → ProductManager
    {
      group_label: "Quản lý sản phẩm",
      roles: ["CEO", "ProductManager"],
      items: [
        { title: "Sản phẩm", url: "/system/products", icon: ShoppingBag },
        { title: "Nhóm sản phẩm", url: "/system/product-group", icon: FolderOpen },
        { title: "Thể loại", url: "/system/categories", icon: Tags },
        { title: "Chất liệu", url: "/system/material", icon: Shirt },
        { title: "Màu sắc", url: "/system/colors", icon: Palette },
        { title: "Kích thước", url: "/system/sizes", icon: Tag },
      ],
    },

    // Quản lý kho & nhập hàng → InventoryManager
    {
      group_label: "Quản lý kho & nhập hàng",
      roles: ["CEO", "InventoryManager"],
      items: [
        { title: "Nhà cung cấp", url: "/system/suppliers", icon: Truck },
        { title: "Nhập hàng", url: "/system/imports", icon: PackagePlus },
        { title: "Đổi/Trả hàng", url: "/system/returns", icon: RefreshCcw },
      ],
    },

    // Quản lý bán hàng → SalesManager
    {
      group_label: "Quản lý bán hàng",
      roles: ["CEO", "SalesManager"],
      items: [
        { title: "Đơn hàng", url: "/system/orders", icon: ClipboardList },
        { title: "Khuyến mãi", url: "/system/promotions", icon: Tag },
        { title: "Khách hàng", url: "/system/customers", icon: Users },
        { title: "Phương thức thanh toán", url: "/system/payment", icon: CreditCard },
        { title: "Phương thức giao hàng", url: "/system/shipping", icon: Truck },
      ],
    },

    // Phân quyền & hệ thống → Admin
    {
      group_label: "Phân quyền hệ thống",
      roles: ["CEO", "Admin"],
      items: [
        { title: "Thiết lập quyền hạn", url: "/system/decentralization", icon: ShieldCheck },
        { title: "Phân quyền nhân viên", url: "/system/set-roles", icon: Key },
      ],
    },
  ];

  // ==============================================
  // 🔸 Lọc menu theo vai trò người dùng
  // ==============================================
  const filterByRole = (groups: typeof menuGroups) => {
    if (userRoles.includes("CEO")) return groups; // CEO thấy tất cả
    return groups.filter((g) => g.roles.some((role) => userRoles.includes(role)));
  };

  const visibleGroups = filterByRole(menuGroups);

  // ==============================================
  // 🔹 Render sidebar
  // ==============================================
  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader>
        <AdminCompany />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {visibleGroups.map((group, idx) => (
          <AdminSidebarMenuGroup key={idx} group={group} />
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <AdminSidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
