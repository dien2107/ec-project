import { User, MapPin, ShoppingCart, KeyRound } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function Sidebar({
  activeTab,
  onChangeTab,
  totalOrders,
}: {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  totalOrders: number;
}) {
  const navItems = [
    { id: "thong-tin", label: "Thông tin tài khoản", icon: User },
    { id: "dia-chi", label: "Địa chỉ giao hàng", icon: MapPin },
    { id: "don-hang", label: "Đơn hàng của tôi", icon: ShoppingCart },
    { id: "doi-mat-khau", label: "Đổi mật khẩu", icon: KeyRound },
  ];

  return (
    <nav className="bg-white rounded-xl shadow-lg border p-2 sticky top-24">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <Button
            key={item.id}
            onClick={() => onChangeTab(item.id)}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
              isActive
                ? "bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600"
                : "hover:bg-gray-50 text-gray-700 hover:text-blue-600"
            }`}
          >
            <div className="flex items-center flex-1">
              <div
                className={`p-2 rounded-md mr-3 flex-shrink-0 ${
                  isActive ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                <item.icon
                  className={`h-4 w-4 ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}
                />
              </div>
              <span className="font-medium">{item.label}</span>
            </div>

            {item.id === "don-hang" && (
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {totalOrders}
              </span>
            )}
          </Button>
        );
      })}
    </nav>
  );
}
