import { X, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { OrderItem, OrderStatus } from "~/features/clients/user-profile/types/user";

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  "Chờ xác nhận": <Clock className="h-4 w-4 text-amber-500" />,
  "Đang giao": <Truck className="h-4 w-4 text-blue-500" />,
  "Đã giao": <CheckCircle2 className="h-4 w-4 text-green-500" />,
  "Đã hủy": <XCircle className="h-4 w-4 text-red-500" />,
};

const statusBadgeClass = (status: OrderStatus) => {
  switch (status) {
    case "Đã giao":
      return "bg-green-100 text-green-800";
    case "Đang giao":
      return "bg-blue-100 text-blue-800";
    case "Chờ xác nhận":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-red-100 text-red-800";
  }
};

export default function OrderDetailsModal({
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
        className="fixed inset-0 bg-black/40"
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
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-custom">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadgeClass(
                order.status
              )}`}
            >
              {order.status}
            </span>

            <div className="mt-6 space-y-4">
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

            <div className="border-t pt-6 mt-6">
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
