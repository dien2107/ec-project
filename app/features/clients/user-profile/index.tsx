import { useMemo, useState } from "react";
import UserInfo from "./components/user-info";
import { Package } from "lucide-react";
import type {
  OrderItem,
  OrderStatus,
} from "~/features/clients/user-profile/types/user";
import {
  mockOrders,
  mockUserData,
} from "~/features/clients/user-profile/data/fake-user";
import Sidebar from "~/features/clients/user-profile/components/sidebar";
import OrderStatusTabs from "~/features/clients/user-profile/components/order-status";
import OrderCard from "~/features/clients/user-profile/components/order-card";
import OrderDetailsModal from "~/features/clients/user-profile/components/order-detail";
import AddressManagement from "../address";
import ChangePassword from "~/features/clients/user-profile/components/change-password";
import PaymentCards from "./components/payment-cards";

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("thong-tin");
  const [statusFilter, setStatusFilter] = useState<"Tất cả" | OrderStatus>(
    "Tất cả"
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const filteredOrders = useMemo(() => {
    return statusFilter === "Tất cả"
      ? mockOrders
      : mockOrders.filter(o => o.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Tài khoản của tôi</h1>
          <div className="text-sm text-gray-600">
            Xin chào,{" "}
            <span className="font-medium">{mockUserData.fullName}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <Sidebar
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              totalOrders={mockOrders.length}
            />
          </div>

          <div className="lg:col-span-9">
            {activeTab === "don-hang" && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <Package className="h-6 w-6 mr-2 text-blue-600" />
                    Đơn hàng của tôi
                  </h2>
                </div>

                <div className="p-6">
                  <OrderStatusTabs
                    currentStatus={statusFilter}
                    onChange={setStatusFilter}
                  />

                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <p>Không có đơn hàng</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map(order => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onClick={() => setSelectedOrder(order)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "thong-tin" && <UserInfo />}
            {activeTab === "doi-mat-khau" && <ChangePassword />}
            {activeTab === "dia-chi" && (
              // <div className="bg-white rounded-lg shadow-sm p-6 text-gray-500 text-center">
              //   Trang địa chỉ sẽ được cập nhật sau
              // </div>
              <AddressManagement></AddressManagement>
            )}
            {activeTab === "thanh-toan" && <PaymentCards />}
          </div>
        </div>

        <OrderDetailsModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
    </div>
  );
}
