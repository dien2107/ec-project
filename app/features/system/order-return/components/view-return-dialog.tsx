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
import { Package, Repeat2, User, Calendar } from "lucide-react";
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
  });

export default function ViewReturnDialog({
  open,
  setIsOpen,
  returnData,
}: ViewReturnDialogProps) {
  const statusConfig = {
    draft: { label: "Nháp", color: "bg-gray-100 text-gray-800" },
    pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
    processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800" },
    approved: { label: "Đã duyệt", color: "bg-green-100 text-green-800" },
    rejected: { label: "Từ chối", color: "bg-red-100 text-red-800" },
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="w-full max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chi tiết phiếu đổi/trả
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Info */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {returnData.id}
              </div>
              <div className="text-sm text-slate-500">
                Đơn gốc: {returnData.orderId}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  returnData.type === "exchange"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {returnData.type === "exchange" ? (
                  <>
                    <Repeat2 className="w-4 h-4 mr-2" /> Đổi hàng
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" /> Trả hàng
                  </>
                )}
              </div>
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  statusConfig[returnData.status].color
                }`}
              >
                {statusConfig[returnData.status].label}
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Thông tin khách hàng
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Tên khách hàng:</span>
                <span className="text-sm font-medium">
                  {returnData.customer.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Số điện thoại:</span>
                <span className="text-sm font-medium">
                  {returnData.customer.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Thông tin sản phẩm
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <img
                  src={returnData.product.image}
                  alt={returnData.product.name}
                  className="w-20 h-20 rounded border object-cover"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">
                      Tên sản phẩm:
                    </span>
                    <span className="text-sm font-medium">
                      {returnData.product.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Mã SKU:</span>
                    <span className="text-sm font-medium">
                      {returnData.product.sku}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Đơn giá:</span>
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(returnData.product.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Số lượng:</span>
                    <span className="text-sm font-medium">
                      {returnData.quantity}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-semibold text-slate-700">
                      Tổng tiền:
                    </span>
                    <span className="text-base font-bold text-green-600">
                      {formatCurrency(
                        returnData.product.price * returnData.quantity
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Return Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Chi tiết đổi/trả
            </h3>
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Ngày yêu cầu:</span>
                <span className="text-sm font-medium">
                  {formatDate(returnData.requestDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Lý do:</span>
                <span className="text-sm font-medium">{returnData.reason}</span>
              </div>
              {returnData.description && (
                <div className="pt-2 border-t">
                  <span className="text-sm text-slate-600 block mb-1">
                    Mô tả chi tiết:
                  </span>
                  <p className="text-sm text-slate-800">
                    {returnData.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
