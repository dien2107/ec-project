import { useState } from "react";
import {
  ChevronRight,
  Package,
  ShoppingCart,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";

const mockUserData = {
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
};

interface OrderItem {
  id: string;
  status: OrderStatus;
  date: string;
  total: number;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string;
  }[];
}

type OrderStatus = "Chờ xác nhận" | "Đang giao" | "Đã giao" | "Đã hủy";

const mockOrders: OrderItem[] = [
  {
    id: "ORD-2025-001",
    status: "Chờ xác nhận",
    date: "10/08/2025",
    total: 350000,
    items: [
      {
        id: "1-1",
        name: "Áo thun form rộng Unisex",
        price: 150000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
        variant: "Trắng / L",
      },
      {
        id: "1-2",
        name: "Quần jeans slim fit",
        price: 200000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
        variant: "Xanh / 30",
      },
    ],
  },
  {
    id: "ORD-2025-002",
    status: "Đang giao",
    date: "08/08/2025",
    total: 550000,
    items: [
      {
        id: "2-1",
        name: "Giày sneaker thời trang",
        price: 550000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
        variant: "Trắng / 40",
      },
    ],
  },
  {
    id: "ORD-2025-003",
    status: "Đã giao",
    date: "05/08/2025",
    total: 420000,
    items: [
      {
        id: "3-1",
        name: "Balo laptop chống nước",
        price: 220000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      },
      {
        id: "3-2",
        name: "Mũ lưỡi trai",
        price: 100000,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=300&fit=crop",
        variant: "Đen / Free size",
      },
    ],
  },
  {
    id: "ORD-2025-004",
    status: "Đã hủy",
    date: "03/08/2025",
    total: 180000,
    items: [
      {
        id: "4-1",
        name: "Mũ bucket họa tiết vintage",
        price: 180000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=300&fit=crop",
        variant: "Kẻ sọc / Free size",
      },
    ],
  },
];

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  "Chờ xác nhận": <Clock className="h-4 w-4 text-amber-500" />,
  "Đang giao": <Truck className="h-4 w-4 text-blue-500" />,
  "Đã giao": <CheckCircle2 className="h-4 w-4 text-green-500" />,
  "Đã hủy": <XCircle className="h-4 w-4 text-red-500" />,
};

function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: {
  order: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/40 bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              {statusIcons[order.status]}
              <div>
                <h2 className="text-xl font-semibold">
                  Chi tiết đơn hàng #{order.id}
                </h2>
                <p className="text-sm text-gray-500">Ngày đặt: {order.date}</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="mb-6">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "Đã giao"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Đang giao"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "Chờ xác nhận"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg">Sản phẩm đã đặt</h3>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-md object-cover border"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{item.name}</h4>
                    {item.variant && (
                      <p className="text-sm text-gray-600 mt-1">
                        {item.variant}
                      </p>
                    )}
                    <p className="text-sm mt-2">
                      {item.price.toLocaleString("vi-VN")}₫ × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">Tổng kết đơn hàng</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{order.total.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giảm giá</span>
                  <span>0₫</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">
                    {order.total.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserProfilePage() {
  const [user] = useState(mockUserData);
  const [activeTab, setActiveTab] = useState("don-hang");
  const [statusFilter, setStatusFilter] = useState<"Tất cả" | OrderStatus>(
    "Tất cả"
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusTabs: ("Tất cả" | OrderStatus)[] = [
    "Tất cả",
    "Chờ xác nhận",
    "Đang giao",
    "Đã giao",
    "Đã hủy",
  ];

  const filteredOrders =
    statusFilter === "Tất cả"
      ? mockOrders
      : mockOrders.filter((o) => o.status === statusFilter);

  const openOrderDetails = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeOrderDetails = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tài khoản của tôi
          </h1>
          <div className="text-sm text-gray-600">
            Xin chào, <span className="font-medium">{user.fullName}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24 border border-gray-100">
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-md">
                      <span className="text-blue-600 font-bold text-xl">
                        {user.fullName.charAt(0)}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-white">
                    <h3 className="font-semibold text-lg">{user.fullName}</h3>
                    <p className="text-blue-100 text-sm">{user.email}</p>
                    <p className="text-blue-200 text-xs mt-1">
                      Thành viên từ 2024
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-5 rounded-full translate-y-8 -translate-x-8"></div>
              </div>

              <nav className="p-2">
                <div className="space-y-1">
                  <Button
                    onClick={() => setActiveTab("thong-tin")}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                      activeTab === "thong-tin"
                        ? "bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600"
                        : "hover:bg-gray-50 text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <div
                        className={`p-2 rounded-md mr-3 transition-colors flex-shrink-0 ${
                          activeTab === "thong-tin"
                            ? "bg-blue-100"
                            : "bg-gray-100 group-hover:bg-blue-100"
                        }`}
                      >
                        <User
                          className={`h-4 w-4 ${
                            activeTab === "thong-tin"
                              ? "text-blue-600"
                              : "text-gray-500 group-hover:text-blue-600"
                          }`}
                        />
                      </div>
                      <span className="font-medium">Thông tin tài khoản</span>
                    </div>
                  </Button>

                  <Button
                    onClick={() => setActiveTab("dia-chi")}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                      activeTab === "dia-chi"
                        ? "bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600"
                        : "hover:bg-gray-50 text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <div
                        className={`p-2 rounded-md mr-3 transition-colors flex-shrink-0 ${
                          activeTab === "dia-chi"
                            ? "bg-blue-100"
                            : "bg-gray-100 group-hover:bg-blue-100"
                        }`}
                      >
                        <MapPin
                          className={`h-4 w-4 ${
                            activeTab === "dia-chi"
                              ? "text-blue-600"
                              : "text-gray-500 group-hover:text-blue-600"
                          }`}
                        />
                      </div>
                      <span className="font-medium">Địa chỉ giao hàng</span>
                    </div>
                  </Button>

                  <Button
                    onClick={() => setActiveTab("don-hang")}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                      activeTab === "don-hang"
                        ? "bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600"
                        : "hover:bg-gray-50 text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <div
                        className={`p-2 rounded-md mr-3 transition-colors flex-shrink-0 ${
                          activeTab === "don-hang"
                            ? "bg-blue-100"
                            : "bg-gray-100 group-hover:bg-blue-100"
                        }`}
                      >
                        <ShoppingCart
                          className={`h-4 w-4 ${
                            activeTab === "don-hang"
                              ? "text-blue-600"
                              : "text-gray-500 group-hover:text-blue-600"
                          }`}
                        />
                      </div>
                      <span className="font-medium">Đơn hàng của tôi</span>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                          activeTab === "don-hang"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 group-hover:bg-blue-600 group-hover:text-white"
                        }`}
                      >
                        {mockOrders.length}
                      </span>
                    </div>
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Thống kê
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">
                        Tổng đơn hàng
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {mockOrders.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">
                        Đã hoàn thành
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {
                          mockOrders.filter((o) => o.status === "Đã giao")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Đang xử lý</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {
                          mockOrders.filter(
                            (o) =>
                              o.status === "Chờ xác nhận" ||
                              o.status === "Đang giao"
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
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
                  <div className="border-b mb-6">
                    <div className="flex space-x-8 overflow-x-auto">
                      {statusTabs.map((status) => (
                        <Button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                            statusFilter === status
                              ? "border-blue-600 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="mx-auto h-16 w-16 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">
                        Không có đơn hàng
                      </h3>
                      <p className="mt-2 text-gray-500">
                        Bạn chưa có đơn hàng nào ở trạng thái này
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => (
                        <div
                          key={order.id}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                {statusIcons[order.status]}
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    Đơn hàng #{order.id}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    Ngày đặt: {order.date}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  order.status === "Đã giao"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "Đang giao"
                                      ? "bg-blue-100 text-blue-800"
                                      : order.status === "Chờ xác nhận"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>

                            <div className="border-t border-b py-4 my-4">
                              <div className="flex items-start space-x-4">
                                <img
                                  src={order.items[0].image}
                                  alt={order.items[0].name}
                                  className="h-16 w-16 rounded-md object-cover border"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium">
                                    {order.items[0].name}
                                  </h4>
                                  {order.items[0].variant && (
                                    <p className="text-sm text-gray-500">
                                      {order.items[0].variant}
                                    </p>
                                  )}
                                  <p className="text-sm mt-1">
                                    {order.items[0].price.toLocaleString(
                                      "vi-VN"
                                    )}
                                    ₫ × {order.items[0].quantity}
                                  </p>
                                </div>
                                <div className="font-medium">
                                  {(
                                    order.items[0].price *
                                    order.items[0].quantity
                                  ).toLocaleString("vi-VN")}
                                  ₫
                                </div>
                              </div>

                              {order.items.length > 1 && (
                                <div className="mt-3 text-sm text-gray-500">
                                  + {order.items.length - 1} sản phẩm khác
                                </div>
                              )}
                            </div>

                            <div className="flex justify-between items-center">
                              <Button
                                onClick={() => openOrderDetails(order)}
                                className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                              >
                                <ChevronRight className="h-4 w-4 mr-1" />
                                Xem chi tiết
                              </Button>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">
                                  Tổng thanh toán
                                </p>
                                <p className="font-bold text-xl text-blue-600">
                                  {order.total.toLocaleString("vi-VN")}₫
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "thong-tin" && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <User className="h-6 w-6 mr-2 text-blue-600" />
                    Thông tin tài khoản
                  </h2>
                </div>
                <div className="p-6">
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      Trang thông tin tài khoản sẽ được cập nhật sau
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "dia-chi" && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                    Địa chỉ giao hàng
                  </h2>
                </div>
                <div className="p-6">
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      Trang địa chỉ sẽ được cập nhật sau
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={closeOrderDetails}
      />
    </div>
  );
}
