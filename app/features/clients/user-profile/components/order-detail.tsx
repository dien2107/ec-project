import {
  X,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Star,
  Camera,
  Video,
  Send,
  Package,
  MapPin,
  User,
  Phone,
  PackageCheck,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import type {
  OrderItem,
  OrderStatus,
} from "~/features/clients/user-profile/types/user";
import ReviewForm from "./review-form";
import { cancelOrder } from "~/services/order";
import { toast } from "react-hot-toast";
import ReturnForm from "./return-form";

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  "Chờ xác nhận": <Clock className="h-4 w-4 text-amber-500" />,
  "Đã xác nhận": <CheckCircle2 className="h-4 w-4 text-blue-500" />,
  "Đang xử lý": <Package className="h-4 w-4 text-purple-500" />,
  "Đang giao": <Truck className="h-4 w-4 text-blue-500" />,
  "Đã giao": <PackageCheck className="h-4 w-4 text-green-500" />,
  "Đã hủy": <XCircle className="h-4 w-4 text-red-500" />,
};

const statusBadgeClass = (status: OrderStatus) => {
  switch (status) {
    case "Đã giao":
      return "bg-green-100 text-green-800";
    case "Đang giao":
      return "bg-blue-100 text-blue-800";
    case "Đang xử lý":
      return "bg-purple-100 text-purple-800";
    case "Đã xác nhận":
      return "bg-cyan-100 text-cyan-800";
    case "Chờ xác nhận":
      return "bg-yellow-100 text-yellow-800";
    case "Đã hủy":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getOrderSteps = (status: OrderStatus) => {
  const steps = [
    { label: "Đơn hàng đã đặt", status: "Chờ xác nhận" },
    { label: "Đã xác nhận", status: "Đã xác nhận" },
    { label: "Đang xử lý", status: "Đang xử lý" },
    { label: "Đang giao hàng", status: "Đang giao" },
    { label: "Đã giao", status: "Đã giao" },
  ];

  const statusOrder = [
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang xử lý",
    "Đang giao",
    "Đã giao",
    "Đã hủy",
  ];
  const currentIndex = statusOrder.indexOf(status);

  return steps.map((step, index) => ({
    ...step,
    completed: index <= currentIndex && status !== "Đã hủy",
    active: index === currentIndex && status !== "Đã hủy",
  }));
};

// Helper function để render nút đánh giá
const renderReviewButton = (
  orderDate: string,
  item: OrderItem["items"][0],
  handleReviewProduct: (
    orderItemId: number,
    productName: string,
    productImage: string
  ) => void
) => {
  // Kiểm tra đã quá 7 ngày chưa
  const orderDateTime = new Date(orderDate);
  const currentDate = new Date();
  const daysDiff = Math.floor(
    (currentDate.getTime() - orderDateTime.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpired = daysDiff > 7;

  if (isExpired) return null;

  // Nếu chưa có review
  if (item.review == null) {
    return (
      <Button
        onClick={() => {
          handleReviewProduct(item.orderItemId, item.name, item.image);
        }}
        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 flex items-center space-x-2"
      >
        <Star className="h-4 w-4" />
        <span>Viết đánh giá</span>
      </Button>
    );
  }

  if (item.review.isEdited) return null;
  // Nếu đã có review
  return (
    <Button
      onClick={() => {
        handleReviewProduct(item.orderItemId, item.name, item.image);
      }}
      className="mt-3 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm px-4 py-2 flex items-center space-x-2"
    >
      <Star className="h-4 w-4 fill-blue-600" />
      <span>Sửa đánh giá</span>
    </Button>
  );
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
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState<{
    orderItemId: number;
    name: string;
    image: string;
  } | null>(null);

  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returningProduct, setReturningProduct] = useState<{
    orderItemId: number;
    name: string;
    image: string;
  } | null>(null);

  if (!isOpen || !order) return null;
  console.log(order);
  const handleReviewProduct = (
    orderItemId: number,
    productName: string,
    productImage: string
  ) => {
    setReviewingProduct({
      orderItemId: orderItemId,
      name: productName,
      image: productImage,
    });
    setShowReviewForm(true);
  };

  const handleReturnProduct = (
    orderItemId: number,
    productName: string,
    productImage: string
  ) => {
    setReturningProduct({
      orderItemId: orderItemId,
      name: productName,
      image: productImage,
    });
    setShowReturnForm(true);
  };
  const handleCancel = async () => {
    if (!order) return;
    try {
      const response = await cancelOrder(order.id);
      if (!response.data) {
        toast.error(response.message || "Hủy đơn hàng thất bại.");
        return;
      }
      toast.success("Hủy đơn hàng thành công.");
      onClose();
    } catch (ex) {
      const error = ex as Error;
      toast.error(error.message || "Hủy đơn hàng thất bại.");
    }
  };
  const orderSteps = getOrderSteps(order.status);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto scrollbar-custom">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="border-b bg-white p-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {statusIcons[order.status]}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Đơn hàng #{order.id}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Ngày đặt: {order.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadgeClass(
                      order.status
                    )}`}
                  >
                    {statusIcons[order.status]}
                    <span className="ml-2">{order.status}</span>
                  </span>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Order Progress Timeline */}
              {order.status !== "Đã hủy" && (
                <div className="flex items-center justify-between mt-6 relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{
                        width: `${
                          (orderSteps.filter(s => s.completed).length /
                            orderSteps.length) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  {orderSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center relative z-10"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                          step.completed
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-gray-300" />
                        )}
                      </div>
                      <p
                        className={`text-xs mt-2 text-center max-w-[80px] ${
                          step.completed
                            ? "text-gray-900 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content - 2 Columns Layout */}
            <div className="grid grid-cols-5 divide-x flex-1 overflow-hidden">
              {/* Left Column - Products (3/5 width) - SCROLLABLE */}
              <div className="col-span-3 p-6 overflow-y-auto scrollbar-custom">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Sản phẩm đã đặt ({order.items.length})
                </h3>

                <div className="space-y-4">
                  {order.items.map(item => (
                    <div
                      key={item.orderItemId}
                      className="border rounded-lg p-4 hover:border-gray-400 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-20 w-20 rounded-md object-cover border"
                          />
                          <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 line-clamp-2">
                            {item.name}
                          </h4>
                          {item.size && (
                            <p className="text-sm text-gray-500 mt-1">
                              {item.size}
                            </p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600">
                              <span>{item.price.toLocaleString("vi-VN")}₫</span>
                              <span className="mx-2">×</span>
                              <span>{item.quantity}</span>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {(item.price * item.quantity).toLocaleString(
                                "vi-VN"
                              )}
                              ₫
                            </p>
                          </div>

                          {order.status === "Đã giao" &&
                            renderReviewButton(
                              order.date,
                              // item.review,
                              item,
                              handleReviewProduct
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Summary & Info (2/5 width) - NO SCROLL */}
              <div className="col-span-2 p-6 bg-gray-50 overflow-y-auto">
                {/* Delivery Address */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                    Địa chỉ nhận hàng
                  </h3>
                  <div className="bg-white border rounded-lg p-4 space-y-2.5 text-sm">
                    <div className="flex items-start space-x-2">
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        Nguyễn Văn A
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                      <span className="text-gray-600">0123 456 789</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                      <p className="text-gray-600 leading-relaxed">
                        123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Phương thức thanh toán
                  </h3>
                  <div className="bg-white border rounded-lg p-4 text-sm">
                    <p className="text-gray-900 font-medium">
                      {order.payment == null
                        ? "Thanh toán khi nhận hàng (COD)"
                        : "Thanh toán qua SEPAY"}
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Chi tiết thanh toán
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tạm tính</span>
                      <span className="text-gray-900">
                        {order.total.toLocaleString("vi-VN")}₫
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className="text-green-600 font-medium">
                        Miễn phí
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá</span>
                      <span className="text-gray-900">0₫</span>
                    </div>

                    <div className="pt-3 mt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          Tổng cộng
                        </span>
                        <span className="font-bold text-xl text-blue-600">
                          {order.total.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {(order.status === "Chờ xác nhận" && (
                  <div className="mt-4 space-y-2">
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        handleCancel();
                      }}
                    >
                      Hủy đơn hàng
                    </Button>
                  </div>
                )) ||
                  (order.status === "Đang giao" && (
                    <div className="mt-4 space-y-2">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                          toast.success(
                            "Cảm ơn bạn đã nhận hàng! Vui lòng đánh giá sản phẩm."
                          );
                          onClose();
                        }}
                      >
                        Xác nhận đã nhận hàng
                      </Button>
                    </div>
                  )) ||
                  (order.status === "Đã giao" && (
                    <div className="mt-4 space-y-2">
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          // Mở ReturnForm với thông tin sản phẩm đầu tiên (hoặc cho user chọn)
                          if (order.items.length > 0) {
                            const firstItem = order.items[0];
                            handleReturnProduct(
                              firstItem.orderItemId,
                              firstItem.name,
                              firstItem.image
                            );
                          }
                        }}
                      >
                        Đổi / Trả hàng
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReviewForm && reviewingProduct && (
        <ReviewForm
          orderItemId={reviewingProduct.orderItemId}
          productName={reviewingProduct.name}
          productImage={reviewingProduct.image}
          onClose={() => {
            setShowReviewForm(false);
            setReviewingProduct(null);
          }}
        />
      )}

      {showReturnForm && returningProduct && (
        <ReturnForm
          orderItemId={returningProduct.orderItemId}
          productName={returningProduct.name}
          productImage={returningProduct.image}
          onClose={() => {
            setShowReturnForm(false);
            setReturningProduct(null);
          }}
        />
      )}
    </>
  );
}
