import {
  Home,
  ShoppingBag,
  ClipboardList,
  Users,
  Tags,
  Warehouse,
  Truck,
  ShieldCheck,
  Key,
  PackagePlus,
  History,
  Tag,
  RefreshCcw,
  CreditCard,
  Shirt,
  Palette,
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
import Colors from "~/features/system/colors";

const mainMangeItems = {
  group_label: "Quản lý chính",
  items: [
    {
      title: "Tổng quan",
      url: "/system",
      icon: Home,
    },
    {
      title: "Sản phẩm",
      url: "/system/products",
      icon: ShoppingBag,
    },
    {
      title: "Chất liệu",
      url: "/system/material",
      icon: Shirt,
    },
    {
      title: "Màu sắc",
      url: "/system/colors",
      icon: Palette,
    },
    {
      title: " Kích thước",
      url: "/system/sizes",
      icon: Tag,
    },
    {
      title: "Đơn hàng",
      url: "/system/orders",
      icon: ClipboardList,
    },
    {
      title: "Khách hàng",
      url: "/system/customers",
      icon: Users,
    },
    {
      title: "Thể loại",
      url: "/system/categories",
      icon: Tags,
    },
    // {
    //   title: "Kho hàng",
    //   url: "/system/inventory",
    //   icon: Warehouse,
    // },
    {
      title: "Nhà cung cấp",
      url: "/system/suppliers",
      icon: Truck,
    },
    {
      title: "Khuyến mãi",
      url: "/system/promotions",
      icon: Tag,
    },
    {
      title: "Đổi/Trả hàng",
      url: "/system/returns",
      icon: RefreshCcw,
    },
    {
      title: "Phương thức thanh toán",
      url: "/system/payment",
      icon: CreditCard,
    },
    {
      title: "Phương thức giao hàng",
      url: "/system/shipping",
      icon: Truck,
    },
  ],
};

const permissionsItems = {
  group_label: "Phân quyền",
  items: [
    {
      title: "Thiết lập quyền hạn",
      url: "/system/decentralization",
      icon: ShieldCheck,
    },
    {
      title: "Phân quyền nhân viên",
      url: "/system/set-roles",
      icon: Key,
    },
  ],
};

const importItems = {
  group_label: "Nhập hàng",
  items: [
    {
      title: "Nhập hàng",
      url: "/system/imports",
      icon: PackagePlus,
    },
    // {
    //   title: "Lịch sử nhập hàng",
    //   url: "/system/imports/history",
    //   icon: History,
    // },
  ],
};

export default function AdminSidebar() {
  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader>
        <AdminCompany />
      </SidebarHeader>

      {/* Body */}
      <SidebarContent>
        <AdminSidebarMenuGroup group={mainMangeItems} />
        <AdminSidebarMenuGroup group={permissionsItems} />
        <AdminSidebarMenuGroup group={importItems} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <AdminSidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
