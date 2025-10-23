import { User, MapPin, ShoppingCart, KeyRound, CreditCard } from "lucide-react";
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
    { id: "thanh-toan", label: "Phương thức thanh toán", icon: CreditCard },
  ];

  return (
    <nav className="bg-white rounded-xl shadow-lg border p-4 sticky top-24">
      {/* Profile header */}
      <div className="flex items-center gap-3 pb-4 border-b mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          {/* placeholder avatar */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            className="text-gray-300"
          >
            <path
              d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div>
          <div className="text-md font-medium">luquangminh29</div>
          <div
            className="text-xs text-gray-400 mt-1 cursor-pointer"
            onClick={() => onChangeTab("thong-tin")}
          >
            Sửa Hồ Sơ
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`cursor-pointer flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors duration-150 ${
                isActive
                  ? "bg-black text-white shadow-sm "
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-md mr-3 flex-shrink-0 ${isActive ? "bg-gray-100" : "bg-gray-100"}`}
                >
                  <item.icon
                    className={`h-4 w-4 ${isActive ? "text-black" : "text-gray-500"}`}
                  />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>

              {item.id === "don-hang" && (
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full ${isActive ? "bg-gray-200 text-black" : "bg-gray-200 text-gray-700"}`}
                >
                  {totalOrders}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
