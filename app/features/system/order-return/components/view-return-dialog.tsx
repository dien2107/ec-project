// components/view-return-dialog.tsx
import React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Package,
  Repeat2,
  User,
  Calendar,
  Phone,
  Hash,
  FileText,
  DollarSign,
  X,
  ShoppingBag,
} from "lucide-react";
import type { ReturnStatus } from "../types";

type ReturnType = "exchange" | "return";

interface Customer {
  name: string;
  phone: string;
}

interface Product {
  name: string;
  sku: string;
  price: number;
  image: string;
}

interface Return {
  id: string;
  orderId: string;
  orderItemId: number;
  type: ReturnType;
  customer: Customer;
  product: Product;
  reason: string;
  description: string;
  status: ReturnStatus;
  requestDate: string;
  quantity: number;
}

interface ViewReturnDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  returnData: Return;
  onCompleteExchange?: (ret: Return) => void;
  onCompleteReturn?: (ret: Return) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ViewReturnDialog({
  open,
  setIsOpen,
  returnData,
  onCompleteExchange,
  onCompleteReturn,
}: ViewReturnDialogProps) {
  const statusConfig = {
    pending: {
      label: "Chờ xử lý",
      color: "bg-yellow-500 text-white",
      bgColor: "bg-yellow-50",
      dotColor: "bg-yellow-200",
    },
    approved: {
      label: "Đã duyệt",
      color: "bg-green-500 text-white",
      bgColor: "bg-green-50",
      dotColor: "bg-green-200",
    },
    rejected: {
      label: "Từ chối",
      color: "bg-red-500 text-white",
      bgColor: "bg-red-50",
      dotColor: "bg-red-200",
    },
    completed: {
      label: "Hoàn thành",
      color: "bg-blue-500 text-white",
      bgColor: "bg-blue-50",
      dotColor: "bg-blue-200",
    },
  };

  const totalAmount = returnData.product.price * returnData.quantity;

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-6 py-5 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
                Chi tiết phiếu đổi/trả
              </DialogTitle>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Hash className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-gray-800">
                    {returnData.id}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="text-sm text-gray-600">
                  Đơn gốc:{" "}
                  <span className="font-semibold text-gray-800">
                    {returnData.orderId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Type & Status Badges */}
          <div className="flex items-center gap-2 mt-4">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-md ${
                returnData.type === "exchange"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
              }`}
            >
              {returnData.type === "exchange" ? (
                <>
                  <Repeat2 className="w-4 h-4" /> Đổi hàng
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" /> Trả hàng
                </>
              )}
            </div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-md ${
                statusConfig[returnData.status].color
              }`}
            >
              <div
                className={`w-2 h-2 ${statusConfig[returnData.status].dotColor} rounded-full animate-pulse`}
              ></div>
              {statusConfig[returnData.status].label}
            </div>
          </div>
        </DialogHeader>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            {/* Customer Info */}
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-blue-500 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">
                  Thông tin khách hàng
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Họ và tên</p>
                    <p className="font-semibold text-gray-800">
                      {returnData.customer.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">
                      Số điện thoại
                    </p>
                    <p className="font-semibold text-gray-800">
                      {returnData.customer.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-purple-500 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">
                  Thông tin sản phẩm
                </h3>
              </div>

              <div className="flex items-start gap-4 bg-white rounded-lg p-4 border border-gray-200">
                <img
                  src={returnData.product.image}
                  alt={returnData.product.name}
                  className="w-24 h-24 rounded-lg border-2 border-gray-200 object-cover shadow-md flex-shrink-0"
                />
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tên sản phẩm</p>
                    <p className="font-semibold text-gray-800 text-base leading-snug">
                      {returnData.product.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Mã sản phẩm</p>
                      <p className="font-semibold text-gray-700 text-sm">
                        {returnData.orderItemId}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Số lượng</p>
                      <p className="font-semibold text-gray-700 text-sm">
                        ×{returnData.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Đơn giá:</span>
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(returnData.product.price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-green-50 -mx-2 px-2 py-2 rounded-lg">
                      <span className="font-bold text-gray-800">
                        Tổng tiền:
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Return Details */}
            <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-orange-500 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">
                  Chi tiết đổi/trả
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Ngày yêu cầu</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(returnData.requestDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Lý do</p>
                    <p className="font-semibold text-gray-800">
                      {returnData.reason}
                    </p>
                  </div>
                </div>

                {returnData.description && (
                  <div className="pt-3 border-t border-orange-200">
                    <p className="text-xs text-gray-500 mb-2 font-medium">
                      Mô tả chi tiết:
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {returnData.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between w-full gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="font-semibold px-6"
            >
              Đóng
            </Button>

            {returnData.status === "approved" && (
              <Button
                onClick={() => {
                  if (returnData.type === "exchange") {
                    onCompleteExchange?.(returnData);
                  } else {
                    onCompleteReturn?.(returnData);
                  }
                  setIsOpen(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6"
              >
                {returnData.type === "exchange"
                  ? "Hoàn thành (Đã gửi lại cho khách)"
                  : "Hoàn thành (Đã hoàn tiền)"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
