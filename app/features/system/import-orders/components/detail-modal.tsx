import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Package,
  Building2,
  Calendar,
  DollarSign,
  Box,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { getPurchaseOrderDetail } from "~/services/purchase-order";
import toast from "react-hot-toast";

interface DetailModalProps {
  open: boolean;
  orderId: number | null;
  onClose: () => void;
}

interface PurchaseOrderDetail {
  purchaseOrderId: number;
  supplierId: number;
  supplierName: string;
  supplier: {
    name: string;
    contactName: string;
    email: string;
    phone: string;
    address: string;
  };
  orderDate: string;
  statusId: number;
  statusName: string;
  status: {
    displayName: string;
  };
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    purchaseOrderItemId: number;
    productVariantId: number;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    profitPercentage: number;
    isPushed: boolean;
  }>;
}

export function DetailImportOrderModal({
  open,
  orderId,
  onClose,
}: DetailModalProps) {
  const [orderDetail, setOrderDetail] = useState<PurchaseOrderDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && orderId) {
      fetchOrderDetail();
    }
  }, [open, orderId]);

  const fetchOrderDetail = async () => {
    if (!orderId) return;

    setIsLoading(true);
    try {
      const response = await getPurchaseOrderDetail(orderId);
      if (response.isSuccess) {
        setOrderDetail(response.data);
      } else {
        toast.error("Không thể tải chi tiết đơn hàng");
      }
    } catch (error) {
      console.error("Error fetching order detail:", error);
      toast.error("Có lỗi xảy ra khi tải chi tiết đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 45: // Draft
        return "bg-gray-100 text-gray-700";
      case 46: // Pending
        return "bg-yellow-100 text-yellow-700";
      case 47: // Completed
        return "bg-green-100 text-green-700";
      case 48: // Cancelled
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1400px] max-h-[90vh] overflow-hidden flex flex-col scrollbar-custom">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <span>Chi tiết đơn nhập hàng #{orderId}</span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : orderDetail ? (
          <div className="space-y-6 overflow-y-auto pr-2">
            {/* Header info cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">
                      Nhà cung cấp
                    </p>
                    <p className="font-bold text-gray-900 text-sm">
                      {orderDetail.supplier.name}
                    </p>
                  </div>
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-green-600 font-medium mb-1">
                      Ngày đặt hàng
                    </p>
                    <p className="font-bold text-gray-900 text-sm">
                      {format(new Date(orderDetail.orderDate), "dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </p>
                  </div>
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-purple-600 font-medium mb-1">
                      Tổng giá trị
                    </p>
                    <p className="font-bold text-purple-700 text-lg">
                      {formatCurrency(orderDetail.totalAmount)}
                    </p>
                  </div>
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Supplier details */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Thông tin nhà cung cấp
                </h3>
                <Badge className={`${getStatusColor(orderDetail.statusId)}`}>
                  {orderDetail.status.displayName}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Người liên hệ</p>
                  <p className="font-medium text-gray-900">
                    {orderDetail.supplier.contactName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                  <p className="font-medium text-gray-900">
                    {orderDetail.supplier.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-900">
                    {orderDetail.supplier.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
                  <p className="font-medium text-gray-900">
                    {orderDetail.supplier.address}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <Separator />

            {/* Danh sách sản phẩm */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Box className="h-5 w-5 text-blue-600" />
                Sản phẩm ({orderDetail.items.length})
              </h3>

              <div className="border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-700 w-16">
                          STT
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700">
                          SKU
                        </th>
                        <th className="text-center p-4 font-semibold text-gray-700 w-24">
                          Số lượng
                        </th>
                        <th className="text-right p-4 font-semibold text-gray-700 w-36">
                          Đơn giá
                        </th>
                        <th className="text-right p-4 font-semibold text-gray-700 w-36">
                          Thành tiền
                        </th>
                        <th className="text-center p-4 font-semibold text-gray-700 w-28">
                          Lợi nhuận
                        </th>
                        <th className="text-center p-4 font-semibold text-gray-700 w-24">
                          Đẩy lên
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orderDetail.items.map((item, index) => (
                        <tr
                          key={item.purchaseOrderItemId}
                          className="hover:bg-blue-50/50 transition-colors"
                        >
                          <td className="p-4 text-gray-600 font-medium">
                            {index + 1}
                          </td>
                          <td className="p-4">
                            <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-800">
                              {item.sku}
                            </code>
                          </td>
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="p-4 text-right text-gray-700 font-medium">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="p-4 text-right font-bold text-gray-900">
                            {formatCurrency(item.totalPrice)}
                          </td>
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                              +{item.profitPercentage.toFixed(1)}%
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {item.isPushed ? (
                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Đã đẩy</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                                <XCircle className="h-3 w-3" />
                                <span>Chưa</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gradient-to-r from-blue-50 to-blue-100 border-t-2">
                      <tr>
                        <td
                          colSpan={4}
                          className="p-4 text-right font-bold text-gray-900"
                        >
                          Tổng cộng:
                        </td>
                        <td className="p-4 text-right font-bold text-xl text-blue-600">
                          {formatCurrency(orderDetail.totalAmount)}
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Thông tin thời gian */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-gray-500">Ngày tạo</p>
                  <p className="text-sm font-medium text-gray-700">
                    {format(
                      new Date(orderDetail.createdAt),
                      "dd/MM/yyyy HH:mm",
                      {
                        locale: vi,
                      }
                    )}
                  </p>
                </div>
                <div className="h-10 w-px bg-gray-300"></div>
                <div>
                  <p className="text-xs text-gray-500">Cập nhật lần cuối</p>
                  <p className="text-sm font-medium text-gray-700">
                    {format(
                      new Date(orderDetail.updatedAt),
                      "dd/MM/yyyy HH:mm",
                      {
                        locale: vi,
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Không tìm thấy thông tin đơn hàng</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
