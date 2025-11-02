import { useEffect, useMemo, useState } from "react";
import UserInfo from "./components/user-info";
import { Package } from "lucide-react";
import type {
  OrderItem,
  OrderStatus,
} from "~/features/clients/user-profile/types/user";
import Sidebar from "~/features/clients/user-profile/components/sidebar";
import OrderStatusTabs from "~/features/clients/user-profile/components/order-status";
import OrderCard from "~/features/clients/user-profile/components/order-card";
import OrderDetailsModal from "~/features/clients/user-profile/components/order-detail";
import AddressManagement from "../address";
import ChangePassword from "~/features/clients/user-profile/components/change-password";
import PaymentCards from "./components/payment-cards";
import { useAppDispatch, useAppSelector, type RootState } from "~/redux/store";
import {
  fetchOrderListData,
  fetchOrderListDataByUserId,
} from "~/redux/slices/orders";
import { useSelector } from "react-redux";

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("thong-tin");
  const [statusFilter, setStatusFilter] = useState<"Tất cả" | OrderStatus>(
    "Tất cả"
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const dispatch = useAppDispatch();
  const [editOpen, setEditOpen] = useState(false);
  const user = useAppSelector((state: RootState) => state.auth.user);

  const { orderList } = useAppSelector(state => state.orderList);
  const [listOrder, setListOrder] = useState<OrderItem[]>([]);
  // 🔹 Lấy danh sách đơn hàng khi load trang
  console.log(user);
  console.log(listOrder);
  useEffect(() => {
    if (user?.data?.userId) {
      dispatch(fetchOrderListDataByUserId(user.data.userId));
    }
  }, [dispatch, user?.data?.userId]);

  // 🔹 Khi orderList từ Redux có dữ liệu -> format lại cho UI
  useEffect(() => {
    if (!orderList?.data) return;

    const formattedList: OrderItem[] = orderList.data.map(order => ({
      id: order.orderId,
      status:
        order.status.name === "Pending"
          ? "Chờ xác nhận"
          : order.status.name === "Confirmed"
            ? "Đang giao"
            : order.status.name === "Delivered"
              ? "Đã giao"
              : order.status.name === "Cancelled"
                ? "Đã hủy"
                : "Chờ xác nhận",
      date: order.createdAt.toString(),
      total: order.totalAmount,
      address: order.addressInfo,
      user: {
        userId: order.user.userId,
        fullName: order.user.fullName,
        phone: order.user.phone,
      },
      items: order.items.map(item => ({
        orderItemId: item.orderItemId,
        productVariantId: item.productVariantId, // hoặc item.productVariantId nếu có
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
        image: item.productImage,
        size: item.size,
      })),
    }));

    setListOrder(formattedList);
  }, [orderList]);

  // 🔹 Lọc theo trạng thái
  const filteredOrders = useMemo(() => {
    return statusFilter === "Tất cả"
      ? listOrder
      : listOrder.filter(o => o.status === statusFilter);
  }, [statusFilter, listOrder]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Hồ Sơ Của Tôi</h1>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý thông tin hồ sơ để bảo mật tài khoản
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <Sidebar
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              totalOrders={listOrder.length}
            />
          </div>

          <div className="lg:col-span-9">
            {activeTab === "don-hang" && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h1 className="text-2xl font-semibold tracking-tight flex items-center">
                    Đơn hàng của tôi
                  </h1>
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
            {activeTab === "dia-chi" && <AddressManagement />}
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
