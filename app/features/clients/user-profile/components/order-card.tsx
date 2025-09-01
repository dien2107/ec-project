import { ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import type { OrderItem, OrderStatus } from "~/features/clients/user-profile/types/user";

const statusIconMap: Record<OrderStatus, React.ReactNode> = {
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

export default function OrderCard({
  order,
  onClick,
}: {
  order: OrderItem;
  onClick: () => void;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {statusIconMap[order.status]}
            <div>
              <h3 className="font-semibold">Đơn hàng #{order.id}</h3>
              <p className="text-sm text-gray-500">Ngày đặt: {order.date}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadgeClass(
              order.status
            )}`}
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
              <h4 className="font-medium">{order.items[0].name}</h4>
              {order.items[0].variant && (
                <p className="text-sm text-gray-500">
                  {order.items[0].variant}
                </p>
              )}
              <p className="text-sm mt-1">
                {order.items[0].price.toLocaleString("vi-VN")}₫ ×{" "}
                {order.items[0].quantity}
              </p>
            </div>
            <div className="font-medium">
              {(order.items[0].price * order.items[0].quantity).toLocaleString(
                "vi-VN"
              )}
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
            onClick={onClick}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <ChevronRight className="h-4 w-4 mr-1" />
            Xem chi tiết
          </Button>
          <p className="font-bold text-xl text-blue-600">
            {order.total.toLocaleString("vi-VN")}₫
          </p>
        </div>
      </div>
    </div>
  );
}
