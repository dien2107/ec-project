import { useEffect, useMemo, useState } from "react";
import UserInfo from "./components/user-info";
import { ChevronDown, ChevronUp } from "lucide-react";
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
import { fetchOrderListDataByUserId } from "~/redux/slices/orders";
import { useSearchParams } from "react-router";

export default function UserProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "thong-tin");
  const [statusFilter, setStatusFilter] = useState<"Tất cả" | OrderStatus>(
    "Tất cả"
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const dispatch = useAppDispatch();
  const [editOpen, setEditOpen] = useState(false);
  const user = useAppSelector((state: RootState) => state.auth.user);

  const { orderList } = useAppSelector(state => state.orderList);
  const [listOrder, setListOrder] = useState<OrderItem[]>([]);
  const [showAll, setShowAll] = useState(false);
  const ITEMS_PER_PAGE = 5;

  // Đọc tab từ URL khi component mount
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  useEffect(() => {
    if (user?.data?.userId) {
      dispatch(fetchOrderListDataByUserId(user.data.userId));
    }
  }, [dispatch, user?.data?.userId]);

  // 🔹 Khi orderList từ Redux có dữ liệu -> format lại cho UI
  useEffect(() => {
    if (!orderList?.data) return;
    console.log(orderList.data);
    const formattedList: OrderItem[] = orderList.data.items
      .flat()
      .map(order => {
        let uiStatus: OrderStatus = "Chờ xác nhận";

        switch (order.status.name) {
          case "Pending":
            uiStatus = "Chờ xác nhận";
            break;
          case "Confirmed":
            uiStatus = "Đã xác nhận";
            break;
          case "Processing":
            uiStatus = "Đang xử lý";
            break;
          case "Shipping":
            uiStatus = "Đang giao";
            break;
          case "Delivered":
            uiStatus = "Đã giao";
            break;
          case "Cancelled":
            uiStatus = "Đã hủy";
            break;
          default:
            uiStatus = "Chờ xác nhận";
        }
        console.log(order);
        return {
          id: order.orderId,
          status: uiStatus,
          date: order.createdAt.toString(),
          total: order.totalAmount,
          address: order.addressInfo,
          ReceivedName: order.receivedName,
          PhoneNumber: order.phoneNumber,
          user: {
            userId: order.user.userId,
            fullName: order.user.fullName,
            phone: order.user.phone,
          },
          items: order.items.map(item => {
            console.log(item);
            return {
              orderItemId: item.orderItemId,
              productVariantId: item.productVariantId,
              name: item.productName,
              slug: (item as any).slug,
              price: item.price,
              quantity: item.quantity,
              image: item.productImage,
              size: item.size,
              review: item.reviewOrder?.[0] || null,
              return: item.returnOrderDto,
            };
          }),
          payment: order.payment || null,
          shippingFee: order.shippingFee || 0,
          discount: order.discount || null,
        };
      });
    setListOrder(formattedList);

    // 🔹 Cập nhật selectedOrder nếu nó đang được mở
    if (selectedOrder) {
      const updatedOrder = formattedList.find(o => o.id === selectedOrder.id);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  }, [orderList, selectedOrder?.id]);

  // 🔹 Lọc theo trạng thái
  const filteredOrders = useMemo(() => {
    return statusFilter === "Tất cả"
      ? listOrder
      : listOrder.filter(o => o.status === statusFilter);
  }, [statusFilter, listOrder]);

  // 🔹 Hiển thị có giới hạn hoặc tất cả
  const displayedOrders = useMemo(() => {
    return showAll ? filteredOrders : filteredOrders.slice(0, ITEMS_PER_PAGE);
  }, [showAll, filteredOrders]);

  const hasMore = filteredOrders.length > ITEMS_PER_PAGE;

  // 🔹 Loading state khi chưa có user
  if (!user?.data) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }
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
              onChangeTab={tab => {
                setActiveTab(tab);
                setSearchParams({ tab });
              }}
              totalOrders={listOrder.length}
              user={user.data}
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
                    <>
                      <div className="space-y-4">
                        {displayedOrders.map(order => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            onClick={() => setSelectedOrder(order)}
                          />
                        ))}
                      </div>

                      {hasMore && !showAll && (
                        <div className="text-center mt-6">
                          <button
                            onClick={() => setShowAll(true)}
                            className="px-6 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer underline flex items-center gap-2 mx-auto"
                          >
                            <ChevronDown className="w-4 h-4" />
                            Xem thêm ({filteredOrders.length -
                              ITEMS_PER_PAGE}{" "}
                            đơn hàng)
                          </button>
                        </div>
                      )}

                      {showAll && hasMore && (
                        <div className="text-center mt-6">
                          <button
                            onClick={() => setShowAll(false)}
                            className="px-6 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer underline flex items-center gap-2 mx-auto"
                          >
                            <ChevronUp className="w-4 h-4" />
                            Thu gọn
                          </button>
                        </div>
                      )}
                    </>
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
          setSearchParams={setSearchParams}
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
    </div>
  );
}
