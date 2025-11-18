import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  Star,
  Truck,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import type {
  OrderItem,
  OrderStatus,
} from "~/features/clients/user-profile/types/user";
import { cancelOrder, completeOrder } from "~/services/order";
import { toast } from "react-hot-toast";
import ReturnForm from "./return-form";
import ReviewForm from "./review/review-form";
import { useAppDispatch, useAppSelector, type RootState } from "~/redux/store";
import { fetchOrderListDataByUserId } from "~/redux/slices/orders";

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
  handleReviewProduct: (item: OrderItem["items"][0]) => void
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
          handleReviewProduct(item);
        }}
        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 flex items-center space-x-2"
      >
        <Star className="h-4 w-4" />
        <span>Viết đánh giá</span>
      </Button>
    );
  }

  if (item.review.isEdited)
    return (
      <Button
        onClick={() => {
          handleReviewProduct(item);
        }}
        className="mt-3 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm px-4 py-2 flex items-center space-x-2"
      >
        <Star className="h-4 w-4 fill-blue-600" />
        <span>Xem đánh giá</span>
      </Button>
    );

  // Nếu đã có review
  return (
    <Button
      onClick={() => {
        handleReviewProduct(item);
      }}
      className="mt-3 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm px-4 py-2 flex items-center space-x-2"
    >
      <Star className="h-4 w-4 fill-blue-600" />
      <span>Sửa đánh giá</span>
    </Button>
  );
};

export default function OrderDetailsModal({
  setSearchParams,
  order,
  isOpen,
  onClose,
}: {
  setSearchParams: (params: URLSearchParams) => void;
  order: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState<
    OrderItem["items"][0] | null
  >(null);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returningProduct, setReturningProduct] = useState<
    OrderItem["items"][0] | null
  >(null);

  // Hàm reload lại dữ liệu đơn hàng
  const reloadOrderData = () => {
    if (user?.data?.userId) {
      dispatch(fetchOrderListDataByUserId(user.data.userId));
    }
  };

  // Callback để update review sau khi tạo/sửa thành công
  const handleReviewSuccess = () => {
    reloadOrderData();
  };

  if (!isOpen || !order) return null;
  // accept whole item to simplify calls and allow future expansion (mode, reviewId inside item.review)
  const handleReviewProduct = (item: OrderItem["items"][0]) => {
    setReviewingProduct(item);
    setShowReviewForm(true);
  };

  const handleReturnProduct = (item: OrderItem["items"][0]) => {
    setReturningProduct(item);
    setShowReturnForm(true);
  };
  const handleCancel = async () => {
    if (!order) return;
    try {
      const response = await cancelOrder(order.id);
      if (!response.data) {
        throw new Error(response.message || "Hủy đơn hàng thất bại.");
      }
      toast.success("Hủy đơn hàng thành công.");
      onClose();
      // Reload trang để refresh danh sách đơn hàng
      window.location.reload();
    } catch (ex) {
      const error = ex as Error;
      toast.error(error.message || "Hủy đơn hàng thất bại.");
    }
  };
  const handleComplete = async () => {
    if (!order) return;
    try {
      const response = await completeOrder(order.id);
      if (!response.data) {
        throw new Error(response.message || "Hoàn tất đơn hàng thất bại.");
      }
      toast.success("Hoàn tất đơn hàng thành công.");
      onClose();
      // Reload trang để refresh danh sách đơn hàng
      window.location.reload();
    } catch (ex) {
      const error = ex as Error;
      toast.error(error.message || "Hoàn tất đơn hàng thất bại.");
    }
  };
  const orderSteps = getOrderSteps(order.status);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto scrollbar-custom">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="flex min-h-full items-center justify-center p-2 lg:p-4">
          <div className="relative bg-white rounded-md lg:rounded-lg shadow-xl w-full max-w-full lg:max-w-7xl max-h-[90vh] overflow-hidden flex flex-col text-sm lg:text-base mx-2 lg:mx-0">
            {/* Header */}
            <div className="border-b bg-white p-3 lg:p-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 lg:space-x-4">
                  {statusIcons[order.status]}
                  <div>
                    <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                      Đơn hàng #{order.id}
                    </h2>
                    <p className="text-xs lg:text-sm text-gray-500 mt-1">
                      Ngày đặt: {order.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs lg:text-sm font-medium ${statusBadgeClass(
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
                // Overflow-x cho mobile/tablet, giữ layout desktop
                <div className="mt-4 relative overflow-x-auto -mx-3 lg:mx-0 px-3 lg:px-0 py-2">
                  <div className="absolute top-7 left-0 right-0 h-0.5 bg-gray-200">
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

                  <div className="flex items-center space-x-6 lg:space-x-0 lg:justify-between w-max lg:w-full">
                    {orderSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center relative z-10 min-w-[64px]"
                      >
                        <div
                          className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                            step.completed
                              ? "bg-blue-600 border-blue-600"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                          ) : (
                            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-gray-300" />
                          )}
                        </div>
                        <p
                          className={`text-xs mt-2 text-center max-w-[70px] lg:max-w-[80px] truncate ${
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
                </div>
              )}
            </div>

            {/* Content - 2 Columns Layout */}
            <div className="grid lg:grid-cols-5 grid-cols-1 lg:divide-x flex-1 overflow-hidden">
              {/* Left Column - Products (3/5 width on desktop, full width on mobile) - SCROLLABLE */}
              <div className="col-span-1 lg:col-span-3 p-3 lg:p-6 overflow-y-auto scrollbar-custom">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-sm lg:text-base">
                  <Package className="h-5 w-5 mr-2" />
                  Sản phẩm đã đặt ({order.items.length})
                </h3>

                <div className="space-y-3">
                  {order.items.map(item => (
                    <div
                      key={item.orderItemId}
                      className="border rounded-lg p-2 lg:p-4 hover:border-gray-400 transition-colors"
                    >
                      <div className="flex items-start space-x-3 lg:space-x-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover h-14 w-14 lg:h-20 lg:w-20 rounded-md border"
                          />
                          <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] lg:text-xs font-medium rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 line-clamp-2 truncate text-sm lg:text-base">
                            {item.name}
                          </h4>
                          {item.size && (
                            <p className="text-xs lg:text-sm text-gray-500 mt-1">
                              {item.size}
                            </p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center text-xs lg:text-sm text-gray-600">
                              <span>{item.price.toLocaleString("vi-VN")}₫</span>
                              <span className="mx-2">×</span>
                              <span>{item.quantity}</span>
                            </div>
                            <p className="font-semibold text-gray-900 text-sm lg:text-base">
                              {(item.price * item.quantity).toLocaleString(
                                "vi-VN"
                              )}
                              ₫
                            </p>
                          </div>

                          {order.status === "Đã giao" &&
                            renderReviewButton(
                              order.date,
                              item,
                              handleReviewProduct
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Summary & Info (2/5 width on desktop, stacked below on mobile) - NO SCROLL */}
              <div className="col-span-1 lg:col-span-2 p-3 lg:p-6 bg-gray-50 overflow-y-auto">
                {/* Delivery Address */}
                <div className="mb-4 lg:mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm lg:text-base">
                    <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                    Địa chỉ nhận hàng
                  </h3>
                  <div className="bg-white border rounded-lg p-3 lg:p-4 space-y-2.5 text-sm">
                    <div className="flex items-start space-x-2">
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {order.ReceivedName}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                      <span className="text-gray-600">{order.PhoneNumber}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                      <p className="text-gray-600 leading-relaxed text-xs lg:text-sm">
                        {order.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-4 lg:mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm lg:text-base">
                    Phương thức thanh toán
                  </h3>
                  <div className="bg-white border rounded-lg p-3 lg:p-4 text-sm">
                    <p className="text-gray-900 font-medium text-xs lg:text-sm">
                      {order.payment == null
                        ? "Thanh toán khi nhận hàng (COD)"
                        : "Thanh toán qua SEPAY"}
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white border rounded-lg p-3 lg:p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm lg:text-base">
                    Chi tiết thanh toán
                  </h3>

                  <div className="space-y-3 text-sm lg:text-base">
                    <div className="flex justify-between text-xs lg:text-sm">
                      <span className="text-gray-600">Tạm tính</span>
                      <span className="text-gray-900 font-medium">
                        {(
                          order.total -
                          order.shippingFee +
                          (order.discount ? order.discount.discountValue : 0)
                        ).toLocaleString("vi-VN")}
                        ₫
                      </span>
                    </div>

                    <div className="flex justify-between text-xs lg:text-sm">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      {order.shippingFee && order.shippingFee > 0 ? (
                        <span className="text-gray-900 text-xs lg:text-sm">
                          {order.shippingFee.toLocaleString("vi-VN")}₫
                        </span>
                      ) : (
                        <span className="text-green-600 font-medium text-xs lg:text-sm">
                          Miễn phí
                        </span>
                      )}
                    </div>

                    {order.discount && order.discount.discountValue > 0 && (
                      <div className="flex justify-between text-xs lg:text-sm">
                        <span className="text-gray-600">Giảm giá</span>
                        <span className="text-red-600 font-medium">
                          -
                          {order.discount.discountValue.toLocaleString("vi-VN")}
                          ₫
                        </span>
                      </div>
                    )}

                    <div className="pt-3 mt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 text-sm lg:text-base">
                          Tổng cộng
                        </span>
                        <div className="text-right">
                          {order.discount &&
                            order.discount.discountValue > 0 && (
                              <div className="text-sm text-gray-400 line-through mb-1">
                                {(
                                  order.total + order.discount.discountValue
                                ).toLocaleString("vi-VN")}
                                ₫
                              </div>
                            )}
                          <span className="font-bold text-lg lg:text-xl text-blue-600">
                            {order.total.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
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
                          handleComplete();
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
                          if (order.items.length > 0) {
                            handleReturnProduct(order.items[0]);
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
          item={reviewingProduct}
          mode={
            reviewingProduct.review?.isEdited
              ? "view"
              : reviewingProduct.review
                ? "edit"
                : "create"
          }
          onSuccess={handleReviewSuccess}
          onClose={() => {
            setShowReviewForm(false);
            setReviewingProduct(null);
          }}
        />
      )}

      {showReturnForm && (
        <ReturnForm
          order={order}
          onClose={() => {
            setShowReturnForm(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
