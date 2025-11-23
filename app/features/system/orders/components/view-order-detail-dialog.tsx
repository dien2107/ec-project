import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { Button } from "~/components/ui/button";
import {
  User,
  CreditCard,
  Truck,
  Package,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react";
import {
  statusMap,
  type Order,
  type OrderStatus,
  type OrderStatusName,
} from "../types";
import OrderDetail from "./order-detail";
import { toast } from "react-hot-toast";
import { approveOrder, cancelOrder } from "~/services/order";
import { useAppDispatch } from "~/redux/store";
import { ConfirmActionDialog } from "./confirmation-modal";

export default function ViewOrderDetailDialog({
  order,
  open,
  setIsOpen,
  onOrderUpdated,
}: {
  order: Order | null;
  open: boolean;
  setIsOpen: (open: boolean) => void;
  onOrderUpdated?: () => void;
}) {
  console.log(JSON.stringify(order));
  const dispatch = useAppDispatch();

  const handleCancel = async () => {
    if (!order) return;
    try {
      const response = await cancelOrder(order.orderId);
      if (!response.isSuccess) {
        throw new Error(response.message || "Hủy đơn hàng thất bại.");
      }
      toast.success("Hủy đơn hàng thành công.");
      setIsOpen(false);
      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } catch (ex) {
      const error = ex as any;
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Hủy đơn hàng thất bại."
      );
    }
  };

  const handleApprove = async () => {
    if (!order) return;
    try {
      const response = await approveOrder(order.orderId);
      console.log(response);
      if (!response.isSuccess) {
        throw new Error(response.message || "Duyệt đơn hàng thất bại.");
      }
      toast.success("Duyệt đơn hàng thành công.");
      setIsOpen(false);
      if (onOrderUpdated) {
        onOrderUpdated();
      }
    } catch (ex) {
      const error = ex as any;
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Duyệt đơn hàng thất bại."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent
        className="min-w-[1000px] max-w-[1200px] bg-[#F8FAFC]"
        aria-describedby={undefined}
      >
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 -mx-6 -mt-6 px-6 py-5 rounded-t-xl border-b border-gray-200">
          <DialogTitle className="font-bold text-2xl text-gray-800">
            Chi tiết đơn hàng{" "}
            <span className="text-blue-600">#{order?.orderId}</span>
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Thông tin chi tiết về đơn hàng
          </p>
        </DialogHeader>

        {/* Start: Dialog body */}
        <div className="overflow-y-auto scrollbar-custom max-h-[70vh]">
          <div className="grid grid-cols-2 gap-5 mb-5 mx-1">
            {/* Customer Info Card */}
            <Card className="col-span-1 shadow-md border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">
                      Thông tin khách hàng
                    </h3>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">Họ và tên</p>
                      <p className="font-semibold text-gray-800">
                        {order?.user.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">
                        Số điện thoại
                      </p>
                      <p className="font-semibold text-gray-800">
                        {order?.user.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">
                        Địa chỉ giao hàng
                      </p>
                      <p className="font-medium text-gray-700 text-sm leading-relaxed">
                        {order?.addressInfo}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Info Card */}
            <Card className="col-span-1 shadow-md border-purple-100 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-500 rounded-lg">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">
                      Thông tin đơn hàng
                    </h3>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">
                        Ngày đặt hàng
                      </p>
                      <p className="font-semibold text-gray-800">
                        {new Date(order?.createdAt ?? "").toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                      <span
                        className={`inline-flex items-center gap-1.5 ${statusMap[order?.status?.name as keyof typeof statusMap]?.color ?? "bg-gray-400"} py-1.5 px-3 rounded-full text-white text-sm font-medium shadow-sm`}
                      >
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        {statusMap[
                          order?.status?.name as keyof typeof statusMap
                        ]?.label ?? "Không rõ"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">
                        Phương thức thanh toán
                      </p>
                      <p className="font-semibold text-gray-800">
                        {order?.payment == null
                          ? "COD (Thanh toán khi nhận hàng)"
                          : "SEPAY"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">
                        Đơn vị vận chuyển
                      </p>
                      <p className="font-semibold text-gray-800">
                        {order?.ship === null
                          ? "Chưa xác định"
                          : order?.ship?.corpName}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table show list items */}
          <OrderDetail order={order} />
          {/* End: Dialog body */}
        </div>

        {order?.status?.name !== "Delivered" &&
          order?.status?.name !== "Cancelled" && (
            <DialogFooter className="py-4 border-t-2 bg-gray-50 -mx-6 -mb-6 px-6 rounded-b-xl">
              {/* Nút hủy đơn - chỉ hiện khi trạng thái là Pending (Chờ xác nhận) */}
              {order?.status?.name === "Pending" && (
                <ConfirmActionDialog
                  title="Xác nhận hủy đơn hàng"
                  description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                  onConfirm={handleCancel}
                >
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-500 border-2 hover:bg-red-50 font-semibold"
                  >
                    Hủy đơn
                  </Button>
                </ConfirmActionDialog>
              )}

              {/* Nút duyệt đơn - ẩn khi trạng thái là Shipping (Đang giao), Delivered, Cancelled */}
              {order?.status?.name !== "Shipping" &&
                (order?.status?.name as OrderStatusName) !== "Delivered" &&
                (order?.status?.name as OrderStatusName) !== "Cancelled" && (
                  <ConfirmActionDialog
                    title="Xác nhận duyệt đơn hàng"
                    description="Bạn có chắc chắn muốn duyệt đơn hàng này không?"
                    confirmText="Duyệt"
                    onConfirm={handleApprove}
                  >
                    <Button className="bg-[#3770EC] text-white hover:bg-blue-700 font-semibold shadow-md">
                      Duyệt đơn hàng
                    </Button>
                  </ConfirmActionDialog>
                )}
            </DialogFooter>
          )}
      </DialogContent>
    </Dialog>
  );
}
